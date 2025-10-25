import React from 'react';
import { TaskExecution } from '../../types';
import { PlusIcon, ArrowPathIcon, ArchiveBoxXMarkIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../shared/Icons';

interface TaskHeaderProps {
    tasks: TaskExecution[];
    onNewTask: () => void;
    onClearCompleted: () => void;
    filter: string;
    setFilter: (filter: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    onRefresh: () => void;
}

const FILTER_CHIPS = ['All', 'Chat', 'Workflow', 'RAG', 'Automation', 'File', 'Custom'];

const TaskHeader: React.FC<TaskHeaderProps> = ({ tasks, onNewTask, onClearCompleted, filter, setFilter, typeFilter, setTypeFilter, onRefresh }) => {
    const running = tasks.filter(t => t.status === 'Running').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const failed = tasks.filter(t => t.status === 'Failed').length;
    const queued = tasks.filter(t => t.status === 'Waiting').length;

    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col border-b border-border gap-4">
            <div className="w-full flex justify-between items-start">
                 <div>
                    <h2 className="text-xl font-semibold text-text-primary">Task Mission Control</h2>
                    <div className="flex items-center gap-4 text-sm mt-1 text-text-secondary">
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> {running} Running</span>
                        <span className="flex items-center gap-1.5"><CheckCircleIcon className="h-4 w-4 text-green-400" /> {completed} Completed</span>
                        <span className="flex items-center gap-1.5"><XCircleIcon className="h-4 w-4 text-red-500" /> {failed} Failed</span>
                        <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-yellow-500" /> {queued} Queued</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Filter by status, agent, type..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-background border border-border rounded-lg px-4 py-2 w-64 text-sm focus:ring-primary focus:border-primary transition"
                    />
                    <button onClick={onNewTask} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
                        <PlusIcon className="h-5 w-5" />
                        New Task
                    </button>
                    <button onClick={onRefresh} className="p-2 rounded-lg hover:bg-background" title="Refresh"><ArrowPathIcon className="h-5 w-5 text-text-secondary"/></button>
                    <button onClick={onClearCompleted} className="p-2 rounded-lg hover:bg-background" title="Clear Completed"><ArchiveBoxXMarkIcon className="h-5 w-5 text-text-secondary"/></button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {FILTER_CHIPS.map(chip => (
                    <button
                        key={chip}
                        onClick={() => setTypeFilter(chip)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            typeFilter === chip 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-card border-border text-text-secondary hover:bg-background hover:border-gray-600'
                        }`}
                    >
                        {chip}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default TaskHeader;