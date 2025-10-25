import React from 'react';
import { PromptPreset } from '../../types';
import ProfileCard from './ProfileCard';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '../shared/Icons';

interface PromptPresetsProps {
    presets: PromptPreset[];
    onAdd: () => void;
    onEdit: (preset: PromptPreset) => void;
    onDelete: (presetId: string) => void;
}

const PromptPresets: React.FC<PromptPresetsProps> = ({ presets, onAdd, onEdit, onDelete }) => {
    return (
        <ProfileCard title="Prompt Presets">
            <button 
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors bg-primary/10 text-primary hover:bg-primary/20 mb-4"
            >
                <PlusIcon className="h-5 w-5" />
                Add New Preset
            </button>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {presets.map(p => (
                    <div key={p.id} className="bg-secondary p-3 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{p.name} {p.shortcut && <span className="text-xs font-mono bg-background px-1.5 py-0.5 rounded">{p.shortcut}</span>}</p>
                                <p className="text-xs text-text-secondary">{p.description}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => onEdit(p)} className="p-1 hover:bg-background rounded"><PencilSquareIcon className="h-4 w-4 text-text-secondary" /></button>
                                <button onClick={() => onDelete(p.id)} className="p-1 hover:bg-background rounded"><TrashIcon className="h-4 w-4 text-red-400" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ProfileCard>
    );
};

export default PromptPresets;
