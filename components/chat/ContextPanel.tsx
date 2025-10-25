import React, { useState } from 'react';
import { ContextItem, Attachment } from '../../types';
import { BookOpenIcon, PaperClipIcon, BeakerIcon, InformationCircleIcon, UsersIcon } from '../shared/Icons';
import { Toggle } from '../settings/fields';

interface ContextPanelProps {
    contextItems: ContextItem[];
    attachments: Attachment[];
    showReasoning: boolean;
    onShowReasoningChange: (show: boolean) => void;
    onRemoveAttachment: (attachmentId: string) => void;
    onSend: (input: string, contextToggles: { memory: boolean, documents: boolean, streaming: boolean}) => void;
}

type ActiveTab = 'Context' | 'Attachments' | 'Inspector' | 'Agent Timeline';

interface QuickCommandsProps {
    onSendCommand: (command: string) => void;
}

const QuickCommands: React.FC<QuickCommandsProps> = ({ onSendCommand }) => (
    <div className="p-3 border-b border-border">
        <h3 className="text-xs font-bold uppercase text-text-secondary mb-2">Quick Commands</h3>
        <div className="flex flex-wrap gap-1">
            <button onClick={() => onSendCommand('Summarize the current context and attachments.')} className="text-xs bg-secondary hover:bg-background px-2 py-1 rounded">Summarize</button>
            <button onClick={() => onSendCommand('Review the attached code for bugs and improvements.')} className="text-xs bg-secondary hover:bg-background px-2 py-1 rounded">Code Review</button>
            <button onClick={() => onSendCommand('Generate a detailed report based on the attachments.')} className="text-xs bg-secondary hover:bg-background px-2 py-1 rounded">Generate Report</button>
        </div>
    </div>
);

const Inspector: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Input' | 'Output' | 'Logs'>('Input');
    const mockData = {
        input: 'System: You are a helpful assistant.\nUser: Tell me about sales figures.',
        output: '{ "response": "The sales figures for Q4 are up by 12%..." }',
        logs: '[INFO] RAG query completed in 120ms.\n[DEBUG] Found 3 relevant chunks.'
    };
    
    return (
         <div>
            <div className="flex border-b border-border">
                <InspectorTabButton name="Input" activeTab={activeTab} setActiveTab={setActiveTab} />
                <InspectorTabButton name="Output" activeTab={activeTab} setActiveTab={setActiveTab} />
                <InspectorTabButton name="Logs" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="p-2 bg-background rounded-b-md">
                <pre className="text-xs whitespace-pre-wrap font-mono text-text-secondary">
                    {activeTab === 'Input' && mockData.input}
                    {activeTab === 'Output' && mockData.output}
                    {activeTab === 'Logs' && mockData.logs}
                </pre>
            </div>
         </div>
    );
};
const InspectorTabButton: React.FC<{ name: any, activeTab: any, setActiveTab: (tab: any) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(name)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-t-md ${activeTab === name ? 'bg-secondary text-text-primary' : 'text-text-secondary hover:bg-secondary/50'}`}
    >
        {name}
    </button>
);

const AgentTimeline: React.FC = () => (
    <div className="p-3">
        <p className="text-xs text-text-secondary italic">Visual sequence of multi-agent actions will appear here in real-time.</p>
        <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-purple-500/50 flex items-center justify-center text-xs flex-shrink-0">P</div>
                <div className="text-sm bg-background p-2 rounded-md flex-1">
                    <p className="font-bold text-purple-400">PlannerAgent</p>
                    <p className="text-xs">Analyzed user request.</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-green-500/50 flex items-center justify-center text-xs flex-shrink-0">E</div>
                <div className="text-sm bg-background p-2 rounded-md flex-1">
                    <p className="font-bold text-green-400">ExecutorAgent</p>
                    <p className="text-xs">Called `FileReadTool`.</p>
                </div>
            </div>
        </div>
    </div>
);

const ContextPanel: React.FC<ContextPanelProps> = ({ contextItems, attachments, showReasoning, onShowReasoningChange, onRemoveAttachment, onSend }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Context');

    const handleSendCommand = (command: string) => {
        const contextToggles = { memory: true, documents: true, streaming: true };
        onSend(command, contextToggles);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Context':
                return contextItems.map(item => (
                    <div key={item.id} className="p-3 bg-background rounded-md">
                        <p className="text-xs font-semibold text-primary">{item.type} from <span className="font-mono">{item.source}</span></p>
                        <p className="text-sm mt-1 text-text-secondary truncate">{item.content}</p>
                    </div>
                ));
            case 'Attachments':
                return attachments.map(item => {
                    const formattedSize = item.size > 1024
                        ? `${(item.size / 1024).toFixed(2)} MB`
                        : `${item.size} KB`;
                    return (
                        <div key={item.id} className="p-3 bg-background rounded-md flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold">{item.name}</p>
                                <p className="text-xs text-text-secondary">{formattedSize}</p>
                            </div>
                            <button onClick={() => onRemoveAttachment(item.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                        </div>
                    );
                });
            case 'Inspector':
                return <Inspector />;
            case 'Agent Timeline':
                return <AgentTimeline />;
            default:
                return null;
        }
    };

    return (
        <div className="w-[320px] flex-shrink-0 border-l border-border bg-secondary/30 flex flex-col">
            <QuickCommands onSendCommand={handleSendCommand} />
            <div className="flex-shrink-0 p-2 border-b border-border">
                <nav className="flex space-x-1">
                    <TabButton name="Context" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Attachments" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Inspector" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Agent Timeline" activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {renderContent()}
            </div>
             <div className="p-3 border-t border-border">
                <Toggle
                    path="ui.chatUx.showAgentSteps"
                    name="showReasoning"
                    label="Show Reasoning Steps"
                    description="Reveal internal agent thoughts and tool calls in the chat."
                    checked={showReasoning}
                    onChange={onShowReasoningChange}
                />
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(name)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-t-md ${activeTab === name ? 'bg-secondary text-text-primary' : 'text-text-secondary hover:bg-secondary/50'}`}
    >
        {name}
    </button>
);


export default ContextPanel;