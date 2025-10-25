import React from 'react';
import { SchedulerJob } from '../../types';
import { PlayIcon, PencilSquareIcon, DocumentMagnifyingGlassIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../../components/shared/Icons';

interface JobTableProps {
    jobs: SchedulerJob[];
    selectedJob: SchedulerJob | null;
    onSelectJob: (job: SchedulerJob) => void;
}

const LastRunStatusIcon: React.FC<{ status: 'succeeded' | 'failed' | 'running' }> = ({ status }) => {
    switch (status) {
        case 'succeeded': return <CheckCircleIcon className="h-4 w-4 text-green-500"><title>Last run succeeded</title></CheckCircleIcon>;
        case 'failed': return <XCircleIcon className="h-4 w-4 text-red-500"><title>Last run failed</title></XCircleIcon>;
        case 'running': return <ClockIcon className="h-4 w-4 text-blue-400 animate-spin"><title>Running</title></ClockIcon>;
        default: return null;
    }
};

const JobTable: React.FC<JobTableProps> = ({ jobs, selectedJob, onSelectJob }) => {
    return (
        <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-3">Name</th>
                        <th className="p-3">Trigger</th>
                        <th className="p-3">Next Run</th>
                        <th className="p-3">Last Run</th>
                        <th className="p-3">Enabled</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => {
                        const isSelected = selectedJob?.id === job.id;
                        return (
                            <tr
                                key={job.id}
                                onClick={() => onSelectJob(job)}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                            >
                                <td className="p-3">
                                    <p className="font-bold">{job.name}</p>
                                    <p className="text-xs text-text-secondary">{job.jobType}</p>
                                </td>
                                <td className="p-3">
                                    <p className="font-semibold capitalize">{job.triggerType}</p>
                                    <p className="text-xs font-mono text-text-secondary">{job.triggerValue}</p>
                                </td>
                                <td className="p-3 text-xs font-mono">{job.nextRun ? new Date(job.nextRun).toLocaleString() : 'N/A'}</td>
                                <td className="p-3">
                                    {job.lastRun && (
                                        <div className="flex items-center gap-2">
                                            <LastRunStatusIcon status={job.lastRun.status} />
                                            <span className="text-xs text-text-secondary">{job.lastRun.duration}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className={`w-5 h-5 flex items-center justify-center rounded-full ${job.enabled ? 'bg-green-500' : 'bg-gray-500'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <ActionButton icon={PlayIcon} onClick={() => alert(`Running ${job.name}`)} />
                                        <ActionButton icon={PencilSquareIcon} onClick={() => alert(`Editing ${job.name}`)} />
                                        <ActionButton icon={DocumentMagnifyingGlassIcon} onClick={() => alert(`Viewing logs for ${job.name}`)} />
                                        <ActionButton icon={TrashIcon} onClick={() => alert(`Deleting ${job.name}`)} danger />
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

const ActionButton: React.FC<{ icon: React.FC<{ className: string }>, onClick: React.MouseEventHandler, danger?: boolean }> = ({ icon: Icon, onClick, danger }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={`p-1.5 rounded-md ${danger ? 'text-red-400 hover:bg-red-500/20' : 'text-text-secondary hover:bg-secondary'}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);


export default JobTable;