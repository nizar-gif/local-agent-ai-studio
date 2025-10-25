import React from 'react';
import { Agent, Page } from '../../types';
import { PlayCircleIcon, PauseCircleIcon, TrashIcon, BeakerIcon, PencilSquareIcon } from '../shared/Icons';

interface AgentTableProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
    onDoubleClickAgent: (agent: Agent) => void;
    onSetStatus: (agentId: string, status: Agent['status']) => void;
    onTerminate: (agentId: string) => void;
    onInspectMemory: (agentId: string) => void;
    onEdit: (agent: Agent) => void;
    setActivePage: (page: Page) => void;
}

const getStatusClasses = (status: Agent['status']) => {
    switch (status) {
        case 'Active': return { bg: 'bg-green-500/10', text: 'text-green-400', pill: 'bg-green-500' };
        case 'Idle': return { bg: 'bg-blue-500/10', text: 'text-blue-400', pill: 'bg-blue-500' };
        case 'Waiting': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', pill: 'bg-yellow-500' };
        case 'Error': return { bg: 'bg-red-500/10', text: 'text-red-400', pill: 'bg-red-500' };
        default: return { bg: '', text: 'text-text-secondary', pill: 'bg-gray-500' };
    }
};

const AgentTable: React.FC<AgentTableProps> = ({ agents, selectedAgent, onSelectAgent, onDoubleClickAgent, onSetStatus, onTerminate, onInspectMemory, onEdit, setActivePage }) => {
    if (agents.length === 0) {
        return <div className="p-8 text-center text-text-secondary">No agents found. Create one to get started.</div>;
    }
    
    return (
        <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-3">Name / Role</th>
                        <th className="p-3">Framework</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Uptime</th>
                        <th className="p-3">Last Task</th>
                        <th className="p-3">Memory</th>
                        <th className="p-3">Tokens (1h/Total)</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {agents.map(agent => {
                        const statusClasses = getStatusClasses(agent.status);
                        const isSelected = selectedAgent?.id === agent.id;
                        return (
                            <tr 
                                key={agent.id} 
                                onClick={() => onSelectAgent(agent)}
                                onDoubleClick={() => onDoubleClickAgent(agent)}
                                title={`Uptime: ${agent.uptime} | Last Task: ${agent.lastTask}`}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : `${statusClasses.bg} hover:bg-opacity-25`}`}
                            >
                                <td className="p-3">
                                    <p className="font-bold">{agent.name}</p>
                                    <p className="text-xs text-text-secondary truncate">{agent.role}</p>
                                </td>
                                <td className="p-3 text-xs font-mono">{agent.framework}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${statusClasses.pill}`}></span>
                                        <span className={`font-semibold ${statusClasses.text}`}>{agent.status}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-xs">{agent.uptime}</td>
                                <td className="p-3">
                                    <button onClick={(e) => { e.stopPropagation(); setActivePage(Page.Tasks); }} className="text-xs font-mono text-primary hover:underline">
                                        {agent.lastTask}
                                    </button>
                                </td>
                                <td className="p-3">{agent.memoryUse} MB</td>
                                <td className="p-3 text-xs">{(agent.tokenUsage.lastHour / 1000).toFixed(1)}k / {(agent.tokenUsage.total / 1000).toFixed(1)}k</td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        {(agent.status === 'Idle' || agent.status === 'Error') && <ActionButton icon={PlayCircleIcon} onClick={() => onSetStatus(agent.id, 'Active')} />}
                                        {agent.status === 'Active' && <ActionButton icon={PauseCircleIcon} onClick={() => onSetStatus(agent.id, 'Idle')} />}
                                        <ActionButton icon={BeakerIcon} onClick={() => onInspectMemory(agent.id)} />
                                        <ActionButton icon={PencilSquareIcon} onClick={() => onEdit(agent)} />
                                        <ActionButton icon={TrashIcon} onClick={() => onTerminate(agent.id)} danger />
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

const ActionButton: React.FC<{icon: React.FC<{className: string}>, onClick: React.MouseEventHandler, danger?: boolean}> = ({ icon: Icon, onClick, danger }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(e); }} 
        className={`p-1.5 rounded-md ${danger ? 'text-red-400 hover:bg-red-500/20' : 'text-text-secondary hover:bg-secondary'}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);

export default AgentTable;