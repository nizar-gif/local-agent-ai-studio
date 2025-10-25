

import React, { useState, useEffect } from 'react';
import { XCircleIcon } from '../shared/Icons';
import { SchedulerJob } from '../../types';

interface NewAutomationModalProps {
    onClose: () => void;
    onSave: (job: Partial<SchedulerJob>) => void;
    jobToEdit: SchedulerJob | null;
}

const NewAutomationModal: React.FC<NewAutomationModalProps> = ({ onClose, onSave, jobToEdit }) => {
    const [formData, setFormData] = useState<Partial<SchedulerJob>>({});

    useEffect(() => {
        if (jobToEdit) {
            setFormData(jobToEdit);
        } else {
            // Defaults for a new job
            setFormData({
                name: '',
                description: '',
                jobType: 'health_check',
                triggerType: 'interval',
                triggerValue: '60s',
                owner: 'User',
                enabled: true,
                parameters: {},
            });
        }
    }, [jobToEdit]);

    const handleChange = (field: keyof SchedulerJob, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleSave = () => {
        if (!formData.name?.trim()) {
            alert("Job Name is required.");
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">{jobToEdit ? 'Edit Automation' : 'Create New Automation'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                
                <form className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* General Info */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">1. General Info</h3>
                        <div className="space-y-4">
                            <InputField label="Job Name" placeholder="e.g., Daily Health Check" required value={formData.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} />
                            <TextareaField label="Description" rows={2} placeholder="A short description of what this job does." value={formData.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)} />
                        </div>
                    </section>
                    
                    {/* Trigger Type */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">2. Trigger Type</h3>
                        <SelectField label="Trigger" value={formData.triggerType || 'interval'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('triggerType', e.target.value as SchedulerJob['triggerType'])} options={['interval', 'cron', 'event', 'manual']} />
                        {formData.triggerType === 'interval' && <InputField label="Interval" placeholder="e.g., 60s, 5m, 1h" value={formData.triggerValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('triggerValue', e.target.value)} />}
                        {formData.triggerType === 'cron' && <InputField label="Cron Expression" placeholder="* * * * *" value={formData.triggerValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('triggerValue', e.target.value)} />}
                        {formData.triggerType === 'event' && <InputField label="Event Name" placeholder="e.g., file_created" value={formData.triggerValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('triggerValue', e.target.value)} />}
                    </section>

                     {/* Job Action */}
                    <section>
                        <h3 className="font-semibold text-primary mb-2">3. Job Action</h3>
                        <SelectField label="Action Type" value={formData.jobType || 'health_check'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('jobType', e.target.value as SchedulerJob['jobType'])} options={['health_check', 'resource_monitor', 'rag_incremental', 'email_sync', 'backup', 'custom_workflow', 'custom_agent']} />
                        {formData.jobType === 'custom_workflow' && <SelectField label="Select Workflow" options={['Onboard New User', 'Generate Q4 Report']} />}
                        {formData.jobType === 'custom_agent' && <SelectField label="Select Agent" options={['Research Planner', 'Email Sorter']} />}
                    </section>

                    {/* Parameters & Limits */}
                    <section>
                         <h3 className="font-semibold text-primary mb-2">4. Parameters & Limits</h3>
                         <div className="space-y-4">
                            <TextareaField label="Parameters (JSON)" rows={3} placeholder='{ "key": "value" }' value={formData.parameters ? JSON.stringify(formData.parameters, null, 2) : ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                try {
                                    handleChange('parameters', JSON.parse(e.target.value))
                                } catch (error) {
                                    // handle invalid json, maybe show an error message
                                }
                            }} />
                            <InputField label="Max Retries" type="number" defaultValue={0} />
                            <InputField label="Timeout (seconds)" type="number" defaultValue={0} />
                         </div>
                    </section>
                </form>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <button type="button" className="text-primary hover:text-primary-hover px-4 py-2 rounded-md font-semibold">Validate</button>
                    <button type="button" onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Save & Activate</button>
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
            {options.map((opt: string) => <option key={opt} value={opt}>{opt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
        </select>
    </div>
);

const TextareaField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <textarea {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);


export default NewAutomationModal;