import React from 'react';
import { UserProfileData } from '../../types';
import { PencilSquareIcon, WrenchScrewdriverIcon, DocumentTextIcon, ArchiveBoxXMarkIcon } from '../shared/Icons';

interface ProfileHeaderProps {
    profile: UserProfileData;
    onEditToggle: () => void;
    onManageShortcuts: () => void;
    onEditPresets: () => void;
    onClearData: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onEditToggle, onManageShortcuts, onEditPresets, onClearData }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center text-4xl text-white">
                    {profile.displayName.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                    <p className="text-sm text-text-secondary">{profile.role} on <span className="font-semibold text-text-primary">{profile.workspace}</span></p>
                    <p className="text-xs text-text-secondary mt-1">Last Login: {new Date(profile.lastLogin).toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <ActionButton icon={PencilSquareIcon} text="Edit Profile" onClick={onEditToggle} />
                <ActionButton icon={WrenchScrewdriverIcon} text="Manage Shortcuts" onClick={onManageShortcuts} />
                <ActionButton icon={DocumentTextIcon} text="Edit Presets" onClick={onEditPresets} />
                <ActionButton icon={ArchiveBoxXMarkIcon} text="Clear Data" onClick={onClearData} danger />
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; danger?: boolean }> = ({ icon: Icon, text, onClick, danger = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors
            ${danger 
                ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30'
                : 'bg-secondary text-text-primary hover:bg-background border border-border'}
        `}>
        <Icon className="h-5 w-5" />
        {text && <span>{text}</span>}
    </button>
);

export default ProfileHeader;
