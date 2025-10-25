import React from 'react';
import { JobHistoryItem } from '../../types';
import { CheckCircleIcon, XCircleIcon } from '../shared/Icons';

interface JobHistoryProps {
    jobs: JobHistoryItem[];
}

const JobHistory: React.FC<JobHistoryProps> = ({ jobs }) => {
    return (
        <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold text-text-secondary mb-4">Scheduler Job History</h3>
            <div className="relative pl-3">
                {/* Timeline line */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border rounded-full"></div>
                
                <div className="space-y-4">
                    {jobs.slice(0, 10).map((job) => (
                        <div key={job.id} className="flex items-start gap-4 relative">
                            <div className="absolute left-5 -translate-x-1/2 bg-card z-10">
                                {job.status === 'succeeded' ? 
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" /> : 
                                    <XCircleIcon className="h-5 w-5 text-red-500" />
                                }
                            </div>
                            <div className="ml-10 flex-1">
                                <p className="text-sm font-semibold">{job.name}</p>
                                <p className="text-xs text-text-secondary">{new Date(job.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobHistory;