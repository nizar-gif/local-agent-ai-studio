import React from 'react';
import { BackupSettings } from '../../../types';
import { SectionTitle, ActionButton, CheckboxGroupField } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: BackupSettings;
  confirmAction: (text: string) => Promise<boolean>;
}

const BackupSettingsComponent: React.FC<Props> = ({ settings, confirmAction, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
    
    const handleIncludeChange = (newSelection: string[]) => {
        handleFieldChange('backup.include', newSelection as BackupSettings['include']);
    };
    
    const handleRestore = async () => {
        const confirmed = await confirmAction('RESTORE FROM BACKUP');
        if (confirmed) {
            alert("Restoring from backup... (This would open a file dialog)");
        }
    };

  return (
    <div>
      <SectionTitle
        title="Import/Export & Backups"
        subtitle="Manage configuration profiles and system data backups."
        searchTerm={searchTerm}
      />
      <div className="space-y-12">
        <div>
            <h4 className="font-semibold text-lg mb-4">Profile Actions</h4>
            <div className="flex flex-wrap gap-4 items-center">
                <ActionButton onClick={() => alert("Exporting profile...")}>Export Active Profile (JSON)</ActionButton>
                <ActionButton onClick={() => alert("Importing profile...")}>Import Profile (JSON)</ActionButton>
            </div>
             <p className="text-xs text-text-secondary mt-2">Profiles allow you to save and switch between different sets of settings.</p>
        </div>
        <div>
            <h4 className="font-semibold text-lg mb-4">System Backup & Restore</h4>
             <div className="max-w-2xl space-y-6">
                <p className="text-sm text-text-secondary">
                    Current Backup schedule (cron): <span className="font-mono text-primary">{settings.schedule}</span>
                </p>
                <CheckboxGroupField
                    path="backup.include"
                    name="backup.include"
                    label="Include in Backup"
                    options={['config', 'db', 'vector_index', 'logs']}
                    selected={settings.include}
                    onChange={handleIncludeChange}
                    isDirty={dirtyFields.has('backup.include')}
                    isOverride={overrideFields.has('backup.include')}
                    onReset={() => handleResetField('backup.include')}
                    searchTerm={searchTerm}
                />
                 <div className="flex flex-wrap gap-4 items-center">
                    <ActionButton onClick={() => alert("Starting backup now...")} variant="primary">Backup Now</ActionButton>
                    <ActionButton onClick={handleRestore} variant="danger">Restore from Backup...</ActionButton>
                </div>
                <p className="text-xs text-text-secondary mt-2">Restoring from a backup will overwrite current configurations and data. This action cannot be undone.</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettingsComponent;