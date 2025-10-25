import React from 'react';
import { WrenchScrewdriverIcon, DocumentTextIcon, ArchiveBoxXMarkIcon, Cog6ToothIcon } from '../shared/Icons';

interface DiagnosticsHeaderProps {
    onRunAll: () => void;
    onSelectTests: () => void;
    isTesting: boolean;
    status: 'healthy' | 'warnings' | 'critical' | 'pending';
    lastRun: Date | null;
    selectedCount: number;
    totalCount: number;
}

const DiagnosticsHeader: React.FC<DiagnosticsHeaderProps> = ({ onRunAll, onSelectTests, isTesting, status, lastRun, selectedCount, totalCount }) => {
    const statusConfig = {
        healthy: { text: 'System Healthy', color: 'bg-green-500/20 text-green-300', icon: '🟢' },
        warnings: { text: 'Warnings Detected', color: 'bg-yellow-500/20 text-yellow-300', icon: '🟡' },
        critical: { text: 'Critical Issues Found', color: 'bg-red-500/20 text-red-300', icon: '🔴' },
        pending: { text: 'Ready to run diagnostics', color: 'bg-gray-500/20 text-gray-300', icon: '⚪️' },
    };

    const currentStatus = statusConfig[status];

    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border border-border rounded-lg gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">System Diagnostics</h2>
                <div className="flex items-center gap-4 text-sm mt-1 text-text-secondary flex-wrap">
                    <div className={`px-2 py-0.5 text-xs font-bold rounded-md ${currentStatus.color}`}>
                        {currentStatus.icon} {currentStatus.text}
                    </div>
                    {lastRun && <span>Last run: {lastRun.toLocaleString()}</span>}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <ActionButton icon={Cog6ToothIcon} text="Select Tests" onClick={onSelectTests} />
                <button
                    onClick={onRunAll}
                    disabled={isTesting}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                    {isTesting ? 'Running...' : `Run Diagnostics (${selectedCount}/${totalCount})`}
                </button>
                <ActionButton icon={DocumentTextIcon} text="Generate Report" onClick={() => {}} />
                <ActionButton icon={ArchiveBoxXMarkIcon} text="Support Bundle" onClick={() => {}} />
            </div>
        </header>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; }> = ({ icon: Icon, text, onClick }) => (
    <button 
        onClick={onClick} 
        className="flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors bg-card border border-border text-text-secondary hover:bg-background hover:text-text-primary"
    >
        <Icon className="h-5 w-5" />
        {text && <span>{text}</span>}
    </button>
);


export default DiagnosticsHeader;