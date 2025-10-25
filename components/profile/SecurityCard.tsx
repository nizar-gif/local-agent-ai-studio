import React from 'react';
import ProfileCard from './ProfileCard';
import { InputField, Toggle } from '../settings/fields';
import { UserPreferences } from '../../types';

interface SecurityCardProps {
    settings: UserPreferences['security'];
    onSettingsChange: (path: string, value: any) => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ settings, onSettingsChange }) => {
    return (
        <ProfileCard title="Security">
            <div className="space-y-4">
                <InputField 
                    path="sessionTimeout"
                    label="Session Timeout (minutes)" 
                    type="number" 
                    value={settings.sessionTimeout} 
                    onChange={e => onSettingsChange('sessionTimeout', parseInt(e.target.value, 10))}
                    description="0 to disable auto-lock." 
                />
                <Toggle 
                    path="twoFactorEnabled"
                    label="Enable 2-Factor Authentication" 
                    checked={settings.twoFactorEnabled} 
                    onChange={(c) => onSettingsChange('twoFactorEnabled', c)} 
                    name="2fa" 
                />
            </div>
        </ProfileCard>
    );
};

export default SecurityCard;