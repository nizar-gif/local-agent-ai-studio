
import React, { useState, useEffect, useCallback } from 'react';
import { Connector, Page, MasterSettings } from '../types';
import { fetchConnectors, fetchMasterSettings } from '../services/api';
import { useNotifier, Spinner } from '../App';
import ConnectorCard from '../components/connectors/ConnectorCard';
import { LinkIcon } from '../components/shared/Icons';

interface ConnectorsProps {
    setActivePage: (page: Page) => void;
}

const Connectors: React.FC<ConnectorsProps> = ({ setActivePage }) => {
    const { addNotification } = useNotifier();
    const [connectors, setConnectors] = useState<Connector[]>([]);
    const [settings, setSettings] = useState<MasterSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [connectorsData, settingsData] = await Promise.all([
                    fetchConnectors(),
                    fetchMasterSettings(),
                ]);
                setConnectors(connectorsData);
                setSettings(settingsData);
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load connectors data.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [addNotification]);
    
    if (loading) {
        return <Spinner />;
    }

    if (!settings?.mcp.enabled) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-card rounded-lg border border-border p-8">
                <LinkIcon className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">MCP Server is Disabled</h2>
                <p className="text-text-secondary mb-4 max-w-lg">
                    The Model Context Protocol (MCP) server is required to manage and use third-party connectors. Please enable it in the settings to proceed.
                </p>
                 <button 
                    onClick={() => setActivePage(Page.Settings)} 
                    className="text-sm font-bold text-primary hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
                >
                    Go to Settings &gt; MCP
                 </button>
            </div>
        );
    }


    return (
        <div className="space-y-8">
             <header>
                <h2 className="text-2xl font-bold text-text-primary">Connectors Hub</h2>
                <p className="text-sm text-text-secondary mt-1">
                    Manage integrations with third-party applications via the Model Context Protocol (MCP).
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectors.map(connector => (
                    <ConnectorCard key={connector.id} connector={connector} />
                ))}
            </div>
        </div>
    );
};

export default Connectors;
