
import React from 'react';
import { Connector } from '../../types';
import { LinkIcon } from '../shared/Icons'; // Using a generic icon for now

interface ConnectorCardProps {
    connector: Connector;
}

const ConnectorCard: React.FC<ConnectorCardProps> = ({ connector }) => {
    const statusConfig = {
        'Connected': { color: 'bg-green-500', text: 'Connected' },
        'Not Configured': { color: 'bg-gray-500', text: 'Not Configured' },
        'Error': { color: 'bg-red-500', text: 'Error' },
    };

    const currentStatus = statusConfig[connector.status];

    return (
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {/* In a real app, this would use a dynamic icon based on connector.icon */}
                        <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center">
                            <LinkIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{connector.name}</h3>
                             <div className="flex items-center gap-2 mt-1">
                                <div className={`h-2 w-2 rounded-full ${currentStatus.color}`}></div>
                                <span className="text-xs font-semibold text-text-secondary">{currentStatus.text}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mt-4">{connector.description}</p>
            </div>
            <div className="mt-6 flex justify-end">
                <button className="text-sm font-bold bg-secondary hover:bg-background py-2 px-4 rounded-md transition-colors">
                    Manage
                </button>
            </div>
        </div>
    );
};

export default ConnectorCard;
