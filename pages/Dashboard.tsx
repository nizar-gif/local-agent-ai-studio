

import React, { useState, useEffect, useCallback } from 'react';
import { fetchDashboardSummary } from '../services/api';
import { DashboardSummary, Page, Job } from '../types';
import QuickActionTile from '../components/dashboard/QuickActionTile';
import StatusCard from '../components/dashboard/StatusCard';
import ResourceChart from '../components/dashboard/ResourceChart';
import AlertFeed from '../components/dashboard/AlertFeed';
import FooterLogBar from '../components/dashboard/FooterLogBar';
import JobHistory from '../components/dashboard/JobHistory';
import { useJobs, useNotifier, Spinner, useChatSession } from '../App';

import { 
    ChatBubbleLeftRightIcon, 
    CommandLineIcon, 
    CodeBracketSquareIcon, 
    DocumentPlusIcon,
    PauseIcon,
    ArrowPathIcon,
    ArchiveBoxXMarkIcon
} from '../components/shared/Icons';

interface DashboardProps {
    setActivePage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const { requestNewChat } = useChatSession();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const data = await fetchDashboardSummary();
            setSummary(data);
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'An unknown error occurred while fetching dashboard data.', 'error');
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        setLoading(true);
        fetchData();
        const interval = setInterval(fetchData, 30000); // Re-fetch every 30 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleSystemAction = (name: string, message: string) => {
        addJob({ name, message });
    };

    const handleNewChatClick = () => {
        requestNewChat();
        setActivePage(Page.Chat);
    };
    
    if (loading && !summary) return <Spinner />;

    if (!summary) return (
        <div className="text-center p-8 text-text-secondary">
            <h2 className="text-xl font-bold text-text-primary mb-2">Could not load dashboard data.</h2>
            <p>An error occurred while fetching system summary. Please try again later.</p>
             <button onClick={() => { setLoading(true); fetchData(); }} className="mt-4 text-sm font-bold text-primary hover:underline">
                Retry Now
             </button>
        </div>
    );

    const hasErrors = summary.alerts.some(a => a.severity === 'error');
    const hasWarnings = summary.alerts.some(a => a.severity === 'warning');

    return (
        <div className="flex flex-col h-full -m-6">
            <div className="flex-1 p-6 overflow-y-auto">
                 {hasErrors ? (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold text-center py-2 px-4 rounded-lg mb-6">
                        🔴 Critical System Error Detected - Check Alerts Below
                    </div>
                ) : hasWarnings ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm font-semibold text-center py-2 px-4 rounded-lg mb-6">
                        🟡 System Warnings Present - Review Alerts
                    </div>
                ) : (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm font-semibold text-center py-2 px-4 rounded-lg mb-6">
                        All Systems Operational
                    </div>
                )}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <QuickActionTile icon={ChatBubbleLeftRightIcon} title="New Chat" onClick={handleNewChatClick} />
                            <QuickActionTile icon={CommandLineIcon} title="Create Task" onClick={() => setActivePage(Page.Tasks)} />
                            <QuickActionTile icon={CodeBracketSquareIcon} title="Run Workflow" onClick={() => setActivePage(Page.Workflows)} />
                            <QuickActionTile icon={DocumentPlusIcon} title="Add Document" onClick={() => setActivePage(Page.RAG)} />
                        </div>
                         <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-bold mb-3 text-text-secondary">System Controls</h3>
                            <div className="flex flex-col gap-2">
                                <QuickActionTile icon={PauseIcon} title="Pause Scheduler" description="Halt all scheduled jobs." small onClick={() => handleSystemAction("Pause Scheduler", "Pausing all scheduled jobs...")} />
                                <QuickActionTile icon={ArrowPathIcon} title="Restart Backend" description="Gracefully restart services." small onClick={() => handleSystemAction("Restart Backend", "Restarting core services...")}/>
                                <QuickActionTile icon={ArchiveBoxXMarkIcon} title="Flush Cache" description="Clear in-memory caches." small onClick={() => handleSystemAction("Flush Caches", "Clearing all in-memory caches...")} />
                            </div>
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="xl:col-span-5 space-y-6">
                        <StatusCard 
                            title="Agent Activity" 
                            status={summary.agentActivity.activeAgents === 0 ? 'error' : summary.agentActivity.queuedTasks > 10 ? 'warning' : 'ok'}
                            metrics={[
                                {label: 'Active Agents', value: summary.agentActivity.activeAgents.toString()},
                                {label: 'Queued Tasks', value: summary.agentActivity.queuedTasks.toString()},
                                {label: 'Throughput', value: `${summary.agentActivity.throughput.toFixed(1)} t/min`},
                            ]}
                            onClick={() => setActivePage(Page.Agents)}
                        />
                         <StatusCard 
                            title="Model Health" 
                            status={summary.modelHealth.latency[summary.modelHealth.latency.length-1] > 500 ? 'warning' : 'ok'} 
                            metrics={[
                                {label: 'Current LLM', value: summary.modelHealth.name},
                                {label: 'Context', value: `${summary.modelHealth.contextWindow} tokens`},
                                {label: 'Temp', value: summary.modelHealth.temperature.toString()},
                            ]}
                            chartData={summary.modelHealth.latency}
                            chartLabel="Latency (ms)"
                            onClick={() => setActivePage(Page.Settings)}
                        />
                        <StatusCard 
                            title="Automation" 
                            status={summary.automation.schedulerStatus === 'running' ? 'ok' : 'warning'} 
                            metrics={[
                                {label: 'Scheduler', value: summary.automation.schedulerStatus, color: summary.automation.schedulerStatus === 'running' ? 'text-green-400' : 'text-yellow-400'},
                                {label: 'Next Job In', value: summary.automation.nextJobIn},
                            ]}
                            onClick={() => setActivePage(Page.Automation)}
                        />
                         <StatusCard 
                            title="Knowledge Base" 
                            status={
                                summary.knowledgeBase.embeddingsPercent <= 5 ? 'error' :
                                summary.knowledgeBase.embeddingsPercent < 100 ? 'warning' : 'ok'
                            }
                            metrics={[
                                {label: 'Indexed Docs', value: summary.knowledgeBase.documentsIndexed.toString()},
                                {label: 'Embeddings', value: `${summary.knowledgeBase.embeddingsPercent}%`},
                                {label: 'Last Rebuild', value: summary.knowledgeBase.lastRebuild},
                            ]}
                            onClick={() => setActivePage(Page.RAG)}
                        />
                        <AlertFeed alerts={summary.alerts} setActivePage={setActivePage} />
                    </div>

                    {/* Right Column */}
                     <div className="xl:col-span-4 space-y-6">
                        <ResourceChart title="CPU / GPU" data1={summary.performance.cpu} data2={summary.performance.gpu} onDoubleClick={() => setActivePage(Page.Monitoring)} />
                        <ResourceChart title="Memory / VRAM" data1={summary.performance.memory} data2={summary.performance.vram} onDoubleClick={() => setActivePage(Page.Monitoring)} />
                        <ResourceChart title="Disk I/O (MB/s)" data1={summary.performance.diskIO} onDoubleClick={() => setActivePage(Page.Monitoring)} />
                        <ResourceChart title="Network Latency (ms)" data1={summary.performance.networkLatency} onDoubleClick={() => setActivePage(Page.Monitoring)} />
                        <JobHistory jobs={summary.jobHistory} />
                    </div>
                </div>
            </div>
            <FooterLogBar logs={summary.logs} />
        </div>
    );
};

export default Dashboard;
