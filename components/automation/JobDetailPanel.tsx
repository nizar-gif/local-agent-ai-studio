import React, { useState } from 'react';
import { SchedulerJob } from '../../types';
import { PlayIcon, DocumentDuplicateIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '../shared/Icons';

interface JobDetailPanelProps {
    job: SchedulerJob;
    onRunJob: (jobId: string) => void;
    onDeleteJob: (jobId: string) => void;
    onToggleJob: (jobId: string) => void;
    onDuplicateJob: (job: SchedulerJob) => void;
}

type ActiveTab = 'Overview' | 'Schedule' | 'Parameters' | 'Logs' | 'Performance';

const JobDetailPanel: React.FC<JobDetailPanelProps> = ({ job, onRunJob, onDeleteJob, onToggleJob, onDuplicateJob }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <div className="space-y-4">
                    <InfoItem label="Description" value={job.description || 'No description provided.'} />
                    <InfoItem label="Owner" value={job.owner} />
                    <InfoItem label="Job Type" value={job.jobType} />
                    <InfoItem label="Creation Date" value="2023-10-27 10:00:00" />
                    <InfoItem label="Associated Agents/Workflows" value={job.owner === 'Agent' || job.owner === 'Workflow' ? 'View Details >' : 'N/A'} />
                </div>;
            case 'Schedule':
                return <div className="space-y-4">
                    <InfoItem label="Trigger Type" value={job.triggerType} />
                    <InfoItem label="Cron / Interval Expression" value={job.triggerValue} mono />
                    <InfoItem label="Timezone" value="Asia/Baghdad" />
                    <InfoItem label="Next Run" value={job.nextRun ? new Date(job.nextRun).toLocaleString() : 'N/A'} />
                    <InfoItem label="Previous Run" value={job.lastRun ? new Date(job.lastRun.timestamp).toLocaleString() : 'N/A'} />
                    <button className="text-sm font-semibold text-primary hover:underline">Validate Schedule</button>
                </div>;
            case 'Parameters':
                return <pre className="text-xs bg-black p-3 rounded-md font-mono whitespace-pre-wrap">{JSON.stringify(job.parameters || { info: "No parameters for this job." }, null, 2)}</pre>;
            case 'Logs':
                return (
                    <div className="text-sm text-text-secondary font-mono bg-background p-3 rounded-md border border-border h-64 overflow-y-auto">
                        <p>[{new Date().toLocaleString()}] INFO: Job execution started.</p>
                        <p>[{new Date().toLocaleString()}] INFO: Performing health check on Ollama...</p>
                        <p>[{new Date().toLocaleString()}] SUCCESS: Ollama OK, latency 128ms.</p>
                        <p>[{new Date().toLocaleString()}] INFO: Job finished successfully.</p>
                    </div>
                );
            case 'Performance':
                return <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary p-3 rounded-lg"><p className="text-xs text-text-secondary">Avg. Runtime</p><p className="text-lg font-bold">1.8s</p></div>
                        <div className="bg-secondary p-3 rounded-lg"><p className="text-xs text-text-secondary">Success Rate</p><p className="text-lg font-bold">98%</p></div>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg">
                        <p className="text-sm font-semibold mb-2">Runtime History</p>
                        <div className="h-40 bg-background rounded-md flex items-center justify-center text-xs text-text-secondary">Chart Placeholder</div>
                    </div>
                </div>;
            default: return null;
        }
    };

    const statusConfig = job.enabled 
        ? job.lastRun?.status === 'running' 
            ? { text: 'Running', color: 'text-blue-400' } 
            : { text: 'Idle', color: 'text-text-secondary' }
        : { text: 'Disabled', color: 'text-gray-500' };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold">{job.name}</h3>
                        <p className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.text}</p>
                    </div>
                </div>
                <div className="mt-4 border-b border-border">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton name="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Schedule" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Parameters" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Logs" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Performance" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </div>
            <div className="flex-1 py-6 overflow-y-auto">
                {renderContent()}
            </div>
            <div className="flex-shrink-0 border-t border-border pt-4 flex gap-2">
                <ActionButton icon={PlayIcon} text="Run Now" onClick={() => onRunJob(job.id)} />
                <ActionButton icon={job.enabled ? CheckCircleIcon : XCircleIcon} text={job.enabled ? "Disable" : "Enable"} onClick={() => onToggleJob(job.id)} />
                <ActionButton icon={DocumentDuplicateIcon} text="Duplicate" onClick={() => onDuplicateJob(job)} />
                <ActionButton icon={TrashIcon} text="Delete" onClick={() => onDeleteJob(job.id)} danger />
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; danger?: boolean }> = ({ icon: Icon, text, onClick, danger = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 text-sm font-bold py-1.5 px-3 rounded-lg transition-colors
            ${danger 
                ? 'text-red-400 hover:bg-red-500/20'
                : 'text-text-secondary bg-secondary hover:bg-background'
            }
        `}>
        <Icon className="h-4 w-4" />
        <span>{text}</span>
    </button>
);


const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(name)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

const InfoItem: React.FC<{label: string, value: string, mono?: boolean}> = ({ label, value, mono }) => (
    <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{label}</p>
        <p className={`text-sm mt-1 text-text-primary ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
);


export default JobDetailPanel;