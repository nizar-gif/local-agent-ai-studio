import React from 'react';
import { SchedulerJob, Page } from '../../types';
import { PlayIcon, PencilSquareIcon, DocumentMagnifyingGlassIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../shared/Icons';

interface JobTableProps {
    jobs: SchedulerJob[];
    selectedJob: SchedulerJob | null;
    onSelectJob: (job: SchedulerJob) => void;
    onRunJob: (jobId: string) => void;
    onDeleteJob: (jobId: string) => void;
    onToggleJob: (jobId: string) => void;
    sortConfig: { key: keyof SchedulerJob; direction: 'ascending' | 'descending' } | null;
    onSort: (key: keyof SchedulerJob) => void;
    onEditJob: (job: SchedulerJob) => void;
    setActivePage: (page: Page) => void;
}

const SortableHeader: React.FC<{
    label: string;
    sortKey: keyof SchedulerJob;
    sortConfig: JobTableProps['sortConfig'];
    onSort: JobTableProps['onSort'];
}> = ({ label, sortKey, sortConfig, onSort }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';
    return (
        <th className="p-3 cursor-pointer hover:bg-background" onClick={() => onSort(sortKey)}>
            {label} <span className="text-xs">{directionIcon}</span>
        </th>
    );
};


const LastRunStatusIcon: React.FC<{ status: 'succeeded' | 'failed' | 'running' }> = ({ status }) => {
    switch (status) {
        case 'succeeded': return <CheckCircleIcon className="h-4 w-4 text-green-500"><title>Last run succeeded</title></CheckCircleIcon>;
        case 'failed': return <XCircleIcon className="h-4 w-4 text-red-500"><title>Last run failed</title></XCircleIcon>;
        case 'running': return <ClockIcon className="h-4 w-4 text-blue-400 animate-spin"><title>Running</title></ClockIcon>;
        default: return null;
    }
};

const getStatusRowClass = (status?: 'succeeded' | 'failed' | 'running') => {
    switch (status) {
        case 'succeeded': return 'bg-green-500/5';
        case 'failed': return 'bg-red-500/5';
        case 'running': return 'bg-blue-500/5';
        default: return '';
    }
}

const JobTable: React.FC<JobTableProps> = ({ jobs, selectedJob, onSelectJob, onRunJob, onDeleteJob, onToggleJob, sortConfig, onSort, onEditJob, setActivePage }) => {
    return (
        <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <SortableHeader label="Name / ID" sortKey="name" sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Type" sortKey="jobType" sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Trigger" sortKey="triggerType" sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Next Run" sortKey="nextRun" sortConfig={sortConfig} onSort={onSort} />
                        <th className="p-3">Last Run</th>
                        <th className="p-3">Duration</th>
                        <SortableHeader label="Enabled" sortKey="enabled" sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Owner" sortKey="owner" sortConfig={sortConfig} onSort={onSort} />
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => {
                        const isSelected = selectedJob?.id === job.id;
                        const rowStatusClass = getStatusRowClass(job.lastRun?.status);
                        return (
                            <tr
                                key={job.id}
                                onClick={() => onSelectJob(job)}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : `${rowStatusClass} hover:bg-secondary`}`}
                            >
                                <td className="p-3">
                                    <p className="font-bold">{job.name}</p>
                                    <p className="text-xs text-text-secondary font-mono">{job.id}</p>
                                </td>
                                <td className="p-3 text-xs font-mono">{job.jobType}</td>
                                <td className="p-3">
                                    <p className="font-semibold capitalize">{job.triggerType}</p>
                                    <p className="text-xs font-mono text-text-secondary">{job.triggerValue}</p>
                                </td>
                                <td className="p-3 text-xs font-mono">{job.nextRun ? new Date(job.nextRun).toLocaleString() : 'N/A'}</td>
                                <td className="p-3">
                                    {job.lastRun && <LastRunStatusIcon status={job.lastRun.status} />}
                                </td>
                                <td className="p-3 text-xs font-mono">{job.lastRun?.duration || 'N/A'}</td>
                                <td className="p-3" onClick={(e) => { e.stopPropagation(); onToggleJob(job.id); }}>
                                    <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${job.enabled ? 'bg-primary' : 'bg-gray-600'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${job.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </div>
                                </td>
                                <td className="p-3 text-xs">{job.owner}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <ActionButton icon={PlayIcon} onClick={() => onRunJob(job.id)} title="Run Now"/>
                                        <ActionButton icon={PencilSquareIcon} onClick={() => onEditJob(job)} title="Edit Job" />
                                        <ActionButton icon={DocumentMagnifyingGlassIcon} onClick={() => setActivePage(Page.Logs)} title="View Logs" />
                                        <ActionButton icon={TrashIcon} onClick={() => onDeleteJob(job.id)} danger title="Delete" />
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{ className: string }>, onClick: React.MouseEventHandler, danger?: boolean, title?: string }> = ({ icon: Icon, onClick, danger, title }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        title={title}
        className={`p-1.5 rounded-md ${danger ? 'text-red-400 hover:bg-red-500/20' : 'text-text-secondary hover:bg-secondary'}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);


export default JobTable;