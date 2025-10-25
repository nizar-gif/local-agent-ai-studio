

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAgents } from '../services/api';
import { Agent, Page, Job } from '../types';
import AgentTable from '../components/agents/AgentTable';
import AgentDetailPanel from '../components/agents/AgentDetailPanel';
import NewAgentModal from '../components/agents/NewAgentModal';
import { PlusIcon } from '../components/shared/Icons';
import { useJobs, useNotifier, Spinner } from '../App';
import { v4 as uuidv4 } from 'uuid';

interface AgentsProps {
  setActivePage: (page: Page) => void;
}

type ActiveTab = 'Overview' | 'Configuration' | 'Performance' | 'Memory' | 'Logs';

const SimpleToggle: React.FC<{label: string, enabled: boolean, onChange: (enabled: boolean) => void}> = ({ label, enabled, onChange }) => (
    <div className="flex items-center gap-2 text-sm">
        <label htmlFor="autoModeToggle" className="cursor-pointer text-text-primary font-medium">{label}</label>
        <button
            id="autoModeToggle"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`${
            enabled ? 'bg-primary' : 'bg-gray-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background`}
        >
            <span
                aria-hidden="true"
                className={`${
                enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);


const Agents: React.FC<AgentsProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [filter, setFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [detailTab, setDetailTab] = useState<ActiveTab>('Overview');
    const [initialLoad, setInitialLoad] = useState(true);
    
    const searchInputRef = useRef<HTMLInputElement>(null);

    const loadAgents = useCallback(async () => {
        if (initialLoad) {
            setLoading(true);
        }
        try {
            const data = await fetchAgents();
            setAgents(data);
             if (data.length > 0) {
                 setSelectedAgent(prev => data.find(a => a.id === prev?.id) || data[0]);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load agents.', 'error');
        } finally {
            if (initialLoad) {
                setLoading(false);
                setInitialLoad(false);
            }
        }
    }, [addNotification, initialLoad]);
    
    useEffect(() => {
        loadAgents();
        const interval = setInterval(loadAgents, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [loadAgents]);

    useEffect(() => {
        setDetailTab('Overview');
    }, [selectedAgent]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'f' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            searchInputRef.current?.focus();
        }
        if (event.key.toLowerCase() === 'n' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            setIsModalOpen(true);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    const filteredAgents = agents.filter(agent => 
        agent.name.toLowerCase().includes(filter.toLowerCase()) ||
        agent.role.toLowerCase().includes(filter.toLowerCase()) ||
        agent.framework.toLowerCase().includes(filter.toLowerCase())
    );

    const handleSetAgentStatus = (agentId: string, status: Agent['status']) => {
        setAgents(prev => prev.map(a => a.id === agentId ? {...a, status} : a));
    };

    const handleTerminateAgent = (agentId: string) => {
        if (window.confirm("Are you sure you want to terminate this agent? This cannot be undone.")) {
            setAgents(prev => prev.filter(a => a.id !== agentId));
            if (selectedAgent?.id === agentId) {
                const remainingAgents = agents.filter(a => a.id !== agentId);
                setSelectedAgent(remainingAgents.length > 0 ? remainingAgents[0] : null);
            }
        }
    };

    const handleAddAgent = (name: string, role: string, framework: Agent['framework']) => {
        const newAgent: Agent = {
            id: `agent_${uuidv4().slice(0,4)}`,
            name: name,
            role: role,
            framework: framework,
            status: 'Idle',
            uptime: '0m',
            lastTask: 'N/A',
            memoryUse: 0,
            tokenUsage: { lastHour: 0, total: 0 },
            config: {
                llmProvider: 'local', model: 'mistral:7b', maxTokens: 4096, temperature: 0.5,
                contextWindow: 8192, toolAllowlist: [], sandboxLevel: 'none', memoryMode: 'episodic',
                taskConcurrencyLimit: 1, systemPrompt: 'You are a helpful AI assistant.', goals: [],
            },
        };
        setAgents(prev => [newAgent, ...prev]);
        setSelectedAgent(newAgent);
    };

    const activeAgents = agents.filter(a => a.status === 'Active').length;
    const idleAgents = agents.filter(a => a.status === 'Idle').length;

    return (
        <div className="flex flex-col h-full -m-6">
            {isModalOpen && <NewAgentModal onClose={() => setIsModalOpen(false)} onAddAgent={handleAddAgent} />}
            
            {/* Top Header */}
            <header className="flex-shrink-0 bg-secondary px-6 py-3 flex justify-between items-center border-b border-border">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Agents Command Center</h2>
                    <p className="text-sm text-text-secondary">
                        <span className="font-semibold text-green-400">{activeAgents} active</span> / {agents.length} total / <span className="text-blue-400">{idleAgents} idle</span>
                    </p>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <span className="text-text-secondary">Orchestrator: </span>
                        <span className="font-bold font-mono text-primary bg-background px-2 py-1 rounded-md text-xs">smolagents</span>
                    </div>
                    <SimpleToggle label="Auto Mode" enabled={isAutoMode} onChange={setIsAutoMode} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Filter by name, role... (Ctrl+F)"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-background border border-border rounded-lg px-4 py-2 w-72 text-sm focus:ring-primary focus:border-primary transition"
                    />
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="h-5 w-5" />
                        New Agent (Ctrl+N)
                    </button>
                </div>
            </header>
            
            {/* Main Body */}
            <div className="flex-1 flex min-h-0">
                {/* Left Column - Agent Registry */}
                <div className="w-1/2 lg:w-3/5 border-r border-border flex flex-col">
                   {loading ? (
                        <Spinner />
                   ) : (
                       <AgentTable 
                            agents={filteredAgents} 
                            selectedAgent={selectedAgent}
                            onSelectAgent={setSelectedAgent}
                            onDoubleClickAgent={() => setActivePage(Page.Chat)}
                            onSetStatus={handleSetAgentStatus}
                            onTerminate={handleTerminateAgent}
                            onInspectMemory={() => setDetailTab('Memory')}
                            onEdit={(agent) => {
                                // In a real app, you would pre-fill the modal with the agent's data
                                setIsModalOpen(true);
                            }}
                            setActivePage={setActivePage}
                        />
                   )}
                </div>
                
                {/* Right Column - Agent Detail */}
                <div className="w-1/2 lg:w-2/5 overflow-y-auto">
                    {selectedAgent ? (
                        <AgentDetailPanel 
                            agent={selectedAgent} 
                            setActivePage={setActivePage}
                            activeTab={detailTab}
                            setActiveTab={setDetailTab}
                        />
                    ) : (
                        !loading && <div className="p-8 text-center text-text-secondary">Select an agent to see details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agents;