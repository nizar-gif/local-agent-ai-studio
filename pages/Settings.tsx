





import React, { useState, useEffect, useCallback } from 'react';
import { MasterSettings, Profile } from '../types';
import SettingsLayout from '../components/settings/SettingsLayout';
import { useSettings, Spinner, useNotifier } from '../App';
import { v4 as uuidv4 } from 'uuid';

const useConfirm = () => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
    const [confirmText, setConfirmText] = useState<string | null>(null);

    const confirm = (text: string) => new Promise<boolean>((resolve) => {
        setConfirmText(text);
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => {
        const [inputValue, setInputValue] = useState('');
        if (!promise) return null;

        const isMatch = inputValue === confirmText;

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-bold text-yellow-400">Confirmation Required</h2>
                    <p className="text-sm text-text-secondary mt-2">This is a dangerous action. To proceed, please type the following text exactly as it appears:</p>
                    <p className="font-mono bg-secondary p-2 rounded-md my-4 text-center text-primary">{confirmText}</p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-background border border-border rounded-md p-2"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={handleCancel} className="bg-secondary hover:bg-background px-4 py-2 rounded-md">Cancel</button>
                        <button onClick={handleConfirm} disabled={!isMatch} className="bg-red-600 hover:bg-red-700 disabled:bg-danger disabled:cursor-not-allowed px-4 py-2 rounded-md">Confirm</button>
                    </div>
                </div>
            </div>
        );
    };

    return [ConfirmationDialog, confirm] as [React.FC, (text: string) => Promise<boolean>];
};


const Settings: React.FC = () => {
    const { 
        settings, 
        loading, 
        isDirty, 
        dirtyFields, 
        overrideFields,
        updateSetting, 
        saveSettings, 
        resetSettings,
        switchProfile
    } = useSettings();
    const { addNotification } = useNotifier();

    const [activeSection, setActiveSection] = useState<string>('Workspace');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [restartRequired, setRestartRequired] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [ConfirmationDialog, confirm] = useConfirm();

    const handleApply = useCallback(async () => {
        if (!isDirty) return;
        setStatus('saving');
        await saveSettings();
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
    }, [isDirty, saveSettings]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleApply();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleApply]);
    
    const handleProfileChange = (profileId: string) => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to switch profiles and discard them?")) {
                switchProfile(profileId);
            }
        } else {
            switchProfile(profileId);
        }
    };

    const handleNewProfile = () => {
        const name = prompt("Enter new profile name:");
        if (name && settings) {
            // In a real app, this would be an API call to create a new profile.
            // For now, we simulate it by adding to the list and switching.
            const newProfile: Profile = { id: name.toLowerCase().replace(' ', '-'), name };
            const newProfiles = [...settings.workspace.profiles, newProfile];
            updateSetting('workspace.profiles', newProfiles); // This makes it available in the dropdown
            // Note: This only adds it to the current profile's list. A real API would handle this globally.
            addNotification(`Created profile "${name}". Switching...`, 'success');
            // We don't switch here, as the mock API doesn't support dynamic creation yet.
        }
    };
    const handleCloneProfile = () => {
        const name = prompt("Enter name for cloned profile:");
        if (name && settings) {
             const newProfile: Profile = { id: name.toLowerCase().replace(' ', '-'), name };
             const newProfiles = [...settings.workspace.profiles, newProfile];
            updateSetting('workspace.profiles', newProfiles);
            addNotification(`Cloned profile to "${name}".`, 'success');
        }
    };
     const handleDeleteProfile = () => {
        if(settings?.workspace.profile === 'default') {
            alert("Cannot delete the default profile.");
            return;
        }
        if(window.confirm("Are you sure you want to delete this profile?")) {
            alert("Profile deleted. (This would typically remove it and switch to default)");
        }
    };

    const handleResetField = (path: string) => {
        console.warn(`handleResetField for path "${path}" is not fully implemented in the new context architecture yet.`);
    };

    if (loading || !settings) {
        return <Spinner />;
    }

    return (
       <>
        <ConfirmationDialog />
        <SettingsLayout
            settings={settings}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isDirty={isDirty}
            errors={{}}
            onApply={handleApply}
            onReset={resetSettings}
            applyStatus={status}
            isRestartRequired={restartRequired}
            confirmAction={confirm}
            onProfileChange={handleProfileChange}
            onNewProfile={handleNewProfile}
            onCloneProfile={handleCloneProfile}
            onDeleteProfile={handleDeleteProfile}
            dirtyFields={dirtyFields}
            overrideFields={overrideFields}
            handleFieldChange={updateSetting}
            handleResetField={handleResetField} // This is now a placeholder
            showAdvanced={showAdvanced}
            onShowAdvancedChange={setShowAdvanced}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
        />
       </>
    );
};

export default Settings;