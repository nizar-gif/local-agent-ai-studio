import React from 'react';
import { DiagnosticResult } from '../../types';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ClockIcon, PlayIcon } from '../shared/Icons';

interface DiagnosticsCardProps {
    result: DiagnosticResult;
    onRun: () => void;
    isTesting: boolean;
}

const StatusIndicator: React.FC<{ status: DiagnosticResult['status'] }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <ClockIcon className="h-6 w-6 text-blue-400 animate-spin" />;
        case 'success':
            return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
        case 'warning':
            return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />;
        case 'error':
            return <XCircleIcon className="h-6 w-6 text-red-400" />;
        case 'pending':
        default:
            return <div className="h-6 w-6 border-2 border-dashed border-border rounded-full" />;
    }
};

const DiagnosticsCard: React.FC<DiagnosticsCardProps> = ({ result, onRun, isTesting }) => {
    if (!result) return null;

    const statusBorderColor = {
        running: 'border-blue-500/50',
        success: 'border-green-500/50',
        warning: 'border-yellow-500/50',
        error: 'border-red-500/50',
        pending: 'border-border',
    }[result.status];

    return (
        <div className={`bg-card p-4 rounded-lg border ${statusBorderColor} flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-text-primary pr-4">{result.name}</h3>
                    <StatusIndicator status={result.status} />
                </div>
                <p className="text-xs text-text-secondary mt-1">{result.description}</p>
            </div>
            <div className="mt-4">
                <div className="bg-secondary p-2 rounded-md text-xs min-h-[50px]">
                    <p className="font-mono text-text-secondary whitespace-pre-wrap">{result.details}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                     <button
                        onClick={onRun}
                        disabled={isTesting}
                        className="text-xs font-semibold text-primary hover:text-primary-hover disabled:opacity-50 flex items-center gap-1"
                     >
                        <PlayIcon className="h-4 w-4"/>
                        Run Test
                    </button>
                    {result.durationMs && <span className="text-xs text-text-secondary">{result.durationMs}ms</span>}
                </div>
            </div>
        </div>
    );
};

export default DiagnosticsCard;