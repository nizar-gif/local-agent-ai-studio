import React from 'react';
import { XCircleIcon } from '../shared/Icons';

interface NewWorkflowModalProps {
    onClose: () => void;
}

const NewWorkflowModal: React.FC<NewWorkflowModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-4xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Create New Workflow</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-1 flex min-h-0">
                    <div className="w-1/3 p-6 space-y-6 border-r border-border overflow-y-auto">
                        {/* General Info Section */}
                        <section>
                            <h3 className="font-semibold text-primary mb-2">General Info</h3>
                            <div className="space-y-4">
                                <InputField label="Name" placeholder="e.g., Quarterly Report Generation" required />
                                <TextareaField label="Description" rows={3} placeholder="A short description of the workflow's purpose." />
                            </div>
                        </section>

                        {/* Configuration Section */}
                        <section>
                            <h3 className="font-semibold text-primary mb-2">Configuration</h3>
                            <div className="space-y-4">
                                <SelectField label="Trigger Type" options={['Manual', 'Scheduled', 'Event-triggered']} />
                                <InputField label="Schedule (Cron)" placeholder="e.g., 0 2 * * MON" />
                            </div>
                        </section>
                    </div>

                    <div className="w-2/3 p-6 flex flex-col">
                        <h3 className="font-semibold text-primary mb-2">Builder Canvas</h3>
                        <div className="flex-1 bg-background border border-border rounded-md">
                            <p className="text-center text-text-secondary p-8">Drag nodes from a palette to build your workflow here.</p>
                        </div>
                    </div>
                </div>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <button className="text-primary hover:text-primary-hover px-4 py-2 rounded-md font-semibold">Validate Flow</button>
                    <button className="text-blue-400 hover:text-blue-300 px-4 py-2 rounded-md font-semibold">Dry Run</button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold">Save as Draft</button>
                    <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Save & Activate</button>
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

export default NewWorkflowModal;