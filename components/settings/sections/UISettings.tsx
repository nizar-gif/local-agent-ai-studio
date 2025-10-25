import React from 'react';
import { UISettings } from '../../../types';
import { SectionTitle, SelectField, Toggle } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: UISettings;
}

const UISettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFieldChange(e.target.name, e.target.value);
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    handleFieldChange(name, checked);
  };

  return (
    <div>
      <SectionTitle
        title="UI & Accessibility"
        subtitle="Customize the appearance, behavior, and accessibility of the application."
        searchTerm={searchTerm}
      />
      <div className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SelectField
                path="ui.theme"
                name="ui.theme"
                label="Theme"
                options={['Light', 'Dark', 'System']}
                value={settings.theme}
                onChange={handleChange}
                isDirty={dirtyFields.has('ui.theme')}
                isOverride={overrideFields.has('ui.theme')}
                onReset={() => handleResetField('ui.theme')}
                searchTerm={searchTerm}
            />
            <SelectField
                path="ui.density"
                name="ui.density"
                label="Density"
                options={['Compact', 'Comfortable']}
                value={settings.density}
                onChange={handleChange}
                isDirty={dirtyFields.has('ui.density')}
                isOverride={overrideFields.has('ui.density')}
                onReset={() => handleResetField('ui.density')}
                searchTerm={searchTerm}
            />
             <SelectField
                path="ui.fontSize"
                name="ui.fontSize"
                label="Font Size"
                options={['Small', 'Normal', 'Large']}
                value={settings.fontSize}
                onChange={handleChange}
                isDirty={dirtyFields.has('ui.fontSize')}
                isOverride={overrideFields.has('ui.fontSize')}
                onReset={() => handleResetField('ui.fontSize')}
                searchTerm={searchTerm}
            />
        </div>
        <div>
            <h4 className="font-semibold text-lg mb-4">Chat Experience</h4>
            <div className="space-y-4">
                <Toggle path="ui.chatUx.enterToSend" name="ui.chatUx.enterToSend" label="Enter to Send" checked={settings.chatUx.enterToSend} onChange={(c) => handleToggleChange('ui.chatUx.enterToSend', c)} isDirty={dirtyFields.has('ui.chatUx.enterToSend')} isOverride={overrideFields.has('ui.chatUx.enterToSend')} onReset={() => handleResetField('ui.chatUx.enterToSend')} searchTerm={searchTerm} />
                <Toggle path="ui.chatUx.showTokens" name="ui.chatUx.showTokens" label="Show Tokens & Latency" checked={settings.chatUx.showTokens} onChange={(c) => handleToggleChange('ui.chatUx.showTokens', c)} isDirty={dirtyFields.has('ui.chatUx.showTokens')} isOverride={overrideFields.has('ui.chatUx.showTokens')} onReset={() => handleResetField('ui.chatUx.showTokens')} searchTerm={searchTerm} />
                <Toggle path="ui.chatUx.showAgentSteps" name="ui.chatUx.showAgentSteps" label="Show Agent Steps" description="Display intermediate thinking steps from agents in the chat." checked={settings.chatUx.showAgentSteps} onChange={(c) => handleToggleChange('ui.chatUx.showAgentSteps', c)} isDirty={dirtyFields.has('ui.chatUx.showAgentSteps')} isOverride={overrideFields.has('ui.chatUx.showAgentSteps')} onReset={() => handleResetField('ui.chatUx.showAgentSteps')} searchTerm={searchTerm} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default UISettings;