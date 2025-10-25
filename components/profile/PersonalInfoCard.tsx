import React from 'react';
import { UserProfileData } from '../../types';
import ProfileCard from './ProfileCard';
import { InputField, SelectField } from '../settings/fields';

interface PersonalInfoCardProps {
    profile: UserProfileData;
    isEditing: boolean;
    onProfileChange: (field: keyof UserProfileData, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
        <p className="mt-1 text-text-primary">{value}</p>
    </div>
);


const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile, isEditing, onProfileChange, onSave, onCancel }) => {
    return (
        <ProfileCard title="Personal Information">
            <div className="space-y-4">
                {isEditing ? (
                    <>
                        <InputField 
                            path="displayName"
                            label="Display Name" 
                            value={profile.displayName} 
                            onChange={e => onProfileChange('displayName', e.target.value)} 
                        />
                        <InputField 
                            path="email"
                            label="Email Address" 
                            value={profile.email} 
                            onChange={e => onProfileChange('email', e.target.value)}
                        />
                         <SelectField 
                            path="language"
                            label="Language" 
                            value={profile.language} 
                            options={['English (US)']} 
                            onChange={e => onProfileChange('language', e.target.value)} 
                        />
                        <SelectField 
                            path="timezone"
                            label="Timezone" 
                            value={profile.timezone} 
                            options={[profile.timezone, 'Etc/UTC']} 
                            onChange={e => onProfileChange('timezone', e.target.value)} 
                        />
                        <div className="flex justify-end gap-2 pt-2">
                           <button onClick={onCancel} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold text-sm">Cancel</button>
                           <button onClick={onSave} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-semibold text-sm">Save</button>
                        </div>
                    </>
                ) : (
                    <>
                        <DetailItem label="Display Name" value={profile.displayName} />
                        <DetailItem label="Email Address" value={profile.email} />
                        <DetailItem label="Role" value={profile.role} />
                        <DetailItem label="Language" value={profile.language} />
                        <DetailItem label="Timezone" value={profile.timezone} />
                    </>
                )}
            </div>
        </ProfileCard>
    );
};

export default PersonalInfoCard;