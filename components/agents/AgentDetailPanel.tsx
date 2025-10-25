import React, { useState } from 'react';
import { Agent, Page, Job } from '../../types';
import { ChatBubbleLeftRightIcon, CpuChipIcon } from '../shared/Icons';

type ActiveTab = 'Overview' | 'Configuration' | 'Performance' | 'Memory' | 'Logs';

interface AgentDetailPanelProps {
    agent: Agent;
    setActivePage: (page: Page) => void;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({ agent, setActivePage, activeTab, setActiveTab }) => {

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-4">
                        <InfoItem label="Role" value={agent.role} />
                        <InfoItem label="Framework" value={agent.framework} />
                        <InfoItem label="Goals" value={agent.config.goals.join(', ')} />
                        <InfoItem label="Tool Permissions" value={agent.config.toolAllowlist.join(', ') || 'None'} />
                        <InfoItem label="Orchestration Position" value="N/A (Standalone)" />
                        <InfoItem label="System Prompt" value={agent.config.systemPrompt} pre />
                    </div>
                );
            case 'Configuration':
                 return (
                    <div className="space-y-4">
                        <InfoItem label="LLM Provider" value={agent.config.llmProvider} />
                        <InfoItem label="Model" value={agent.config.model} />
                        <InfoItem label="Max Tokens" value={agent.config.maxTokens.toString()} />
                        <InfoItem label="Temperature" value={agent.config.temperature.toString()} />
                        <InfoItem label="Context Window" value={agent.config.contextWindow.toString()} />
                        <InfoItem label="Tool Allowlist" value={agent.config.toolAllowlist.join(', ')} />
                        <InfoItem label="Sandbox Level" value={agent.config.sandboxLevel} />
                        <InfoItem label="Memory Mode" value={agent.config.memoryMode} />
                    </div>
                );
            case 'Performance':
                return (
                    <div className="space-y-6">
                        <MetricChart title="Token Usage (Last 24h)" />
                        <MetricChart title="Response Latency (ms)" />
                        <MetricChart title="Success vs. Failure Rate" />
                    </div>
                );
            case 'Memory':
                return <p className="text-text-secondary text-sm">Semantic memory snippets and retrieved context will be displayed here.</p>;
            case 'Logs':
                return <p className="text-text-secondary text-sm">Live agent actions and internal messages will appear here.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <p className="text-sm text-text-secondary">{agent.role}</p>
                    </div>
                    <button onClick={() => setActivePage(Page.Chat)} className="flex items-center gap-2 text-sm font-semibold bg-secondary hover:bg-background py-1.5 px-3 rounded-md">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" /> Open Chat
                    </button>
                </div>
                <div className="mt-4 border-b border-border">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton name="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Configuration" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Performance" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Memory" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Logs" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </div>
            <div className="flex-1 py-6 overflow-y-auto">
                {renderContent()}
            </div>
             <div className="flex-shrink-0 border-t border-border pt-4">
                 <h4 className="text-xs font-semibold uppercase text-text-secondary mb-2">Live Metrics</h4>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <MetricItem label="CPU Time" value="3.4s" />
                    <MetricItem label="Threads" value="4" />
                    <MetricItem label="Process ID" value="12345" />
                    <MetricItem label="Last Active" value="2m ago" />
                 </div>
             </div>
        </div>
    );
};

const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(name)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

const InfoItem: React.FC<{label: string, value: string, pre?: boolean}> = ({ label, value, pre }) => (
    <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{label}</p>
        {pre ? (
            <pre className="text-sm mt-1 text-text-primary bg-secondary p-2 rounded-md whitespace-pre-wrap font-sans">{value}</pre>
        ) : (
            <p className="text-sm mt-1 text-text-primary">{value}</p>
        )}
    </div>
);

const MetricItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-text-secondary">{label}:</span>
        <span className="font-mono font-semibold text-text-primary">{value}</span>
    </div>
);


const MetricChart: React.FC<{title: string}> = ({ title }) => (
    <div>
        <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
        <div className="h-32 bg-secondary rounded-md border border-border">
            {/* Placeholder for a chart */}
        </div>
    </div>
);

export default AgentDetailPanel;