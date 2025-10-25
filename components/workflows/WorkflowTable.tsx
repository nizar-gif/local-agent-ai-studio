

import React from 'react';
import { Workflow, Job, Page } from '../../types';
import { PlayIcon, PencilSquareIcon, DocumentDuplicateIcon, DocumentTextIcon, TrashIcon } from '../shared/Icons';
import { v4 as uuidv4 } from 'uuid';
import { useJobs } from '../../App';


interface WorkflowTableProps {
    workflows: Workflow[];
    selectedWorkflow: Workflow | null;
    onSelectWorkflow: (workflow: Workflow) => void;
    selection: string[];
    onSelectionChange: (selection: string[]) => void;
    setActivePage: (page: Page) => void;
}

const getStatusClasses = (status: Workflow['status']) => {
    switch (status) {
        case 'Active': return { bg: 'bg-green-500/10', text: 'text-green-400' };
        case 'Draft': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
        case 'Failed': return { bg: 'bg-red-500/10', text: 'text-red-400' };
        default: return { bg: '', text: 'text-text-secondary' };
    }
};

const WorkflowTable: React.FC<WorkflowTableProps> = ({ workflows, selectedWorkflow, onSelectWorkflow, selection, onSelectionChange, setActivePage }) => {
    const { addJob } = useJobs();
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(e.target.checked ? workflows.map(d => d.id) : []);
    };
    
    const handleSelectSingle = (id: string) => {
        onSelectionChange(selection.includes(id) ? selection.filter(i => i !== id) : [...selection, id]);
    };
    
    const handleRun = (wf: Workflow) => {
        addJob({
            name: `Run Workflow: ${wf.name}`,
            message: 'Initializing workflow...',
        });
    };

    return (
        <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-3"><input type="checkbox" onChange={handleSelectAll} checked={workflows.length > 0 && selection.length === workflows.length} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Created By</th>
                        <th className="p-3">Steps</th>
                        <th className="p-3">Last Run / Duration</th>
                        <th className="p-3">Next Run</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workflows.map(wf => {
                        const statusClasses = getStatusClasses(wf.status);
                        const isSelected = selectedWorkflow?.id === wf.id;
                        return (
                            <tr
                                key={wf.id}
                                onClick={() => onSelectWorkflow(wf)}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : `hover:bg-secondary`}`}
                            >
                                <td className="p-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selection.includes(wf.id)} onChange={() => handleSelectSingle(wf.id)} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></td>
                                <td className="p-3 font-bold">{wf.name}</td>
                                <td className="p-3 text-xs font-mono">{wf.type}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses.bg} ${statusClasses.text}`}>{wf.status}</span></td>
                                <td className="p-3 text-xs">{wf.createdBy}</td>
                                <td className="p-3">{wf.steps}</td>
                                <td className="p-3 text-xs">{wf.lastRun} ({wf.duration})</td>
                                <td className="p-3 text-xs">{wf.nextRun || 'N/A'}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <ActionButton icon={PlayIcon} onClick={() => handleRun(wf)} />
                                        <ActionButton icon={PencilSquareIcon} onClick={() => alert(`Editing ${wf.name}`)} />
                                        <ActionButton icon={DocumentDuplicateIcon} onClick={() => alert(`Duplicating ${wf.name}`)} />
                                        <ActionButton icon={DocumentTextIcon} onClick={() => setActivePage(Page.Logs)} />
                                        <ActionButton icon={TrashIcon} onClick={() => alert(`Deleting ${wf.name}`)} danger />
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

export default WorkflowTable;