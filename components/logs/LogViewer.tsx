import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../../types';

interface LogViewerProps {
    logs: LogEntry[];
    selectedLog: LogEntry | null;
    onSelectLog: (log: LogEntry | null) => void;
    isLive: boolean;
}

const getLevelClasses = (level: LogEntry['level']) => {
    switch (level) {
        case 'DEBUG': return { text: 'text-gray-400', bg: 'hover:bg-gray-500/10', border: 'border-gray-500' };
        case 'INFO': return { text: 'text-blue-400', bg: 'hover:bg-blue-500/10', border: 'border-blue-500' };
        case 'WARNING': return { text: 'text-yellow-400', bg: 'hover:bg-yellow-500/10', border: 'border-yellow-500' };
        case 'ERROR': return { text: 'text-red-400', bg: 'hover:bg-red-500/10', border: 'border-red-500' };
        case 'CRITICAL': return { text: 'text-white', bg: 'bg-red-500/30 hover:bg-red-500/40', border: 'border-red-500' };
        default: return { text: 'text-text-secondary', bg: 'hover:bg-secondary', border: 'border-border' };
    }
};

const LogViewer: React.FC<LogViewerProps> = ({ logs, selectedLog, onSelectLog, isLive }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [userScrolledUp, setUserScrolledUp] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const hasScrolled = el.scrollTop > 100;
            if (hasScrolled !== userScrolledUp) {
                setUserScrolledUp(hasScrolled);
            }
        };
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [userScrolledUp]);

    useEffect(() => {
        if (isLive && !userScrolledUp && scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [logs, isLive, userScrolledUp]);
    
    const handleJumpToLatest = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div ref={scrollRef} className="relative flex-1 w-2/3 overflow-y-auto">
            <table className="w-full text-left text-sm font-mono">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-2 w-40">Timestamp</th>
                        <th className="p-2 w-10">Level</th>
                        <th className="p-2 w-40">Module</th>
                        <th className="p-2">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => {
                        const levelClasses = getLevelClasses(log.level);
                        const isSelected = selectedLog?.id === log.id;
                        return (
                            <tr
                                key={log.id}
                                onClick={() => onSelectLog(log)}
                                className={`border-b border-border cursor-pointer transition-colors ${isSelected ? `bg-primary/10 ${levelClasses.bg}` : levelClasses.bg}`}
                            >
                                <td className="p-2 text-text-secondary">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className={`p-2 font-bold ${levelClasses.text}`}>{log.level}</td>
                                <td className="p-2 text-text-secondary truncate">{log.module}</td>
                                <td className={`p-2 text-text-primary whitespace-nowrap overflow-hidden text-ellipsis ${log.level === 'CRITICAL' ? 'font-bold' : ''}`}>{log.message}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {isLive && userScrolledUp && (
                <button
                    onClick={handleJumpToLatest}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full shadow-lg transition-opacity"
                >
                    Jump to Latest
                </button>
            )}
        </div>
    );
};

export default LogViewer;