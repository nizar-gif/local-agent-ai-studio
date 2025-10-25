

import React, { useState, useEffect, useCallback } from 'react';
import { fetchDashboardSummary } from '../services/api';
import { DashboardSummary, Page, Job } from '../types';
import { CpuChipIcon, CodeBracketSquareIcon, ClockIcon } from '../components/shared/Icons';
import MonitoringHeader from '../components/monitoring/MonitoringHeader';
import SectionHeader from '../components/monitoring/SectionHeader';
import ResourceChart from '../components/monitoring/ResourceChart';
import MetricCard from '../components/monitoring/MetricCard';
import ListCard from '../components/monitoring/ListCard';
import LiveFeed from '../components/monitoring/LiveFeed';
import { useJobs, useNotifier, Spinner } from '../App';


// --- Mock Data ---
const MOCK_AI_METRICS = {
    tokenUsage: 18400000,
    failureRate: 0.8,
    avgChainDepth: 5.2,
    activeLangGraphFlows: 3,
    smolAgentsExecs: 12,
    autoGenConvos: 5,
    topAgents: [
        { name: 'Research Planner', tasks: 128 },
        { name: 'Code Generator', tasks: 97 },
        { name: 'Data Analyst', tasks: 54 },
    ],
    topTools: [
        { name: 'FileReadTool', calls: 340 },
        { name: 'DuckDuckGoSearchTool', calls: 210 },
        { name: 'PythonExecTool', calls: 150 },
    ],
};

interface MonitoringProps {
    setActivePage: (page: Page) => void;
}

// --- Main Component ---
const Monitoring: React.FC<MonitoringProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [uptime, setUptime] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    
    const fetchData = useCallback(async () => {
        try {
            const data = await fetchDashboardSummary();
            setSummary(data);
            setLastUpdated(new Date());
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load monitoring data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        setLoading(true);
        fetchData();
        const dataInterval = setInterval(fetchData, 5000);
        const uptimeInterval = setInterval(() => setUptime(u => u + 1), 1000);
        return () => {
            clearInterval(dataInterval);
            clearInterval(uptimeInterval);
        };
    }, [fetchData]);

    const handlePauseScheduler = () => {
        addJob({
            name: "Pause Scheduler",
            message: "Pausing all scheduled jobs...",
        });
    };

    if (loading && !summary) return <Spinner />;

    if (!summary) return (
         <div className="text-center p-8 text-text-secondary">
            <h2 className="text-xl font-bold text-text-primary mb-2">Could not load system telemetry.</h2>
            <p>An error occurred while fetching monitoring data. Please try again later.</p>
         </div>
    );

    const formatUptime = (totalSeconds: number) => {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="flex flex-col h-full -m-6">
            <MonitoringHeader
                isHealthy={!summary.alerts.some(a => a.severity === 'error')}
                automationStatus={summary.automation.schedulerStatus}
                uptime={formatUptime(uptime)}
                onRefresh={fetchData}
                setActivePage={setActivePage}
            />
            <div className="flex-1 flex min-h-0">
                <main className="flex-1 p-6 overflow-y-auto space-y-8">
                    {/* System Resources */}
                    <section>
                        <SectionHeader title="System Resources" icon={CpuChipIcon} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ResourceChart title="CPU Usage" data={summary.performance.cpu} label="%" alertThreshold={90} />
                            <ResourceChart title="Memory Usage" data={summary.performance.memory} label="%" alertThreshold={90} />
                            <ResourceChart title="GPU Usage" data={summary.performance.gpu} label="%" alertThreshold={90} />
                            <ResourceChart title="VRAM Usage" data={summary.performance.vram} label="%" alertThreshold={90} />
                        </div>
                    </section>
                    
                     {/* AI Metrics */}
                    <section>
                        <SectionHeader title="AI / LLM Metrics" icon={CodeBracketSquareIcon} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Tokens Processed" value={(MOCK_AI_METRICS.tokenUsage / 1000000).toFixed(1)} unit="M" />
                            <MetricCard title="Tool Call Failure Rate" value={MOCK_AI_METRICS.failureRate.toFixed(1)} unit="%" />
                            <MetricCard title="Avg. Chain Depth" value={MOCK_AI_METRICS.avgChainDepth.toFixed(1)} />
                            <ResourceChart title="LLM Latency" data={summary.modelHealth.latency} label="ms" alertThreshold={1500} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <ListCard title="Top 3 Active Agents" items={MOCK_AI_METRICS.topAgents.map(a => ({ name: a.name, value: `${a.tasks} tasks` }))} />
                            <ListCard title="Top 3 Used Tools" items={MOCK_AI_METRICS.topTools.map(t => ({ name: t.name, value: `${t.calls} calls` }))} />
                        </div>
                    </section>

                    {/* Automation & Scheduler */}
                     <section>
                        <SectionHeader title="Automation & Scheduler" icon={ClockIcon} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Scheduler Status" value={summary.automation.schedulerStatus.toUpperCase()}>
                                <button onClick={handlePauseScheduler} className="text-sm font-semibold text-primary hover:underline mt-2">Pause Scheduler</button>
                            </MetricCard>
                            <MetricCard title="Next Job In" value={summary.automation.nextJobIn} />
                            <ListCard title="Recent Job History" items={summary.jobHistory.slice(0, 5).map(j => ({name: j.name, value: j.status, status: j.status}))} />
                        </div>
                    </section>
                </main>
                <LiveFeed setActivePage={setActivePage} />
            </div>
        </div>
    );
};

export default Monitoring;