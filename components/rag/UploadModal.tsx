import React, { useState } from 'react';
import { XCircleIcon } from '../shared/Icons';

interface UploadModalProps {
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
    const [showOverrides, setShowOverrides] = useState(false);
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Upload Documents</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <p className="font-semibold">Drag & drop files here</p>
                        <p className="text-sm text-text-secondary mt-1">or</p>
                        <button className="mt-2 text-sm font-semibold text-primary hover:underline">browse files</button>
                    </div>
                    <section>
                        <h3 className="font-semibold text-primary mb-2">Options</h3>
                        <div className="space-y-4">
                            <SelectField label="Vector Namespace" options={['default', 'emails', 'reports', 'projects']} />
                            <SelectField label="Assign Category" options={['(None)', 'Knowledge', 'Support', 'Code', 'Policy']} />
                            <Checkbox label="Auto-embed after upload" defaultChecked />
                            <Checkbox label="Auto-detect Language" />
                            
                            <div>
                                <button onClick={() => setShowOverrides(!showOverrides)} className="text-sm text-text-secondary hover:text-text-primary">
                                    {showOverrides ? 'Hide' : 'Show'} Chunking Parameter Overrides
                                </button>
                                {showOverrides && (
                                    <div className="mt-2 p-4 bg-secondary/50 rounded-md border border-border space-y-4">
                                         <SelectField label="Splitter" options={['Recursive', 'Markdown', 'Code-aware']} />
                                        <InputField label="Chunk Size" type="number" defaultValue="500" />
                                        <InputField label="Chunk Overlap" type="number" defaultValue="50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                
                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Cancel</button>
                    <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Upload & Embed</button>
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

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <select {...props} className="w-full bg-background border border-border rounded-md p-2 focus:ring-primary focus:border-primary">
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const Checkbox: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center space-x-2 p-2 bg-background rounded-md cursor-pointer">
        <input type="checkbox" className="h-4 w-4 rounded bg-secondary border-border text-primary focus:ring-primary" {...props} />
        <span className="text-sm">{label}</span>
    </label>
);


export default UploadModal;
