import React, { useEffect, useState } from 'react';
import { OrchestrationSettings } from '../../../types';
import { InputField, SectionTitle, Toggle, RadioGroup, SelectField, CheckboxGroupField, ActionButton } from '../fields';
import { fetchTools } from '../../../services/api';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: OrchestrationSettings;
  confirmAction: (text: string) => Promise<boolean>;
}

const AgentSettings: React.FC<Props> = ({ settings, confirmAction, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
    const [availableTools, setAvailableTools] = useState<string[]>([]);
    useEffect(() => {
        fetchTools().then(setAvailableTools);
    }, []);

  const handleGovernanceToggle = async (name: keyof OrchestrationSettings['governance'], checked: boolean) => {
     if( (name === 'shellAccess' || name === 'internetAccess') && checked) {
        const confirmed = await confirmAction(`ENABLE ${name.toUpperCase()}`);
        if(!confirmed) return;
    }
    handleFieldChange(`orchestration.governance.${name}`, checked);
  };
  
  const handleSectionChange = (section: 'concurrency' | 'autoGen' | 'smolagents' | 'governance', name: string, value: any) => {
      handleFieldChange(`orchestration.${section}.${name}`, value);
  };

  return (
    <div>
      <SectionTitle
        title="Orchestration & Agents"
        subtitle="Configure LangChain/LangGraph, smolagents, AutoGen and agent policies."
        searchTerm={searchTerm}
      />
      <div className="space-y-12">
        <div className="max-w-2xl space-y-6">
            <RadioGroup
                label="Active Orchestrator"
                path="orchestration.activeOrchestrator"
                name="orchestration.activeOrchestrator"
                options={['LangChain/LangGraph', 'smolagents', 'AutoGen']}
                value={settings.activeOrchestrator}
                onChange={(value) => handleFieldChange('orchestration.activeOrchestrator', value as any)}
                isDirty={dirtyFields.has('orchestration.activeOrchestrator')}
                isOverride={overrideFields.has('orchestration.activeOrchestrator')}
                onReset={() => handleResetField('orchestration.activeOrchestrator')}
                searchTerm={searchTerm}
            />
            <InputField label="Default System Prompt" path="orchestration.defaultSystemPrompt" name="orchestration.defaultSystemPrompt" value={settings.defaultSystemPrompt} onChange={(e) => handleFieldChange('orchestration.defaultSystemPrompt', e.target.value)} rows={4} isDirty={dirtyFields.has('orchestration.defaultSystemPrompt')} isOverride={overrideFields.has('orchestration.defaultSystemPrompt')} onReset={() => handleResetField('orchestration.defaultSystemPrompt')} searchTerm={searchTerm} />
             <InputField label="Max Turns per Task" path="orchestration.maxTurnsPerTask" name="orchestration.maxTurnsPerTask" type="number" value={settings.maxTurnsPerTask} onChange={(e) => handleFieldChange('orchestration.maxTurnsPerTask', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.maxTurnsPerTask')} isOverride={overrideFields.has('orchestration.maxTurnsPerTask')} onReset={() => handleResetField('orchestration.maxTurnsPerTask')} searchTerm={searchTerm} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
             <div>
                <h4 className="font-semibold text-lg mb-4">Concurrency</h4>
                <div className="space-y-6">
                    <InputField label="Max Concurrent Tasks" path="orchestration.concurrency.maxConcurrentTasks" name="maxConcurrentTasks" type="number" value={settings.concurrency.maxConcurrentTasks} onChange={(e) => handleSectionChange('concurrency', 'maxConcurrentTasks', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.concurrency.maxConcurrentTasks')} isOverride={overrideFields.has('orchestration.concurrency.maxConcurrentTasks')} onReset={() => handleResetField('orchestration.concurrency.maxConcurrentTasks')} searchTerm={searchTerm} />
                    <InputField label="Per-agent Parallelism" path="orchestration.concurrency.perAgentParallelism" name="perAgentParallelism" type="number" value={settings.concurrency.perAgentParallelism} onChange={(e) => handleSectionChange('concurrency', 'perAgentParallelism', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.concurrency.perAgentParallelism')} isOverride={overrideFields.has('orchestration.concurrency.perAgentParallelism')} onReset={() => handleResetField('orchestration.concurrency.perAgentParallelism')} searchTerm={searchTerm} />
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-lg mb-4">Governance</h4>
                <div className="space-y-6">
                    <CheckboxGroupField path="orchestration.governance.toolAllowlist" name="orchestration.governance.toolAllowlist" label="Tool Allowlist" options={availableTools} selected={settings.governance.toolAllowlist} onChange={(selected) => handleSectionChange('governance', 'toolAllowlist', selected)} isDirty={dirtyFields.has('orchestration.governance.toolAllowlist')} isOverride={overrideFields.has('orchestration.governance.toolAllowlist')} onReset={() => handleResetField('orchestration.governance.toolAllowlist')} searchTerm={searchTerm} />
                    <InputField label="Token Budget per Task" path="orchestration.governance.tokenBudgetPerTask" type="number" description="0 = unlimited" value={settings.governance.tokenBudgetPerTask} onChange={(e) => handleSectionChange('governance', 'tokenBudgetPerTask', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.governance.tokenBudgetPerTask')} isOverride={overrideFields.has('orchestration.governance.tokenBudgetPerTask')} onReset={() => handleResetField('orchestration.governance.tokenBudgetPerTask')} searchTerm={searchTerm} />
                    <Toggle path="orchestration.governance.internetAccess" name="internetAccess" label="Internet Access" description="Allow agents to access the internet via search tools." checked={settings.governance.internetAccess} onChange={(c) => handleGovernanceToggle('internetAccess', c)} isDirty={dirtyFields.has('orchestration.governance.internetAccess')} isOverride={overrideFields.has('orchestration.governance.internetAccess')} onReset={() => handleResetField('orchestration.governance.internetAccess')} searchTerm={searchTerm} />
                    <Toggle path="orchestration.governance.shellAccess" name="shellAccess" label="Shell Access" description="HIGHLY DANGEROUS. Allow agents to execute shell commands." checked={settings.governance.shellAccess} onChange={(c) => handleGovernanceToggle('shellAccess', c)} isDirty={dirtyFields.has('orchestration.governance.shellAccess')} isOverride={overrideFields.has('orchestration.governance.shellAccess')} onReset={() => handleResetField('orchestration.governance.shellAccess')} searchTerm={searchTerm} />
                    <Toggle path="orchestration.governance.pythonExecSandbox" name="pythonExecSandbox" label="Python Sandbox" description="Execute agent-generated Python code in a sandboxed environment." checked={settings.governance.pythonExecSandbox} onChange={(c) => handleGovernanceToggle('pythonExecSandbox', c)} isDirty={dirtyFields.has('orchestration.governance.pythonExecSandbox')} isOverride={overrideFields.has('orchestration.governance.pythonExecSandbox')} onReset={() => handleResetField('orchestration.governance.pythonExecSandbox')} searchTerm={searchTerm} />
                </div>
            </div>
            
             {settings.activeOrchestrator === 'AutoGen' && (
                <div>
                    <h4 className="font-semibold text-lg mb-4">AutoGen Settings</h4>
                    <div className="space-y-6">
                        <SelectField label="Agent Topology" path="orchestration.autoGen.agentTopology" options={['Planner+Executor', 'Triad', 'Custom']} value={settings.autoGen.agentTopology} onChange={(e) => handleSectionChange('autoGen', 'agentTopology', e.target.value)} isDirty={dirtyFields.has('orchestration.autoGen.agentTopology')} isOverride={overrideFields.has('orchestration.autoGen.agentTopology')} onReset={() => handleResetField('orchestration.autoGen.agentTopology')} searchTerm={searchTerm} />
                        <InputField label="Max Rounds" path="orchestration.autoGen.maxRounds" type="number" value={settings.autoGen.maxRounds} onChange={(e) => handleSectionChange('autoGen', 'maxRounds', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.autoGen.maxRounds')} isOverride={overrideFields.has('orchestration.autoGen.maxRounds')} onReset={() => handleResetField('orchestration.autoGen.maxRounds')} searchTerm={searchTerm} />
                        <InputField label="Stop Criteria" path="orchestration.autoGen.stopCriteria" description="Keywords or regex to terminate the session." value={settings.autoGen.stopCriteria} onChange={(e) => handleSectionChange('autoGen', 'stopCriteria', e.target.value)} isDirty={dirtyFields.has('orchestration.autoGen.stopCriteria')} isOverride={overrideFields.has('orchestration.autoGen.stopCriteria')} onReset={() => handleResetField('orchestration.autoGen.stopCriteria')} searchTerm={searchTerm} />
                    </div>
                </div>
             )}

             {settings.activeOrchestrator === 'smolagents' && (
                 <div>
                    <h4 className="font-semibold text-lg mb-4">smol-agents Settings</h4>
                    <div className="space-y-6">
                       <InputField label="Execution Backend" path="orchestration.smolagents.executionBackend" value={settings.smolagents.executionBackend} readOnly disabled searchTerm={searchTerm} />
                       <InputField label="Max Code Cells" path="orchestration.smolagents.maxCodeCells" type="number" value={settings.smolagents.maxCodeCells} onChange={(e) => handleSectionChange('smolagents', 'maxCodeCells', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.smolagents.maxCodeCells')} isOverride={overrideFields.has('orchestration.smolagents.maxCodeCells')} onReset={() => handleResetField('orchestration.smolagents.maxCodeCells')} searchTerm={searchTerm} />
                       <InputField label="Timeout per Cell (s)" path="orchestration.smolagents.timeoutPerCell" type="number" value={settings.smolagents.timeoutPerCell} onChange={(e) => handleSectionChange('smolagents', 'timeoutPerCell', parseInt(e.target.value) || 0)} isDirty={dirtyFields.has('orchestration.smolagents.timeoutPerCell')} isOverride={overrideFields.has('orchestration.smolagents.timeoutPerCell')} onReset={() => handleResetField('orchestration.smolagents.timeoutPerCell')} searchTerm={searchTerm} />
                    </div>
                </div>
             )}
        </div>
         <div>
            <h4 className="font-semibold text-lg mb-4">Actions</h4>
            <div className="flex gap-4">
                <ActionButton onClick={() => alert("Validating orchestrator...")}>Validate Orchestrator</ActionButton>
                <ActionButton onClick={() => alert(`Registered tools:\n${availableTools.join('\n')}`)}>List Registered Tools</ActionButton>
                <ActionButton onClick={() => alert("Running dry-run task...")}>Dry-run Sample Task</ActionButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;