import React, { useState } from 'react';
import { LLMSettings } from '../../../types';
import { InputField, SectionTitle, SecretField, RadioGroup } from '../fields';
import { testOllamaConnection, testOpenAIConnection, testHFConnection } from '../../../services/api';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: LLMSettings;
}
type TestStatus = { status: 'idle' | 'testing' | 'success' | 'error', message: string };

const ProviderSettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
  const [ollamaTest, setOllamaTest] = useState<TestStatus>({ status: 'idle', message: '' });
  const [openAITest, setOpenAITest] = useState<TestStatus>({ status: 'idle', message: '' });
  const [hfTest, setHfTest] = useState<TestStatus>({ status: 'idle', message: '' });

  const handleProviderChange = (value: string) => {
    handleFieldChange('llm.provider_mode', value as LLMSettings['provider_mode']);
  };
  
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     handleFieldChange(`llm.local.${e.target.name}`, e.target.value);
  }
  
  const handleOpenAIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     handleFieldChange(`llm.openai.${e.target.name}`, e.target.value);
  }
  
  const handleHFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     handleFieldChange(`llm.hf.${e.target.name}`, e.target.value);
  }
  
  const runTest = async (testFn: () => Promise<{ok: boolean, message?: string, [key: string]: any}>, setStatus: React.Dispatch<React.SetStateAction<TestStatus>>) => {
      setStatus({ status: 'testing', message: 'Testing connection...' });
      try {
        const result = await testFn();
        if(result.ok) {
            setStatus({ status: 'success', message: result.message || `Success! Latency: ${result.latency_ms}ms, Model: ${result.model}` });
        } else {
            setStatus({ status: 'error', message: result.message || 'Connection failed. Check configuration and logs.' });
        }
      } catch (error) {
        setStatus({ status: 'error', message: error instanceof Error ? error.message : 'An unknown error occurred.' });
      }
  }

  return (
    <div>
      <SectionTitle
        title="Providers & Models"
        subtitle="Select and configure the primary LLM provider. Exactly one is active at a time."
        searchTerm={searchTerm}
      />
      <div className="space-y-6 max-w-2xl">
        <RadioGroup
            label="Provider Mode"
            path="llm.provider_mode"
            name="provider_mode"
            options={['local', 'openai', 'hf']}
            value={settings.provider_mode}
            onChange={handleProviderChange}
            isDirty={dirtyFields.has('llm.provider_mode')}
            isOverride={overrideFields.has('llm.provider_mode')}
            onReset={() => handleResetField('llm.provider_mode')}
            searchTerm={searchTerm}
        />

        {settings.provider_mode === 'local' && (
          <div className="p-6 border border-border rounded-lg space-y-4 bg-secondary/50">
            <h4 className="font-bold text-lg">Local (Ollama)</h4>
            <InputField label="Base URL" path="llm.local.base_url" name="base_url" value={settings.local.base_url} onChange={handleLocalChange} isDirty={dirtyFields.has('llm.local.base_url')} isOverride={overrideFields.has('llm.local.base_url')} onReset={() => handleResetField('llm.local.base_url')} searchTerm={searchTerm} />
            <InputField label="Model" path="llm.local.model" name="model" value={settings.local.model} onChange={handleLocalChange} description="Model name from Ollama (e.g., mistral:7b)" isDirty={dirtyFields.has('llm.local.model')} isOverride={overrideFields.has('llm.local.model')} onReset={() => handleResetField('llm.local.model')} searchTerm={searchTerm} />
            <button onClick={() => runTest(testOllamaConnection, setOllamaTest)} className="text-sm font-semibold text-primary hover:text-primary-hover">{ollamaTest.status === 'testing' ? 'Testing...' : 'Test Local Model'}</button>
            {ollamaTest.message && <p className={`text-xs ${ollamaTest.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{ollamaTest.message}</p>}
          </div>
        )}
        
        {settings.provider_mode === 'openai' && (
          <div className="p-6 border border-border rounded-lg space-y-4 bg-secondary/50">
            <h4 className="font-bold text-lg">Cloud (OpenAI)</h4>
            <SecretField label="API Key" path="llm.openai.api_key" name="api_key" value={settings.openai.api_key} onChange={handleOpenAIChange} isDirty={dirtyFields.has('llm.openai.api_key')} isOverride={overrideFields.has('llm.openai.api_key')} onReset={() => handleResetField('llm.openai.api_key')} searchTerm={searchTerm} />
            <InputField label="Model" path="llm.openai.model" name="model" value={settings.openai.model} onChange={handleOpenAIChange} description="e.g., gpt-4o-mini" isDirty={dirtyFields.has('llm.openai.model')} isOverride={overrideFields.has('llm.openai.model')} onReset={() => handleResetField('llm.openai.model')} searchTerm={searchTerm} />
            <InputField label="Base URL (Optional)" path="llm.openai.base_url" name="base_url" value={settings.openai.base_url || ''} onChange={handleOpenAIChange} placeholder="e.g., for custom proxy" isDirty={dirtyFields.has('llm.openai.base_url')} isOverride={overrideFields.has('llm.openai.base_url')} onReset={() => handleResetField('llm.openai.base_url')} searchTerm={searchTerm} />
            <button onClick={() => runTest(() => testOpenAIConnection(settings.openai.api_key), setOpenAITest)} className="text-sm font-semibold text-primary hover:text-primary-hover">{openAITest.status === 'testing' ? 'Testing...' : 'Test OpenAI'}</button>
            {openAITest.message && <p className={`text-xs ${openAITest.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{openAITest.message}</p>}
          </div>
        )}

        {settings.provider_mode === 'hf' && (
          <div className="p-6 border border-border rounded-lg space-y-4 bg-secondary/50">
            <h4 className="font-bold text-lg">Cloud (Hugging Face)</h4>
            <SecretField label="API Token" path="llm.hf.api_token" name="api_token" value={settings.hf.api_token} onChange={handleHFChange} isDirty={dirtyFields.has('llm.hf.api_token')} isOverride={overrideFields.has('llm.hf.api_token')} onReset={() => handleResetField('llm.hf.api_token')} searchTerm={searchTerm} />
            <InputField label="Model Repository ID" path="llm.hf.model" name="model" value={settings.hf.model} onChange={handleHFChange} description="e.g., mistralai/Mistral-7B-Instruct-v0.3" isDirty={dirtyFields.has('llm.hf.model')} isOverride={overrideFields.has('llm.hf.model')} onReset={() => handleResetField('llm.hf.model')} searchTerm={searchTerm} />
            <button onClick={() => runTest(() => testHFConnection(settings.hf.api_token), setHfTest)} className="text-sm font-semibold text-primary hover:text-primary-hover">{hfTest.status === 'testing' ? 'Testing...' : 'Test Hugging Face'}</button>
             {hfTest.message && <p className={`text-xs ${hfTest.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{hfTest.message}</p>}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProviderSettings;