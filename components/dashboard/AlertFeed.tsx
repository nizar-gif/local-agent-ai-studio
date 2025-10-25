import React from 'react';
import { Alert, Page } from '../../types';
import { ExclamationTriangleIcon, XCircleIcon } from '../shared/Icons';

interface AlertFeedProps {
    alerts: Alert[];
    setActivePage: (page: Page) => void;
}

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts, setActivePage }) => {
    return (
        <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold text-text-secondary mb-3">Alerts & Warnings</h3>
            <div className="space-y-2">
                {alerts.length === 0 ? (
                    <p className="text-sm text-text-secondary p-2">No active alerts.</p>
                ) : (
                    alerts.map(alert => (
                        <button
                            key={alert.id}
                            onClick={() => setActivePage(Page.Diagnostics)}
                            title="Go to Diagnostics"
                            className={`w-full flex items-start gap-3 p-2 rounded-md text-left transition-colors ${alert.severity === 'error' ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-yellow-500/10 hover:bg-yellow-500/20'}`}>
                            {alert.severity === 'error' ? 
                                <XCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" /> : 
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            }
                            <p className="text-sm text-text-primary">{alert.message}</p>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertFeed;