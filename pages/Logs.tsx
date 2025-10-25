
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchLogs } from '../services/api';
import { LogEntry } from '../types';
import LogsHeader from '../components/logs/LogsHeader';
import LogViewer from '../components/logs/LogViewer';
import LogDetailPanel from '../components/logs/LogDetailPanel';
import ReportsView from '../components/logs/ReportsView';
import { useNotifier, Spinner } from '../App';
import { v4 as uuidv4 } from 'uuid';

const Logs: React.FC = () => {
    const { addNotification } = useNotifier();
    const [view, setView] = useState<'Logs' | 'Reports'>('Logs');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [isLive, setIsLive] = useState(true);
    const [filters, setFilters] = useState({
        level: 'ALL',
        search: '',
    });

    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchLogs();
            setLogs(data);
            if (!selectedLog && data.length > 0) {
                setSelectedLog(data[0]);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load logs.', 'error');
        } finally {
            setLoading(false);
        }
    }, [selectedLog, addNotification]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    useEffect(() => {
        if (isLive) {
            const interval = setInterval(() => {
                const newLog: LogEntry = {
                    id: uuidv4(),
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    module: 'frontend_live',
                    message: 'Live tail heartbeat.',
                };
                setLogs(prev => [newLog, ...prev].slice(0, 100));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isLive]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const levelMatch = filters.level === 'ALL' || log.level === filters.level;
            const searchMatch = filters.search === '' || 
                log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
                log.module.toLowerCase().includes(filters.search.toLowerCase()) ||
                (log.correlationId && log.correlationId.toLowerCase().includes(filters.search.toLowerCase()));
            return levelMatch && searchMatch;
        });
    }, [logs, filters]);

    const handleClearLogs = () => {
        if (window.confirm("Are you sure you want to clear all log entries? This action cannot be undone.")) {
            setLogs([]);
            setSelectedLog(null);
        }
    };
    
    return (
        <div className="flex flex-col h-full -m-6 bg-background">
            <LogsHeader
                view={view}
                onViewChange={setView}
                isLive={isLive}
                onLiveChange={setIsLive}
                filters={filters}
                onFilterChange={setFilters}
                onRefresh={loadLogs}
                onClearLogs={handleClearLogs}
            />
            {loading ? <Spinner /> : view === 'Logs' ? (
                <div className="flex-1 flex min-h-0">
                    <LogViewer 
                        logs={filteredLogs}
                        selectedLog={selectedLog}
                        onSelectLog={setSelectedLog}
                        isLive={isLive}
                    />
                    <LogDetailPanel 
                        log={selectedLog}
                    />
                </div>
            ) : (
                <ReportsView />
            )}
        </div>
    );
};

export default Logs;
