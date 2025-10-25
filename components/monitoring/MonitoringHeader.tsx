import React from 'react';
import { ArrowPathIcon, ArrowDownTrayIcon, TrashIcon, Cog6ToothIcon } from '../shared/Icons';
import { Page } from '../../types';

interface MonitoringHeaderProps {
    isHealthy: boolean;
    automationStatus: 'running' | 'paused';
    uptime: string;
    onRefresh: () => void;
    setActivePage: (page: Page) => void;
}

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void }> = ({ icon: Icon, text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-background text-text-secondary hover:text-text-primary">
        <Icon className="h-5 w-5" />
        <span>{text}</span>
    </button>
);


const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({ isHealthy, automationStatus, uptime, onRefresh, setActivePage }) => {
    const statusColor = isHealthy ? 'text-green-300' : 'text-yellow-300';
    const statusPillColor = isHealthy ? 'bg-green-500/20' : 'bg-yellow-500/20';
    
    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-4">
                <div className={`px-3 py-1 text-sm font-bold rounded-md ${statusPillColor}`}>
                    <span className={statusColor}>
                        {isHealthy ? '🟢 All Systems Operational' : '🟠 System Alert'}
                    </span>
                </div>
                 <div className="text-sm font-bold px-2.5 py-1 rounded-md border bg-blue-500/20 text-blue-300 border-blue-500/30">
                    HYBRID / CLOUD
                </div>
                <span className="text-sm text-text-secondary">Uptime: <span className="font-mono text-text-primary">{uptime}</span></span>
                <span className="text-sm text-text-secondary">Scheduler: <span className={`font-mono font-bold ${automationStatus === 'running' ? 'text-green-400' : 'text-yellow-400'}`}>{automationStatus}</span></span>
            </div>
            <div className="flex items-center gap-2">
                <ActionButton icon={ArrowPathIcon} text="Refresh" onClick={onRefresh} />
                <ActionButton icon={ArrowDownTrayIcon} text="Export" onClick={() => alert('Exporting metrics...')} />
                <ActionButton icon={TrashIcon} text="Clear" onClick={() => alert('Clearing cache...')} />
                <ActionButton icon={Cog6ToothIcon} text="Thresholds" onClick={() => setActivePage(Page.Settings)} />
            </div>
        </header>
    );
};

export default MonitoringHeader;