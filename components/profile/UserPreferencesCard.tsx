import React from 'react';
import { UserPreferences } from '../../types';
import ProfileCard from './ProfileCard';
import { SelectField, Toggle } from '../settings/fields';

interface UserPreferencesCardProps {
    preferences: UserPreferences;
    onPreferencesChange: (path: string, value: any) => void;
}

const UserPreferencesCard: React.FC<UserPreferencesCardProps> = ({ preferences, onPreferencesChange }) => {
    return (
        <ProfileCard title="User Preferences">
            <div className="space-y-4">
                <SelectField path="theme" label="Theme" value={preferences.theme} options={['System', 'Light', 'Dark']} onChange={e => onPreferencesChange('theme', e.target.value)} />
                <SelectField path="fontSize" label="Font Size" value={preferences.fontSize} options={['Small', 'Normal', 'Large']} onChange={e => onPreferencesChange('fontSize', e.target.value)} />
                <h4 className="font-semibold text-text-secondary pt-2">Chat</h4>
                <Toggle path="chat.enterToSend" label="Enter to Send" checked={preferences.chat.enterToSend} onChange={(c) => onPreferencesChange('chat.enterToSend', c)} name="enterToSend" />
                <Toggle path="chat.showReasoningSteps" label="Show Reasoning Steps" checked={preferences.chat.showReasoningSteps} onChange={(c) => onPreferencesChange('chat.showReasoningSteps', c)} name="showReasoning" />
                <Toggle path="chat.streamResponses" label="Stream Responses" checked={preferences.chat.streamResponses} onChange={(c) => onPreferencesChange('chat.streamResponses', c)} name="streamResponses" />
                <h4 className="font-semibold text-text-secondary pt-2">Notifications</h4>
                <Toggle path="notifications.desktop" label="Enable Desktop Notifications" checked={preferences.notifications.desktop} onChange={(c) => onPreferencesChange('notifications.desktop', c)} name="desktopNotifs" />
                 <Toggle path="notifications.taskCompletion" label="Alert on Long Task Completion" checked={preferences.notifications.taskCompletion} onChange={(c) => onPreferencesChange('notifications.taskCompletion', c)} name="taskNotifs" />
                 <h4 className="font-semibold text-text-secondary pt-2">Accessibility</h4>
                 <Toggle path="accessibility.highContrast" label="High Contrast Mode" checked={preferences.accessibility.highContrast} onChange={(c) => onPreferencesChange('accessibility.highContrast', c)} name="highContrast" />
            </div>
        </ProfileCard>
    );
};

export default UserPreferencesCard;