import React, { useState, useMemo } from 'react';
import { DiagnosticResult } from '../../types';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, ChevronDownIcon } from '../shared/Icons';

interface DiagnosticsResultModalProps {
    results: DiagnosticResult[];
    onClose: () => void;
}

const ResultIcon: React.FC<{ status: DiagnosticResult['status'] }> = ({ status }) => {
    switch (status) {
        case 'success':
            return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'warning':
            return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
        case 'error':
            return <XCircleIcon className="h-5 w-5 text-red-400" />;
        default:
            return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
};

const CategorySection: React.FC<{ title: string; results: DiagnosticResult[] }> = ({ title, results }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasIssues = results.some(r => r.status === 'error' || r.status === 'warning');

    if (results.length === 0) return null;

    return (
        <div className="border border-border rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex justify-between items-center p-3 text-left font-bold ${hasIssues ? 'bg-yellow-500/10' : 'bg-secondary'}`}>
                <span>{title} ({results.length} tests)</span>
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-3 space-y-2">
                    {results.map(result => (
                        <div key={result.id} className="flex items-start gap-3 p-2 bg-background rounded-md">
                            <ResultIcon status={result.status} />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{result.name}</p>
                                <p className="text-xs text-text-secondary font-mono">{result.details}</p>
                            </div>
                            <span className="text-xs text-text-secondary">{result.durationMs}ms</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DiagnosticsResultModal: React.FC<DiagnosticsResultModalProps> = ({ results, onClose }) => {
    const resultsByCategory = useMemo(() => {
        return results.reduce((acc, result) => {
            if (!acc[result.category]) {
                acc[result.category] = [];
            }
            acc[result.category].push(result);
            return acc;
        }, {} as Record<DiagnosticResult['category'], DiagnosticResult[]>);
    }, [results]);

    const overallStatus = useMemo(() => {
        if (results.some(r => r.status === 'error')) return 'critical';
        if (results.some(r => r.status === 'warning')) return 'warnings';
        return 'healthy';
    }, [results]);
    
    const statusConfig = {
        healthy: { text: 'System Healthy', color: 'text-green-300' },
        warnings: { text: 'Warnings Detected', color: 'text-yellow-300' },
        critical: { text: 'Critical Issues Found', color: 'text-red-300' },
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
            <div className="bg-card border border-border rounded-lg w-full max-w-3xl flex flex-col max-h-full">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold">Diagnostics Report</h2>
                        <p className={`text-sm font-semibold ${statusConfig[overallStatus].color}`}>{statusConfig[overallStatus].text}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {Object.entries(resultsByCategory).map(([category, categoryResults]) => (
                        <CategorySection key={category} title={category} results={categoryResults} />
                    ))}
                </div>

                <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Generate Support Bundle</button>
                    <button onClick={onClose} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default DiagnosticsResultModal;