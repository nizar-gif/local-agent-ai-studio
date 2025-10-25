import React, { useState, useEffect, useRef } from 'react';
import { DashboardLogEntry } from '../../types';

interface FooterLogBarProps {
    logs: DashboardLogEntry[];
}

const getLogLevelColor = (level: DashboardLogEntry['level']) => {
    switch(level) {
        case 'info': return 'text-blue-400';
        case 'warn': return 'text-yellow-400';
        case 'error': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

const FooterLogBar: React.FC<FooterLogBarProps> = ({ logs }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [displayLogs, setDisplayLogs] = useState<DashboardLogEntry[]>([]);
    const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isPaused) {
            const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);
            setDisplayLogs(filteredLogs);
        }
    }, [logs, isPaused, filter]);

    useEffect(() => {
        if (!isPaused && logContainerRef.current) {
            logContainerRef.current.scrollTop = 0;
        }
    }, [displayLogs, isPaused]);

    const handleClear = () => {
        setDisplayLogs([]);
    }

    return (
        <div className="flex-shrink-0 h-48 bg-secondary/50 border-t border-border flex flex-col">
            <div className="p-2 flex justify-between items-center border-b border-border">
                <h4 className="font-bold text-sm px-2">Live Logs</h4>
                <div className="flex items-center gap-2">
                    <select onChange={(e) => setFilter(e.target.value as any)} value={filter} className="bg-background border border-border text-xs rounded-md px-2 py-1 focus:ring-primary focus:border-primary">
                        <option value="all">All Levels</option>
                        <option value="info">Info</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </select>
                    <button onClick={handleClear} className="text-xs font-semibold px-2 py-1 rounded-md hover:bg-background">Clear</button>
                    <button onClick={() => setIsPaused(!isPaused)} className="text-xs font-semibold px-2 py-1 rounded-md hover:bg-background">
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                </div>
            </div>
            <div ref={logContainerRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1">
                {displayLogs.map(log => (
                     <div key={log.id} className="flex gap-3">
                        <span className="text-gray-500 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`font-bold w-12 flex-shrink-0 ${getLogLevelColor(log.level)}`}>{log.level.toUpperCase()}</span>
                        <p className="whitespace-nowrap truncate">{log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterLogBar;