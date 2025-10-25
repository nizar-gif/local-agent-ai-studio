import React, { useEffect } from 'react';
import { Job } from '../../types';
import { useJobs } from '../../App';

const ChartPlaceholder: React.FC<{ title: string, value: string, color: string }> = ({ title, value, color }) => (
    <div className="bg-secondary p-3 rounded-lg">
        <div className="flex justify-between items-baseline">
            <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
        <div className="mt-2 h-16 bg-background rounded-md flex items-end p-1">
             {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1/12 bg-primary/30" style={{height: `${Math.random()*80+10}%`, opacity: 0.2 + i * 0.06}}></div>
             ))}
        </div>
    </div>
);

const JobItem: React.FC<{ job: Job }> = ({ job }) => {
    const statusColor = {
        running: 'border-blue-500',
        succeeded: 'border-green-500',
        failed: 'border-red-500',
        cancelled: 'border-gray-500',
    }[job.status];

    return (
        <div className="p-3 bg-secondary rounded-lg">
            <p className="text-sm font-bold truncate">{job.name}</p>
            <p className="text-xs text-text-secondary capitalize">{job.status}</p>
            <div className="w-full bg-background rounded-full h-2.5 mt-2">
                <div className={`h-2.5 rounded-full ${statusColor.replace('border', 'bg')}`} style={{ width: `${job.progress}%` }}></div>
            </div>
            <p className="text-xs text-text-secondary mt-1 truncate">{job.message}</p>
        </div>
    )
}

const RightSystemPanel: React.FC = () => {
    const { jobs } = useJobs();
    
    return (
        <aside className="w-[320px] flex-shrink-0 bg-card p-4 rounded-lg border border-border flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-bold mb-3">Live System</h3>
                <div className="space-y-3">
                    <ChartPlaceholder title="CPU" value="34%" color="text-green-400" />
                    <ChartPlaceholder title="RAM" value="78%" color="text-yellow-400" />
                    <ChartPlaceholder title="GPU" value="12%" color="text-blue-400" />
                </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-lg font-bold mb-3">Jobs & Events</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {jobs.length === 0 ? (
                        <p className="text-sm text-text-secondary text-center py-4">No active jobs.</p>
                    ) : (
                        [...jobs].sort((a,b) => b.startTime - a.startTime).map(job => <JobItem key={job.id} job={job} />)
                    )}
                </div>
            </div>
        </aside>
    );
};

export default RightSystemPanel;