import React, { useState, useEffect } from 'react';
import { LogEntry } from '../../types';

interface LogDetailPanelProps {
    log: LogEntry | null;
}

type ActiveTab = 'Overview' | 'Context' | 'Stack Trace' | 'Raw';

const LogDetailPanel: React.FC<LogDetailPanelProps> = ({ log }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Overview');

    useEffect(() => {
        if (log?.stackTrace) {
            setActiveTab('Stack Trace');
        } else {
            setActiveTab('Overview');
        }
    }, [log]);

    if (!log) {
        return <div className="hidden lg:block w-1/3 border-l border-border p-8 text-center text-text-secondary">Select a log to see details.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <div className="space-y-4">
                    <InfoItem label="Timestamp" value={new Date(log.timestamp).toISOString()} />
                    <InfoItem label="Level" value={log.level} />
                    <InfoItem label="Module" value={log.module} />
                    {log.correlationId && (
                        <div>
                            <InfoItem label="Correlation ID" value={log.correlationId} />
                            <button
                                onClick={() => alert(`Finding task/agent with ID: ${log.correlationId}`)}
                                className="text-sm font-semibold bg-secondary hover:bg-background py-1.5 px-3 rounded-md w-full text-left mt-2"
                            >
                                View Correlated Task/Agent
                            </button>
                        </div>
                    )}
                    {log.source && <InfoItem label="Source" value={log.source} />}
                </div>;
            case 'Context':
                return <p className="text-sm text-text-secondary">Related logs before/after this event will be shown here.</p>;
            case 'Stack Trace':
                if (!log.stackTrace) return <p className="text-sm text-text-secondary">No stack trace available for this log entry.</p>;
                return <pre className="text-xs bg-black p-3 rounded-md text-red-300 whitespace-pre-wrap">{log.stackTrace}</pre>;
            case 'Raw':
                return <pre className="text-xs bg-black p-3 rounded-md whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>;
            default: return null;
        }
    };

    return (
        <div className="hidden lg:block w-1/3 border-l border-border flex flex-col">
            <div className="p-4 flex-shrink-0">
                <h3 className="text-lg font-bold">Log Details</h3>
                <div className="mt-4 border-b border-border">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton name="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Context" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Stack Trace" activeTab={activeTab} setActiveTab={setActiveTab} disabled={!log.stackTrace} />
                        <TabButton name="Raw" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="p-3 bg-secondary rounded-lg border border-border">
                    <p className="text-sm font-semibold">Message</p>
                    <p className="text-sm mt-1 text-text-secondary whitespace-pre-wrap">{log.message}</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void, disabled?: boolean }> = ({ name, activeTab, setActiveTab, disabled }) => (
    <button 
        onClick={() => !disabled && setActiveTab(name)}
        disabled={disabled}
        className={`py-2 px-1 border-b-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

const InfoItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{label}</p>
        <p className="text-sm mt-1 text-text-primary font-mono">{value}</p>
    </div>
);

export default LogDetailPanel;