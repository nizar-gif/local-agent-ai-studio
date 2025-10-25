

import React, { useState } from 'react';
import { Email, Job } from '../../types';
import { XCircleIcon, SparklesIcon, PaperAirplaneIcon, ClockIcon } from '../shared/Icons';
import { v4 as uuidv4 } from 'uuid';

interface AiDraftModalProps {
    email: Email | null;
    onClose: () => void;
    addJob: (job: { name: string; message: string; }) => void;
}

const AiDraftModal: React.FC<AiDraftModalProps> = ({ email, onClose, addJob }) => {
    const [body, setBody] = useState('');
    const [subject, setSubject] = useState(email ? `Re: ${email.subject}` : '');
    const [tone, setTone] = useState('Neutral');

    const handleGenerateDraft = () => {
        addJob({
            name: `Generate draft for: ${subject || 'New Email'}`,
            message: 'Generating AI draft...',
        });

        // Simulate AI response after a delay
        setTimeout(() => {
            setBody("Thank you for your email. Based on the context provided, here is a suggested response...\n\n[AI-generated content would appear here]");
        }, 1500);
    };

    const handleQueue = () => {
        addJob({
            name: `Queue draft for review`,
            message: 'Draft added to Tasks for approval.',
        });
        onClose();
    };
    
    const handleSend = () => {
         addJob({
            name: `Send email: ${subject}`,
            message: 'Sending email via SMTP...',
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-3xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">AI Draft Composer</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <InputField label="To" defaultValue={email?.sender || ''} />
                    <InputField label="CC/BCC" />
                    <InputField label="Subject" value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} />
                    <TextareaField label="Body" value={body} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)} rows={10} />
                    
                    <div className="p-4 bg-secondary/50 border border-border rounded-lg">
                        <h4 className="font-semibold text-primary mb-3">AI Controls</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Tone" value={tone} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)} options={['Formal', 'Neutral', 'Friendly']} />
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Context</label>
                                <div className="space-y-2">
                                    <Checkbox label="Include previous thread" defaultChecked={!!email} />
                                    <Checkbox label="Use attachments as context" defaultChecked={(email?.attachments?.length || 0) > 0} />
                                    <Checkbox label="Reference RAG documents" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <ActionButton icon={SparklesIcon} text="Generate Draft" onClick={handleGenerateDraft} />
                    <ActionButton icon={ClockIcon} text="Queue for Review" onClick={handleQueue} />
                    <button onClick={handleSend} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2">
                        <PaperAirplaneIcon className="h-5 w-5" /> Send
                    </button>
                </footer>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{icon: React.FC<{className: string}>, text: string, onClick: () => void}> = ({ icon: Icon, text, onClick }) => (
     <button onClick={onClick} type="button" className="flex items-center gap-2 text-primary hover:text-primary-hover px-4 py-2 rounded-md font-semibold">
        <Icon className="h-5 w-5" /> {text}
    </button>
);

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
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const Checkbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center space-x-2 p-1 rounded-md cursor-pointer">
        <input type="checkbox" className="h-4 w-4 rounded bg-secondary border-border text-primary focus:ring-primary" {...props} />
        <span className="text-sm">{label}</span>
    </label>
);

export default AiDraftModal;