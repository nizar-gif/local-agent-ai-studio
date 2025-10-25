
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfileData, UserPreferences, PromptPreset, KeyboardShortcut, UserActivitySummary } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
    fetchUserProfile, 
    fetchUserPreferences, 
    fetchPromptPresets, 
    fetchKeyboardShortcuts, 
    fetchUserActivitySummary 
} from '../services/api';

import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import UserPreferencesCard from '../components/profile/UserPreferencesCard';
import SecurityCard from '../components/profile/SecurityCard';
import PromptPresets from '../components/profile/PromptPresets';
import KeyboardShortcuts from '../components/profile/KeyboardShortcuts';
import ActivitySummary from '../components/profile/ActivitySummary';
import SavedSessions from '../components/profile/SavedSessions';
import PresetEditorModal from '../components/profile/PresetEditorModal';
import { set } from 'lodash';
import { useNotifier, Spinner } from '../App';

const UserProfile: React.FC = () => {
    const { addNotification } = useNotifier();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [originalProfile, setOriginalProfile] = useState<UserProfileData | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [presets, setPresets] = useState<PromptPreset[]>([]);
    const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
    const [activity, setActivity] = useState<UserActivitySummary | null>(null);
    const [loading, setLoading] = useState(true);

    // Interaction State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [editingPreset, setEditingPreset] = useState<PromptPreset | null>(null);

    const presetsRef = useRef<HTMLDivElement>(null);
    const shortcutsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [profileData, prefsData, presetsData, shortcutsData, activityData] = await Promise.all([
                    fetchUserProfile(),
                    fetchUserPreferences(),
                    fetchPromptPresets(),
                    fetchKeyboardShortcuts(),
                    fetchUserActivitySummary(),
                ]);
                setProfile(profileData);
                setOriginalProfile(JSON.parse(JSON.stringify(profileData))); // Deep copy for cancel
                setPreferences(prefsData);
                setPresets(presetsData);
                setShortcuts(shortcutsData);
                setActivity(activityData);
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load user profile data.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [addNotification]);
    
    // --- Handlers ---
    const handleProfileDataChange = useCallback((field: keyof UserProfileData, value: string) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
    }, []);

    const handleSaveProfile = () => {
        setOriginalProfile(JSON.parse(JSON.stringify(profile)));
        setIsEditingInfo(false);
        // In a real app, you would call an API to save the profile.
    };

    const handleCancelEdit = () => {
        setProfile(originalProfile);
        setIsEditingInfo(false);
    };

    const handlePreferencesChange = useCallback((path: string, value: any) => {
        setPreferences(prev => {
            if (!prev) return null;
            const newState = JSON.parse(JSON.stringify(prev)); // Simple deep clone for immutability
            set(newState, path, value);
            return newState;
        });
    }, []);

    const handleOpenPresetModal = (preset: PromptPreset | null) => {
        setEditingPreset(preset);
        setIsPresetModalOpen(true);
    };
    
    const handleSavePreset = (presetToSave: PromptPreset) => {
        if (presetToSave.id) { // Editing existing preset
            setPresets(prev => prev.map(p => p.id === presetToSave.id ? presetToSave : p));
        } else { // Adding new preset
            setPresets(prev => [{ ...presetToSave, id: uuidv4() }, ...prev]);
        }
    };
    
    const handleDeletePreset = (id: string) => {
        if (window.confirm("Are you sure you want to delete this preset?")) {
            setPresets(prev => prev.filter(p => p.id !== id));
        }
    };

    if (loading) return <Spinner />;

    if (!profile || !preferences || !activity) {
        return <div className="text-center p-8 text-text-secondary">Failed to load user profile. Please try again later.</div>;
    }

    return (
        <div className="space-y-8">
            {isPresetModalOpen && (
                <PresetEditorModal 
                    preset={editingPreset}
                    onClose={() => setIsPresetModalOpen(false)}
                    onSave={handleSavePreset}
                />
            )}

            <ProfileHeader 
                profile={profile}
                onEditToggle={() => setIsEditingInfo(!isEditingInfo)}
                onManageShortcuts={() => shortcutsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                onEditPresets={() => presetsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                onClearData={() => {
                    if (window.confirm("This will clear local data like session history. Are you sure?")) {
                        alert("Local data cleared (simulation).");
                    }
                }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-8">
                    <PersonalInfoCard 
                        profile={profile}
                        isEditing={isEditingInfo}
                        onProfileChange={handleProfileDataChange}
                        onSave={handleSaveProfile}
                        onCancel={handleCancelEdit}
                    />
                    <UserPreferencesCard 
                        preferences={preferences} 
                        onPreferencesChange={handlePreferencesChange}
                    />
                    <SecurityCard 
                        settings={preferences.security}
                        onSettingsChange={(path, value) => handlePreferencesChange(`security.${path}`, value)}
                    />
                </div>
                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    <ActivitySummary summary={activity} />
                    <div ref={presetsRef}>
                        <PromptPresets 
                            presets={presets}
                            onAdd={() => handleOpenPresetModal(null)}
                            onEdit={handleOpenPresetModal}
                            onDelete={handleDeletePreset}
                        />
                    </div>
                    <div ref={shortcutsRef}>
                        <KeyboardShortcuts 
                            shortcuts={shortcuts}
                            onAdd={() => alert("Shortcut creation modal would open here.")}
                        />
                    </div>
                    <SavedSessions />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
