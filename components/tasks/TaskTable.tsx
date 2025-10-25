import React from 'react';
import { TaskExecution, Page } from '../../types';
import { StopCircleIcon, ArrowPathIcon, DocumentMagnifyingGlassIcon, PuzzlePieceIcon } from '../shared/Icons';

interface TaskTableProps {
    tasks: TaskExecution[];
    selectedTask: TaskExecution | null;
    onSelectTask: (task: TaskExecution) => void;
    onDoubleClickTask: (task: TaskExecution) => void;
    onCancelTask: (taskId: string) => void;
    onRetryTask: (taskId: string) => void;
    setActivePage: (page: Page) => void;
}

const getStatusClasses = (status: TaskExecution['status']) => {
    switch (status) {
        case 'Running': return { bg: 'bg-blue-500/10', text: 'text-blue-400', pill: 'bg-blue-500' };
        case 'Completed': return { bg: 'bg-green-500/10', text: 'text-green-400', pill: 'bg-green-500' };
        case 'Waiting': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', pill: 'bg-yellow-500' };
        case 'Failed': return { bg: 'bg-red-500/10', text: 'text-red-400', pill: 'bg-red-500' };
        case 'Cancelled': return { bg: 'bg-gray-500/10', text: 'text-gray-400', pill: 'bg-gray-500' };
        case 'Paused': return { bg: 'bg-gray-500/10', text: 'text-gray-400', pill: 'bg-gray-500' };
        default: return { bg: '', text: 'text-text-secondary', pill: 'bg-gray-600' };
    }
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, selectedTask, onSelectTask, onDoubleClickTask, onCancelTask, onRetryTask, setActivePage }) => {
    return (
         <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-3">Task</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Agent</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3">Start Time</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Created By</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => {
                        const statusClasses = getStatusClasses(task.status);
                        const isSelected = selectedTask?.id === task.id;
                        return (
                            <tr
                                key={task.id}
                                onClick={() => onSelectTask(task)}
                                onDoubleClick={() => onDoubleClickTask(task)}
                                title={`Created by: ${task.createdBy} | Priority: ${task.priority}`}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : `${statusClasses.bg} hover:bg-secondary`}`}
                            >
                                <td className="p-3">
                                    <p className="font-bold">{task.title}</p>
                                    <p className="text-xs text-text-secondary font-mono">{task.id.split('_')[0]}</p>
                                </td>
                                <td className="p-3 font-mono text-xs">{task.type}</td>
                                <td className="p-3 text-text-secondary">{task.agent}</td>
                                <td className="p-3">
                                     <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${statusClasses.pill} ${task.status === 'Running' && 'animate-pulse'}`}></span>
                                        <span className={`font-semibold ${statusClasses.text}`}>{task.status}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="w-24 bg-background rounded-full h-2.5" title={`${task.progress}% complete`}>
                                        <div className={`h-2.5 rounded-full ${statusClasses.pill.replace('bg-','bg-')}`} style={{ width: `${task.progress}%` }}></div>
                                    </div>
                                </td>
                                <td className="p-3 text-xs font-mono">{new Date(task.startTime).toLocaleString()}</td>
                                <td className="p-3 font-mono text-xs">{task.duration}</td>
                                <td className="p-3 text-xs">{task.priority}</td>
                                <td className="p-3 text-xs">{task.createdBy}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        {(task.status === 'Running' || task.status === 'Waiting') && <ActionButton icon={StopCircleIcon} onClick={() => onCancelTask(task.id)} title="Cancel Task" />}
                                        {task.status === 'Failed' && <ActionButton icon={ArrowPathIcon} onClick={() => onRetryTask(task.id)} title="Retry Task" />}
                                        <ActionButton icon={DocumentMagnifyingGlassIcon} onClick={() => setActivePage(Page.Logs)} title="View Logs" />
                                        <ActionButton icon={PuzzlePieceIcon} onClick={() => onSelectTask(task)} title="Inspect Inputs" />
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


const ActionButton: React.FC<{icon: React.FC<{className: string}>, onClick: React.MouseEventHandler, title: string}> = ({ icon: Icon, onClick, title}) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(e); }} 
        className='p-1.5 rounded-md text-text-secondary hover:bg-background'
        title={title}
    >
        <Icon className="h-5 w-5" />
    </button>
);

export default TaskTable;