import React from 'react';
import { SecuritySettings, MasterSettings } from '../../../types';
import { SectionTitle, Toggle, InputField, SecretField } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: SecuritySettings;
}

const SecuritySettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
  
  const handleToggle = (name: string, checked: boolean) => {
    handleFieldChange(name, checked);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChange(e.target.name, parseInt(e.target.value, 10));
  }

  return (
    <div>
      <SectionTitle
        title="Security & Secrets"
        subtitle="Manage secrets, access control, and other security-related features."
        searchTerm={searchTerm}
      />
      <div className="space-y-8">
        <div className="max-w-2xl space-y-6">
            <Toggle 
                path="security.safeMode"
                name="security.safeMode" 
                label="Enable Safe Mode" 
                description="Globally disables potentially dangerous tools like shell and internet access."
                checked={settings.safeMode}
                onChange={(c) => handleToggle('security.safeMode', c)}
                isDirty={dirtyFields.has('security.safeMode')}
                isOverride={overrideFields.has('security.safeMode')}
                onReset={() => handleResetField('security.safeMode')}
                searchTerm={searchTerm}
            />
             <InputField
                path="security.sessionLockTimeout"
                name="security.sessionLockTimeout"
                label="Session Lock Timeout (minutes)" 
                type="number"
                description="Automatically lock the UI after a period of inactivity. 0 to disable."
                value={settings.sessionLockTimeout}
                onChange={handleChange}
                isDirty={dirtyFields.has('security.sessionLockTimeout')}
                isOverride={overrideFields.has('security.sessionLockTimeout')}
                onReset={() => handleResetField('security.sessionLockTimeout')}
                searchTerm={searchTerm}
             />
        </div>
        <div>
            <h4 className="font-semibold text-lg mb-4">Secrets Management</h4>
            <div className="overflow-x-auto bg-secondary/50 border border-border rounded-lg max-w-4xl">
                 <table className="w-full text-left">
                    <thead className="border-b border-border">
                        <tr>
                            <th className="p-3 text-sm">Key Name</th>
                            <th className="p-3 text-sm">Value</th>
                            <th className="p-3 text-sm">Source</th>
                            <th className="p-3 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings.secrets.map(secret => (
                            <tr key={secret.key} className="border-t border-border">
                                <td className="p-3 font-mono text-xs">{secret.key}</td>
                                <td className="p-3 font-mono text-xs">************</td>
                                <td className="p-3 text-xs">{secret.source}</td>
                                <td className="p-3 space-x-3">
                                    <button className="text-xs font-semibold text-primary hover:text-primary-hover">Set/Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;