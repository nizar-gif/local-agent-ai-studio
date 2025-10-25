import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Agent } from '../../types';
import { ChevronUpDownIcon, SparklesIcon, PaperClipIcon, Cog6ToothIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '../shared/Icons';

interface ChatHeaderProps {
    sessions: ChatSession[];
    activeSession: ChatSession | null;
    onSessionChange: (session: ChatSession | null) => void;
    agents: Agent[];
    activeAgentId: string;
    onAgentChange: (agentId: string) => void;
    onNewChat: () => void;
    onRenameSession: () => void;
    onDeleteSession: () => void;
    onSummarizeChat: () => void;
    onAttachFile: () => void;
    showTokens: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ sessions, activeSession, onSessionChange, agents, activeAgentId, onAgentChange, onNewChat, onRenameSession, onDeleteSession, onSummarizeChat, onAttachFile, showTokens }) => {
    const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
    const sessionMenuRef = useRef<HTMLDivElement>(null);
    const systemMode = 'LOCAL'; // Mock data

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sessionMenuRef.current && !sessionMenuRef.current.contains(event.target as Node)) {
                setSessionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex-shrink-0 p-3 border-b border-border flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div ref={sessionMenuRef} className="relative">
                        <button
                            onClick={() => setSessionMenuOpen(!sessionMenuOpen)}
                            className="flex items-center gap-2 bg-secondary border border-border rounded-md pl-3 pr-2 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <span className="truncate max-w-48">{activeSession?.name || 'Select Session'}</span>
                            <ChevronUpDownIcon className="h-5 w-5 text-text-secondary" />
                        </button>
                        {sessionMenuOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-md shadow-lg z-20">
                                <div className="p-2 max-h-60 overflow-y-auto">
                                    {sessions.length > 0 ? sessions.map(session => (
                                        <button 
                                            key={session.id}
                                            onClick={() => { onSessionChange(session); setSessionMenuOpen(false); }}
                                            className={`w-full text-left px-3 py-1.5 text-sm rounded-md truncate ${activeSession?.id === session.id ? 'bg-primary text-white' : 'hover:bg-secondary'}`}
                                        >
                                            {session.name}
                                        </button>
                                    )) : (
                                        <div className="px-3 py-1.5 text-sm text-text-secondary text-center">No sessions yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 bg-secondary rounded-md border border-border p-1">
                        <button onClick={onNewChat} className="p-1.5 rounded-md hover:bg-background" title="New Chat">
                            <PlusIcon className="h-5 w-5 text-text-secondary" />
                        </button>
                        <button onClick={onRenameSession} disabled={!activeSession} className="p-1.5 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed" title="Rename Current Session">
                            <PencilSquareIcon className="h-5 w-5 text-text-secondary" />
                        </button>
                        <button onClick={onDeleteSession} disabled={!activeSession} className="p-1.5 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed" title="Delete Current Session">
                            <TrashIcon className="h-5 w-5 text-red-400 hover:text-red-300" />
                        </button>
                    </div>
                </div>
                 <div className="relative">
                     <select 
                        value={activeAgentId}
                        onChange={(e) => onAgentChange(e.target.value)}
                        className="appearance-none bg-secondary border border-border rounded-md pl-3 pr-8 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                     >
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                    </select>
                    <ChevronUpDownIcon className="h-5 w-5 text-text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                 <div className={`text-xs font-bold px-2 py-1 rounded border bg-green-500/20 text-green-300 border-green-500/30`}>
                    {systemMode}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {showTokens && (
                    <div className="text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">2,450 / 8,192</span> Tokens
                    </div>
                )}
                 <div className="h-6 border-l border-border mx-2"></div>
                <button onClick={onSummarizeChat} className="p-2 rounded-md hover:bg-secondary" title="Summarize Chat">
                    <SparklesIcon className="h-5 w-5 text-text-secondary" />
                </button>
                 <button onClick={onAttachFile} className="p-2 rounded-md hover:bg-secondary" title="Attach File">
                    <PaperClipIcon className="h-5 w-5 text-text-secondary" />
                </button>
                <button onClick={() => alert('Chat settings would open here.')} className="p-2 rounded-md hover:bg-secondary" title="Chat Settings">
                    <Cog6ToothIcon className="h-5 w-5 text-text-secondary" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;