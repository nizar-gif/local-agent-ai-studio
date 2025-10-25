import React from 'react';
import { SystemSettings, MasterSettings } from '../../../types';
import { InputField, SectionTitle, SelectField } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: SystemSettings;
}

const SystemSettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'number') {
      finalValue = parseInt(value, 10);
    } else if (name.endsWith('corsAllowedOrigins')) {
      finalValue = value.split(',').map(s => s.trim()).filter(Boolean);
    }
    handleFieldChange(name, finalValue);
  };
  
  return (
    <div>
      <SectionTitle
        title="System & Performance"
        subtitle="Manage resource limits, device selection, server ports, and logging."
        searchTerm={searchTerm}
      />
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h4 className="font-semibold text-lg">Runtime</h4>
                <InputField path="system.runtime.apiPort" name="system.runtime.apiPort" label="API Port" type="number" value={settings.runtime.apiPort} onChange={handleChange} isDirty={dirtyFields.has('system.runtime.apiPort')} isOverride={overrideFields.has('system.runtime.apiPort')} onReset={() => handleResetField('system.runtime.apiPort')} min="1" max="65535" required searchTerm={searchTerm} />
                <InputField path="system.runtime.uiPort" name="system.runtime.uiPort" label="UI Port" type="number" value={settings.runtime.uiPort} onChange={handleChange} isDirty={dirtyFields.has('system.runtime.uiPort')} isOverride={overrideFields.has('system.runtime.uiPort')} onReset={() => handleResetField('system.runtime.uiPort')} min="1" max="65535" required searchTerm={searchTerm} />
                <InputField path="system.runtime.corsAllowedOrigins" name="system.runtime.corsAllowedOrigins" label="CORS Allowed Origins" value={settings.runtime.corsAllowedOrigins.join(', ')} onChange={handleChange} isDirty={dirtyFields.has('system.runtime.corsAllowedOrigins')} isOverride={overrideFields.has('system.runtime.corsAllowedOrigins')} onReset={() => handleResetField('system.runtime.corsAllowedOrigins')} searchTerm={searchTerm} />
            </div>
            <div className="space-y-6">
                <h4 className="font-semibold text-lg">Limits</h4>
                <InputField path="system.limits.maxParallelRequests" name="system.limits.maxParallelRequests" label="Max Parallel Requests" type="number" value={settings.limits.maxParallelRequests} onChange={handleChange} isDirty={dirtyFields.has('system.limits.maxParallelRequests')} isOverride={overrideFields.has('system.limits.maxParallelRequests')} onReset={() => handleResetField('system.limits.maxParallelRequests')} min="1" required searchTerm={searchTerm} />
                <InputField path="system.limits.requestTimeout" name="system.limits.requestTimeout" label="Request Timeout (s)" type="number" value={settings.limits.requestTimeout} onChange={handleChange} isDirty={dirtyFields.has('system.limits.requestTimeout')} isOverride={overrideFields.has('system.limits.requestTimeout')} onReset={() => handleResetField('system.limits.requestTimeout')} min="1" required searchTerm={searchTerm} />
                <InputField path="system.limits.maxUploadSize" name="system.limits.maxUploadSize" label="Max Upload Size (MB)" type="number" value={settings.limits.maxUploadSize} onChange={handleChange} isDirty={dirtyFields.has('system.limits.maxUploadSize')} isOverride={overrideFields.has('system.limits.maxUploadSize')} onReset={() => handleResetField('system.limits.maxUploadSize')} min="1" required searchTerm={searchTerm} />
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-lg mb-4">Logging</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField path="system.logging.level" name="system.logging.level" label="Log Level" value={settings.logging.level} options={['DEBUG', 'INFO', 'WARN', 'ERROR']} onChange={handleChange} isDirty={dirtyFields.has('system.logging.level')} isOverride={overrideFields.has('system.logging.level')} onReset={() => handleResetField('system.logging.level')} searchTerm={searchTerm} />
                <InputField path="system.logging.filePath" name="system.logging.filePath" label="Log File Path" value={settings.logging.filePath} onChange={handleChange} isDirty={dirtyFields.has('system.logging.filePath')} isOverride={overrideFields.has('system.logging.filePath')} onReset={() => handleResetField('system.logging.filePath')} searchTerm={searchTerm} />
                <InputField path="system.logging.retention" name="system.logging.retention" label="Log Retention (days)" type="number" value={settings.logging.retention} onChange={handleChange} isDirty={dirtyFields.has('system.logging.retention')} isOverride={overrideFields.has('system.logging.retention')} onReset={() => handleResetField('system.logging.retention')} searchTerm={searchTerm} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;