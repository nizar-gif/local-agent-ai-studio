import React from 'react';
import { MagnifyingGlassIcon, ArrowPathIcon, DocumentTextIcon, TrashIcon } from '../shared/Icons';

interface LogsHeaderProps {
    view: 'Logs' | 'Reports';
    onViewChange: (view: 'Logs' | 'Reports') => void;
    isLive: boolean;
    onLiveChange: (isLive: boolean) => void;
    filters: { level: string; search: string };
    onFilterChange: React.Dispatch<React.SetStateAction<{ level: string; search: string }>>;
    onRefresh: () => void;
    onClearLogs: () => void;
}

const LogsHeader: React.FC<LogsHeaderProps> = ({ view, onViewChange, isLive, onLiveChange, filters, onFilterChange, onRefresh, onClearLogs }) => {
    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-card p-1 rounded-lg flex items-center">
                    <button onClick={() => onViewChange('Logs')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'Logs' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary'}`}>Logs</button>
                    <button onClick={() => onViewChange('Reports')} className={`px-3 py-1 text-sm font-semibold rounded-md ${view === 'Reports' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary'}`}>Reports</button>
                </div>
                <button onClick={() => onLiveChange(!isLive)} className="flex items-center gap-2 text-sm font-bold">
                    <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    {isLive ? 'Live Tail' : 'Paused'}
                </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={filters.search}
                        onChange={e => onFilterChange(f => ({ ...f, search: e.target.value }))}
                        className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 text-sm focus:ring-primary focus:border-primary transition"
                    />
                </div>
                <select 
                    value={filters.level} 
                    onChange={e => onFilterChange(f => ({...f, level: e.target.value}))} 
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                >
                    <option value="ALL">All Levels</option>
                    <option value="DEBUG">Debug</option>
                    <option value="INFO">Info</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                    <option value="CRITICAL">Critical</option>
                </select>
                <input
                    type="text"
                    placeholder="Date range..."
                    className="bg-background border border-border rounded-lg px-4 py-2 w-48 text-sm focus:ring-primary focus:border-primary transition"
                />
                 <ActionButton icon={ArrowPathIcon} onClick={onRefresh} title="Refresh Logs" />
                 <ActionButton icon={DocumentTextIcon} onClick={() => alert('Exporting logs...')} title="Export Logs" />
                 <ActionButton icon={TrashIcon} onClick={onClearLogs} title="Clear Logs" />
            </div>
        </header>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; onClick: () => void; title: string }> = ({ icon: Icon, onClick, title }) => (
    <button onClick={onClick} title={title} className="p-2 rounded-lg hover:bg-background text-text-secondary">
        <Icon className="h-5 w-5" />
    </button>
);


export default LogsHeader;