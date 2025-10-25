

import React from 'react';
import { PlusIcon, PlayIcon, PauseIcon, TrashIcon, ShareIcon } from '../shared/Icons';
import { Job } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { useJobs } from '../../App';


interface WorkflowHeaderProps {
    stats: { active: number; draft: number; scheduled: number };
    onNewWorkflow: () => void;
    selection: string[];
}

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; disabled?: boolean; }> = ({ icon: Icon, text, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors bg-card border border-border text-text-secondary hover:bg-background hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed">
        <Icon className="h-5 w-5" />
        <span>{text}</span>
    </button>
);


const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ stats, onNewWorkflow, selection }) => {
    const { addJob } = useJobs();
    const handleRunSelected = () => {
        addJob({
            name: `Run ${selection.length} Workflows`,
            message: 'Initializing workflow executions...',
        });
    };

    const createDummyJob = (name: string, message: string) => {
        addJob({ name, message });
    };
    
    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">Workflow Designer</h2>
                <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-green-400">{stats.active} active</span> / {stats.draft} draft / {stats.scheduled} scheduled
                </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Filter workflows..."
                    className="bg-background border border-border rounded-lg px-4 py-2 w-64 text-sm focus:ring-primary focus:border-primary transition"
                />
                
                 <div className="h-8 border-l border-border mx-1"></div>

                <button onClick={onNewWorkflow} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
                    <PlusIcon className="h-5 w-5" />
                    New Workflow
                </button>
                <ActionButton icon={PlayIcon} text="Run Selected" onClick={handleRunSelected} disabled={selection.length === 0} />
                <ActionButton icon={PauseIcon} text="Pause" onClick={() => createDummyJob('Pause Workflows', 'Pausing selected workflows...')} disabled={selection.length === 0} />

                <button onClick={() => createDummyJob('Export Workflows', 'Exporting selected workflows...')} className="p-2 rounded-lg hover:bg-background text-text-secondary" title="Export / Import"><ShareIcon className="h-5 w-5"/></button>
                <button onClick={() => { if (window.confirm('Are you sure?')) createDummyJob('Delete Workflows', 'Deleting selected workflows...'); }} className="p-2 rounded-lg hover:bg-background text-text-secondary" title="Delete Selected" disabled={selection.length === 0}><TrashIcon className="h-5 w-5"/></button>
            </div>
        </header>
    );
};

export default WorkflowHeader;
