import React from 'react';
import { Profile } from '../../types';
import { SelectField, ActionButton } from './fields';
import { MagnifyingGlassIcon } from '../shared/Icons';

interface SettingsHeaderProps {
    profiles: Profile[];
    activeProfileId: string;
    onProfileChange: (profileId: string) => void;
    onNewProfile: () => void;
    onCloneProfile: () => void;
    onDeleteProfile: () => void;
    showAdvanced: boolean;
    onShowAdvancedChange: (show: boolean) => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    profiles,
    activeProfileId,
    onProfileChange,
    onNewProfile,
    onCloneProfile,
    onDeleteProfile,
    showAdvanced,
    onShowAdvancedChange,
    searchTerm,
    onSearchTermChange,
}) => {
    return (
        <div className="flex-shrink-0 mb-6 flex justify-between items-center gap-4 flex-wrap p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center gap-4">
                 <div className="flex items-end gap-2">
                    <SelectField
                        label="Active Profile"
                        path="workspace.profile"
                        value={activeProfileId}
                        onChange={(e) => onProfileChange(e.target.value)}
                        options={profiles.map(p => ({ value: p.id, label: p.name }))}
                    />
                    <ActionButton onClick={onNewProfile}>New</ActionButton>
                    <ActionButton onClick={onCloneProfile}>Clone</ActionButton>
                    <ActionButton onClick={onDeleteProfile} variant="danger" disabled={activeProfileId === 'default'}>Delete</ActionButton>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={showAdvanced} 
                        onChange={e => onShowAdvancedChange(e.target.checked)} 
                        className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"
                    />
                    Show Advanced
                </label>
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Search all settings..."
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 text-sm focus:ring-primary focus:border-primary transition"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsHeader;