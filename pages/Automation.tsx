

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    fetchSchedulerJobs, 
    createSchedulerJob, 
    updateSchedulerJob, 
    deleteSchedulerJob, 
    toggleSchedulerJob, 
    runSchedulerJobNow 
} from '../services/api';
import { SchedulerJob, Page, Job } from '../types';
import AutomationHeader from '../components/automation/AutomationHeader';
import JobTable from '../components/automation/JobTable';
import JobDetailPanel from '../components/automation/JobDetailPanel';
import NewAutomationModal from '../components/automation/NewAutomationModal';
import { useJobs, useNotifier, Spinner } from '../App';

interface AutomationProps {
    setActivePage: (page: Page) => void;
}

const Automation: React.FC<AutomationProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [jobs, setJobs] = useState<SchedulerJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<SchedulerJob | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<SchedulerJob | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof SchedulerJob; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [schedulerStatus, setSchedulerStatus] = useState<'running' | 'paused' | 'error'>('running');

    const loadJobs = useCallback(async () => {
        if (!isModalOpen) setLoading(true);
        try {
            const data = await fetchSchedulerJobs();
            setJobs(data);
            if (data.length > 0) {
                setSelectedJob(prev => data.find(j => j.id === prev?.id) || data[0]);
            } else {
                setSelectedJob(null);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load scheduled jobs.', 'error');
            setSchedulerStatus('error');
        } finally {
            setLoading(false);
        }
    }, [addNotification, isModalOpen]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const handleOpenNewModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (job: SchedulerJob) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };
    
    const handleDuplicateJob = (jobToDuplicate: SchedulerJob) => {
        setEditingJob({
            ...jobToDuplicate,
            id: '', // Clear ID for duplication
            name: `Copy of ${jobToDuplicate.name}`,
            enabled: false,
            lastRun: undefined,
            nextRun: undefined,
        });
        setIsModalOpen(true);
    };

    const handleSaveJob = async (jobData: Partial<SchedulerJob>) => {
        try {
            const isEditing = !!editingJob && !!editingJob.id;
            const savedJob = isEditing
                ? await updateSchedulerJob(editingJob!.id, jobData)
                : await createSchedulerJob(jobData);

            addNotification(`Job "${savedJob.name}" saved successfully.`, 'success');
            await loadJobs();
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to save job.', 'error');
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        const jobToDelete = jobs.find(j => j.id === jobId);
        if (!jobToDelete) return;

        if (window.confirm(`Are you sure you want to delete job "${jobToDelete.name}"?`)) {
            try {
                await deleteSchedulerJob(jobId);
                addNotification(`Job "${jobToDelete.name}" deleted.`, 'success');
                await loadJobs();
            } catch (error) {
                addNotification(error instanceof Error ? error.message : `Failed to delete job.`, 'error');
            }
        }
    };
    
    const handleToggleJob = async (jobId: string) => {
        try {
            const updatedJob = await toggleSchedulerJob(jobId);
            addNotification(`Job "${updatedJob.name}" ${updatedJob.enabled ? 'enabled' : 'disabled'}.`, 'success');
            await loadJobs();
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to toggle job.', 'error');
        }
    };
    
    const handleRunJob = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if(job) {
             addJob({
                name: `Manual Run: ${job.name}`,
                message: 'Manually triggered job run...',
                trigger: () => runSchedulerJobNow(jobId),
            });
        }
    };

    const handleSort = useCallback((key: keyof SchedulerJob) => {
        setSortConfig(prev => {
            const isAsc = prev?.key === key && prev.direction === 'ascending';
            return { key, direction: isAsc ? 'descending' : 'ascending' };
        });
    }, []);

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = jobs.filter(job => 
            job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.owner.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === undefined || aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (bVal === undefined || aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [jobs, searchTerm, sortConfig]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col h-full -m-6">
            {isModalOpen && (
                <NewAutomationModal 
                    onClose={() => { setIsModalOpen(false); setEditingJob(null); }} 
                    onSave={handleSaveJob}
                    jobToEdit={editingJob}
                />
            )}

            <AutomationHeader
                onNewAutomation={handleOpenNewModal}
                jobs={jobs}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRunJob={handleRunJob}
                schedulerStatus={schedulerStatus}
                setActivePage={setActivePage}
            />
            
            <div className="flex-1 flex min-h-0">
                <div className="w-full lg:w-3/5 border-r border-border flex flex-col">
                    <JobTable 
                        jobs={filteredAndSortedJobs}
                        selectedJob={selectedJob}
                        onSelectJob={setSelectedJob}
                        onRunJob={handleRunJob}
                        onDeleteJob={handleDeleteJob}
                        onToggleJob={handleToggleJob}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onEditJob={handleOpenEditModal}
                        setActivePage={setActivePage}
                    />
                </div>
                
                <div className="hidden lg:block lg:w-2/5 overflow-y-auto">
                   {selectedJob ? (
                        <JobDetailPanel 
                            job={selectedJob} 
                            onRunJob={handleRunJob}
                            onDeleteJob={handleDeleteJob}
                            onToggleJob={handleToggleJob}
                            onDuplicateJob={handleDuplicateJob}
                        />
                    ) : (
                        <div className="p-8 text-center text-text-secondary">Select a job to see details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Automation;