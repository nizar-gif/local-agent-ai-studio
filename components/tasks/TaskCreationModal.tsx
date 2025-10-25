import React, { useState } from 'react';
import { Task, TaskExecution } from '../../types';
import { XCircleIcon } from '../shared/Icons';

interface TaskCreationModalProps {
    availableTasks: Task[];
    onClose: () => void;
    onAddTask: (details: { title: string, agent: string, type: TaskExecution['type'], priority: TaskExecution['priority'] }) => void;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ availableTasks, onClose, onAddTask }) => {
    const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
    const [selectedTaskType, setSelectedTaskType] = useState(availableTasks[0]?.title || '');
    const [assignedAgent, setAssignedAgent] = useState('Auto-select');
    const [priority, setPriority] = useState<TaskExecution['priority']>('Normal');
    const [schedule, setSchedule] = useState('Run Now');

    const handleCreate = () => {
        const title = naturalLanguageInput || selectedTaskType;
        if (title) {
            onAddTask({
                title,
                agent: assignedAgent,
                type: 'Custom', // In a real app, this would be derived from the selected task or parsed from NLP
                priority,
            });
            onClose();
        } else {
            alert("Please describe a task or select a task type.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Create New Task</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                
                 <form className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <section>
                        <h3 className="font-semibold text-primary mb-2">AI Task Builder</h3>
                        <p className="text-sm text-text-secondary mb-2">Describe the task in natural language, and the AI will try to configure it for you.</p>
                        <TextareaField label="" placeholder="e.g., 'Summarize the document Project_Proposal.pdf and save the output to summaries/.'" rows={3} value={naturalLanguageInput} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNaturalLanguageInput(e.target.value)} />
                    </section>
                    <div className="relative text-center">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-card px-2 text-sm text-text-secondary">OR</span>
                        </div>
                    </div>
                     <section>
                        <h3 className="font-semibold text-primary mb-2">Manual Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Task Type" options={availableTasks.map(t => t.title)} value={selectedTaskType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTaskType(e.target.value)} />
                            <SelectField label="Assign to Agent" options={['Auto-select', 'Research Planner', 'Code Generator']} value={assignedAgent} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignedAgent(e.target.value)} />
                            <SelectField label="Priority" options={['Normal', 'High', 'Critical']} value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as TaskExecution['priority'])} />
                            <SelectField label="Schedule" options={['Run Now', 'Run Later...']} value={schedule} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchedule(e.target.value)} />
                        </div>
                    </section>

                    <section>
                        <h3 className="font-semibold text-primary mb-2">Attachments & Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <InputField label="Attachments" type="file" />
                             <SelectField label="Tool Selection" options={['(Inherit from Agent)', 'FileReadTool', 'DuckDuckGoSearchTool']} />
                        </div>
                    </section>

                     <section>
                        <h3 className="font-semibold text-primary mb-2">Execution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Execution Mode" options={['Asynchronous (background)', 'Synchronous (interactive)']} />
                        </div>
                    </section>
                </form>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <button type="button" className="text-primary hover:text-primary-hover px-4 py-2 rounded-md font-semibold">Validate Task</button>
                    <button type="button" onClick={handleCreate} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Create & Run</button>
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
        {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <textarea {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);

export default TaskCreationModal;