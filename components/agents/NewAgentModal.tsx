import React, { useState } from 'react';
import { Agent } from '../../types';
import { XCircleIcon } from '../shared/Icons';

interface NewAgentModalProps {
    onClose: () => void;
    onAddAgent: (name: string, role: string, framework: Agent['framework']) => void;
}

const NewAgentModal: React.FC<NewAgentModalProps> = ({ onClose, onAddAgent }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [framework, setFramework] = useState<Agent['framework']>('smolagents');
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
    const [maxTurns, setMaxTurns] = useState(25);
    const [startActive, setStartActive] = useState(false);

    const handleSave = () => {
        if (name && role) {
            onAddAgent(name, role, framework);
            onClose();
        } else {
            alert("Please fill in Name and Role.");
        }
    };

    const agentPreview = {
        name,
        role,
        framework,
        config: {
            model: "Inherit from System Default",
            system_prompt: systemPrompt,
            max_turns: maxTurns,
        },
        initialization: {
            start_active: startActive,
            allow_parallel: false,
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Create New Agent</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                
                <form className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* General Section */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">General</h3>
                        <div className="space-y-4">
                            <InputField label="Name" placeholder="e.g., ResearchPlanner" required value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                            <InputField label="Role" placeholder="e.g., A planner agent for research tasks" required value={role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)} />
                            <SelectField label="Framework" options={['smolagents', 'AutoGen', 'LangChain']} value={framework} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFramework(e.target.value as Agent['framework'])} />
                        </div>
                    </section>
                    
                    {/* Configuration Section */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">Configuration</h3>
                        <div className="space-y-4">
                             <SelectField label="Base Model" options={['Inherit from System Default', 'mistral:7b', 'gpt-4o-mini']} />
                            <TextareaField label="System Prompt" rows={5} placeholder="You are a helpful AI assistant..." value={systemPrompt} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSystemPrompt(e.target.value)} />
                            <InputField label="Max Turns / Task Limit" type="number" value={maxTurns} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxTurns(parseInt(e.target.value, 10))} />
                        </div>
                    </section>

                    {/* Tool Access Section */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">Tool Access & Sandbox</h3>
                         <div className="space-y-4">
                            <p className="text-sm text-text-secondary">Select the tools this agent is allowed to use.</p>
                             {/* In a real app, this would be a dynamic list */}
                            <div className="grid grid-cols-2 gap-2">
                                <Checkbox label="FileReadTool" />
                                <Checkbox label="FileWriteTool" />
                                <Checkbox label="DuckDuckGoSearchTool" />
                                <Checkbox label="PythonExecTool" />
                            </div>
                            <SelectField label="Sandbox Restrictions" options={['none', 'file read only', 'isolated']} />
                         </div>
                    </section>

                    {/* Initialization Section */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">Initialization</h3>
                        <div className="space-y-4">
                            <TextareaField label="Preload Context" rows={3} placeholder="Optional text or document IDs to load into memory on startup." />
                            <Checkbox label="Start agent in Active state immediately" checked={startActive} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartActive(e.target.checked)} />
                            <Checkbox label="Allow parallel task execution" />
                        </div>
                    </section>

                     {/* Validation & Preview Section */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">Validation & Preview</h3>
                        <div className="space-y-4">
                            <button type="button" className="text-sm font-semibold text-primary hover:text-primary-hover">Validate Agent</button>
                            <p className="text-xs text-text-secondary">Preview of the final agent configuration JSON.</p>
                            <pre className="text-xs bg-background p-3 rounded-md border border-border h-32 overflow-auto">
                                {JSON.stringify(agentPreview, null, 2)}
                            </pre>
                        </div>
                    </section>
                </form>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Save Agent</button>
                </footer>
            </div>
        </div>
    );
};


// Helper components for the form
const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <select {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary">
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextareaField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <textarea {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);

const Checkbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center space-x-2 p-2 bg-background rounded-md">
        <input type="checkbox" className="h-4 w-4 rounded bg-secondary border-border text-primary focus:ring-primary" {...props} />
        <span className="text-sm">{label}</span>
    </label>
);

export default NewAgentModal;