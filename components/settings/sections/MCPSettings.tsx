import React from 'react';
import { MCPSettings } from '../../../types';
import { InputField, SectionTitle, Toggle, RadioGroup, SecretField } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: MCPSettings;
}

const MCPSettingsComponent: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const path = `mcp.${name}`;
    let finalValue: any = value;

    if (type === 'number') {
      finalValue = parseInt(value, 10);
    } else if (name === 'allowed_origins') {
      finalValue = value.split(',').map(s => s.trim()).filter(Boolean);
    }
    handleFieldChange(path, finalValue);
  };

  return (
    <div>
      <SectionTitle
        title="MCP (Model Context Protocol)"
        subtitle="Configure the built-in MCP server for interoperability with other services."
        searchTerm={searchTerm}
      />
      <div className="space-y-6 max-w-2xl">
        <Toggle
          label="Enable MCP Server"
          path="mcp.enabled"
          name="mcp.enabled"
          checked={settings.enabled}
          onChange={(checked) => handleFieldChange('mcp.enabled', checked)}
          description="Exposes a server on the specified port for model context sharing."
          isDirty={dirtyFields.has('mcp.enabled')}
          isOverride={overrideFields.has('mcp.enabled')}
          onReset={() => handleResetField('mcp.enabled')}
          searchTerm={searchTerm}
        />
        <InputField
          label="MCP Port"
          path="mcp.port"
          name="port"
          type="number"
          value={settings.port}
          onChange={handleChange}
          disabled={!settings.enabled}
          isDirty={dirtyFields.has('mcp.port')}
          isOverride={overrideFields.has('mcp.port')}
          onReset={() => handleResetField('mcp.port')}
          searchTerm={searchTerm}
        />
        <InputField
          label="Context TTL (seconds)"
          path="mcp.context_ttl"
          name="context_ttl"
          type="number"
          value={settings.context_ttl}
          onChange={handleChange}
          description="How long context is stored before being discarded."
          disabled={!settings.enabled}
          isDirty={dirtyFields.has('mcp.context_ttl')}
          isOverride={overrideFields.has('mcp.context_ttl')}
          onReset={() => handleResetField('mcp.context_ttl')}
          searchTerm={searchTerm}
        />
        <InputField
          label="Allowed Origins"
          path="mcp.allowed_origins"
          name="allowed_origins"
          value={settings.allowed_origins.join(', ')}
          onChange={handleChange}
          description="Comma-separated list of allowed origins for CORS."
          disabled={!settings.enabled}
          isDirty={dirtyFields.has('mcp.allowed_origins')}
          isOverride={overrideFields.has('mcp.allowed_origins')}
          onReset={() => handleResetField('mcp.allowed_origins')}
          searchTerm={searchTerm}
        />
        <RadioGroup
            label="Authentication Mode"
            path="mcp.auth_mode"
            name="mcp.auth_mode"
            options={['none', 'api_key']}
            value={settings.auth_mode}
            onChange={(value) => handleFieldChange('mcp.auth_mode', value as any)}
            isDirty={dirtyFields.has('mcp.auth_mode')}
            isOverride={overrideFields.has('mcp.auth_mode')}
            onReset={() => handleResetField('mcp.auth_mode')}
            searchTerm={searchTerm}
        />
        {settings.auth_mode === 'api_key' && (
             <SecretField
                label="MCP API Key"
                path="mcp.api_key"
                name="api_key"
                value={settings.api_key || ''}
                onChange={handleChange}
                description="Clients must provide this key in the Authorization header."
                disabled={!settings.enabled}
                isDirty={dirtyFields.has('mcp.api_key')}
                isOverride={overrideFields.has('mcp.api_key')}
                onReset={() => handleResetField('mcp.api_key')}
                searchTerm={searchTerm}
            />
        )}
      </div>
    </div>
  );
};

export default MCPSettingsComponent;