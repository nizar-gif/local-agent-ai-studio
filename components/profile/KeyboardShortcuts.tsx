import React from 'react';
import { KeyboardShortcut } from '../../types';
import ProfileCard from './ProfileCard';
import { PlusIcon } from '../shared/Icons';

interface KeyboardShortcutsProps {
    shortcuts: KeyboardShortcut[];
    onAdd: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ shortcuts, onAdd }) => {
    return (
        <ProfileCard title="Keyboard Shortcuts">
             <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors bg-primary/10 text-primary hover:bg-primary/20 mb-4">
                <PlusIcon className="h-5 w-5" />
                Add Shortcut
            </button>
            <ul className="space-y-1 text-sm">
                {shortcuts.map(s => (
                    <li key={s.id} className="flex justify-between p-2 bg-secondary rounded-md">
                        <span className="font-semibold">{s.action}</span>
                        <span className="font-mono bg-background px-2 py-1 rounded">{s.keybinding}</span>
                    </li>
                ))}
            </ul>
        </ProfileCard>
    );
};

export default KeyboardShortcuts;
