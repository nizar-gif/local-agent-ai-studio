import React from 'react';
import { MasterSettings, Job } from '../../types';
import SettingsSidebar from './SettingsSidebar';
import RightSystemPanel from './RightSystemPanel';
import SettingsFooter from './SettingsFooter';
import SettingsHeader from './SettingsHeader';
import WorkspaceSettings from './sections/WorkspaceSettings';
import ProviderSettings from './sections/ProviderSettings';
import AgentSettings from './sections/AgentSettings';
import RAGSettings from './sections/RAGSettings';
import IntegrationSettings from './sections/IntegrationSettings';
import SchedulerSettings from './sections/SchedulerSettings';
import SystemSettings from './sections/SystemSettings';
import MCPSettings from './sections/MCPSettings';
import SecuritySettings from './sections/SecuritySettings';
import UISettings from './sections/UISettings';
import BackupSettings from './sections/BackupSettings';
import DiagnosticsSettings from './sections/DiagnosticsSettings';
import { useJobs } from '../../App';

export interface SettingsSectionProps {
    handleFieldChange: (path: string, value: any) => void;
    handleResetField: (path: string) => void;
    dirtyFields: Set<string>;
    overrideFields: Set<string>;
    searchTerm: string;
    showAdvanced?: boolean;
}

export interface SettingsLayoutProps {
    settings: MasterSettings;
    activeSection: string;
    setActiveSection: (section: string) => void;
    isDirty: boolean;
    errors: Record<string, string>;
    onApply: () => void;
    onReset: () => void;
    applyStatus: 'idle' | 'saving' | 'saved';
    isRestartRequired: boolean;
    confirmAction: (text: string) => Promise<boolean>;
    onProfileChange: (profileId: string) => void;
    onNewProfile: () => void;
    onCloneProfile: () => void;
    onDeleteProfile: () => void;
    dirtyFields: Set<string>;
    overrideFields: Set<string>;
    handleFieldChange: (path: string, value: any) => void;
    handleResetField: (path: string) => void;
    showAdvanced: boolean;
    onShowAdvancedChange: (show: boolean) => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = (props) => {
    const { settings, activeSection, setActiveSection, confirmAction, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm, showAdvanced } = props;
    const { addJob } = useJobs();

    const sectionProps = { handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm, showAdvanced };

    const renderSection = () => {
        switch (activeSection) {
            case 'Workspace': return <WorkspaceSettings settings={settings.workspace} {...sectionProps} />;
            case 'Providers & Models': return <ProviderSettings settings={settings.llm} {...sectionProps} />;
            case 'Orchestration & Agents': return <AgentSettings settings={settings.orchestration} confirmAction={confirmAction} {...sectionProps} />;
            case 'Data & RAG': return <RAGSettings settings={settings.rag} addJob={addJob} {...sectionProps} />;
            case 'Integrations': return <IntegrationSettings settings={settings.email} addJob={addJob} {...sectionProps} />;
            case 'Automation & Scheduler': return <SchedulerSettings settings={settings.scheduler} {...sectionProps} />;
            case 'System & Performance': return <SystemSettings settings={settings.system} {...sectionProps} />;
            case 'MCP': return <MCPSettings settings={settings.mcp} {...sectionProps} />;
            case 'Security & Secrets': return <SecuritySettings settings={settings.security} {...sectionProps} />;
            case 'UI & Accessibility': return <UISettings settings={settings.ui} {...sectionProps} />;
            case 'Import/Export & Backups': return <BackupSettings settings={settings.backup} confirmAction={confirmAction} {...sectionProps} />;
            case 'Diagnostics & Tools': return <DiagnosticsSettings addJob={addJob} />;
            default: return <div>Select a section</div>;
        }
    };

    return (
        <div className="flex h-full gap-6 -m-6 p-6">
            <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex-1 flex flex-col relative pb-24"> {/* Padding bottom for footer */}
                <SettingsHeader 
                    profiles={settings.workspace.profiles}
                    activeProfileId={settings.workspace.profile}
                    onProfileChange={props.onProfileChange}
                    onNewProfile={props.onNewProfile}
                    onCloneProfile={props.onCloneProfile}
                    onDeleteProfile={props.onDeleteProfile}
                    showAdvanced={props.showAdvanced}
                    onShowAdvancedChange={props.onShowAdvancedChange}
                    searchTerm={props.searchTerm}
                    onSearchTermChange={props.onSearchTermChange}
                />
                <main className="flex-1 overflow-y-auto pr-4">
                    {renderSection()}
                </main>
                <SettingsFooter {...props} />
            </div>
            <RightSystemPanel />
        </div>
    );
};

export default SettingsLayout;