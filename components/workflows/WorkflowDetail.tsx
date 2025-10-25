
import React, { useState } from 'react';
import { Workflow } from '../../types';
import { XCircleIcon } from '../shared/Icons';
import WorkflowCanvas from './WorkflowCanvas';

interface WorkflowDetailProps {
    workflow: Workflow;
    onClose: () => void;
}

type ActiveTab = 'Overview' | 'Graph' | 'Parameters' | 'Logs' | 'Runs' | 'Output';

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflow, onClose }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Graph');

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <div className="space-y-4">
                    <p className="text-sm text-text-secondary">A multi-step process for onboarding new employees, including account creation and sending welcome materials.</p>
                    <InfoItem label="Created By" value={workflow.createdBy} />
                    <InfoItem label="Type" value={workflow.type} />
                    <InfoItem label="Status" value={workflow.status} />
                </div>;
            case 'Graph':
                return <div className="h-96 border border-border rounded-lg"><WorkflowCanvas workflow={workflow} /></div>;
            case 'Parameters':
                return <p className="text-sm text-text-secondary">Global variables and input bindings for this workflow will appear here.</p>;
            case 'Logs':
                return <p className="text-sm text-text-secondary">A combined log stream from all steps of a run will be shown here.</p>;
            case 'Runs':
                 return <p className="text-sm text-text-secondary">A history of previous executions for this workflow will be listed here.</p>;
            case 'Output':
                return <p className="text-sm text-text-secondary">Final results and generated artifacts (text, files, summaries) will appear here.</p>;
            default:
                return null;
        }
    };
    
    return (
        <div className="p-6 h-full flex flex-col">
             <div className="flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold">{workflow.name}</h3>
                        <p className="text-sm text-text-secondary">{workflow.steps} steps</p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
                <div className="mt-4 border-b border-border">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton name="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Graph" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Parameters" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Logs" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Runs" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Output" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </div>
             <div className="flex-1 py-6 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

const InfoItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{label}</p>
        <p className="text-sm mt-1 text-text-primary">{value}</p>
    </div>
);

export default WorkflowDetail;
