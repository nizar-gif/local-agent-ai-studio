import React from 'react';
import { WorkspaceSettings } from '../../../types';
import { InputField, SectionTitle } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: WorkspaceSettings;
}

const WorkspaceSettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFieldChange(`workspace.${name}`, value);
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Workspace"
        subtitle="Identify the workspace and control persistence paths."
        searchTerm={searchTerm}
      />

      <div className="space-y-6 max-w-2xl">
        <InputField
          label="Workspace Name"
          path="workspace.workspaceName"
          id="workspaceName"
          name="workspaceName"
          value={settings.workspaceName}
          onChange={handleChange}
          isDirty={dirtyFields.has('workspace.workspaceName')}
          isOverride={overrideFields.has('workspace.workspaceName')}
          onReset={() => handleResetField('workspace.workspaceName')}
          searchTerm={searchTerm}
        />
        <InputField
          label="Config Storage Path"
          path="workspace.configStoragePath"
          id="configStoragePath"
          name="configStoragePath"
          value={settings.configStoragePath}
          onChange={handleChange}
          description="Default: %APPDATA%\\LocalAIAgent\\config"
          isDirty={dirtyFields.has('workspace.configStoragePath')}
          isOverride={overrideFields.has('workspace.configStoragePath')}
          onReset={() => handleResetField('workspace.configStoragePath')}
          searchTerm={searchTerm}
        />
        <InputField
          label="Data Root Path"
          path="workspace.dataRootPath"
          id="dataRootPath"
          name="dataRootPath"
          value={settings.dataRootPath}
          onChange={handleChange}
          description="Default: %USERPROFILE%\\LocalAIAgent"
          isDirty={dirtyFields.has('workspace.dataRootPath')}
          isOverride={overrideFields.has('workspace.dataRootPath')}
          onReset={() => handleResetField('workspace.dataRootPath')}
          searchTerm={searchTerm}
        />
        <InputField
            label="Config Version"
            path="workspace.configVersion"
            id="configVersion"
            name="configVersion"
            value={settings.configVersion}
            readOnly
            searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default WorkspaceSettings;