import React, { useState, useEffect } from 'react';
import { PromptPreset } from '../../types';
import { XCircleIcon } from '../shared/Icons';

interface PresetEditorModalProps {
    preset: PromptPreset | null;
    onClose: () => void;
    onSave: (preset: PromptPreset) => void;
}

const PresetEditorModal: React.FC<PresetEditorModalProps> = ({ preset, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<PromptPreset, 'id'>>({
        name: '', 
        category: 'Research Query', 
        description: '', 
        text: '', 
        shortcut: ''
    });

    useEffect(() => {
        if (preset) {
            setFormData({
                name: preset.name,
                category: preset.category,
                description: preset.description,
                text: preset.text,
                shortcut: preset.shortcut || '',
            });
        }
    }, [preset]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.text.trim()) {
            alert('Name and Prompt Text are required.');
            return;
        }
        onSave({ ...formData, id: preset?.id || '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-full">
                <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold">{preset ? 'Edit' : 'Create'} Prompt Preset</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <InputField label="Preset Name" name="name" value={formData.name} onChange={handleChange} required />
                    <SelectField 
                        label="Category" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange}
                        options={['Creative Writing', 'Research Query', 'Code Review', 'Email Drafting', 'System Instruction']}
                    />
                    <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
                    <TextareaField label="Prompt Text" name="text" value={formData.text} onChange={handleChange} rows={8} required />
                    <InputField label="Shortcut (Optional)" name="shortcut" value={formData.shortcut || ''} onChange={handleChange} placeholder="e.g., Ctrl+1" />
                </div>
                <footer className="p-4 border-t border-border flex justify-end gap-4 flex-shrink-0">
                    <button onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold text-sm">Cancel</button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold text-sm">Save Preset</button>
                </footer>
            </div>
        </div>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);
const TextareaField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <textarea {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
    </div>
);
const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <select {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default PresetEditorModal;
