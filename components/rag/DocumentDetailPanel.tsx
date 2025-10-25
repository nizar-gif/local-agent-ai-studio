import React, { useState } from 'react';
import { Document, Page } from '../../types';
import { ArrowPathIcon, TrashIcon, FolderOpenIcon } from '../shared/Icons';

type ActiveTab = 'Overview' | 'Chunks' | 'Metadata' | 'Relationships' | 'Queries';

interface DocumentDetailPanelProps {
    document: Document;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    onDelete: (docId: string) => void;
    onReEmbed: (docName: string) => void;
    setActivePage: (page: Page) => void;
}

const DocumentDetailPanel: React.FC<DocumentDetailPanelProps> = ({ document, activeTab, setActiveTab, onDelete, onReEmbed, setActivePage }) => {

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <div className="space-y-4">
                    <InfoItem label="Summary" value={document.chunks.map(c => c.text).join(' ').substring(0, 300) + '...'} />
                    <InfoItem label="Chunk Count" value={document.chunks.length.toString()} />
                    <InfoItem label="Status" value={document.status} />
                </div>;
            case 'Chunks':
                return <div className="space-y-2">
                    {document.chunks.map(chunk => (
                        <div key={chunk.id} className="p-2 bg-secondary rounded-md">
                            <p className="text-xs font-mono text-text-secondary">{chunk.vectorId}</p>
                            <p className="text-sm mt-1">{chunk.text}</p>
                        </div>
                    ))}
                </div>;
            case 'Metadata':
                return <div className="space-y-2">
                    {Object.entries(document.metadata).map(([key, value]) => (
                         <InfoItem key={key} label={key} value={value} />
                    ))}
                </div>;
            case 'Relationships':
                return <div className="text-text-secondary text-sm">Documents with semantic similarity will be listed here.</div>;
            case 'Queries':
                return <div className="text-text-secondary text-sm">History of questions that used this document will be listed here.</div>;
            default: return null;
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold truncate max-w-sm">{document.name}</h3>
                        <p className="text-sm text-text-secondary">{document.type.toUpperCase()} - {(document.size/1024).toFixed(2)} MB - Added {document.dateAdded}</p>
                    </div>
                </div>
                <div className="mt-4 border-b border-border">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton name="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Chunks" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Metadata" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Relationships" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Queries" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </div>
            <div className="flex-1 py-6 overflow-y-auto">
                {renderContent()}
            </div>
            <div className="flex-shrink-0 border-t border-border pt-4 flex gap-2">
                <button onClick={() => setActivePage(Page.Files)} className="flex items-center gap-1 text-sm font-semibold bg-secondary hover:bg-background py-1.5 px-3 rounded-md"><FolderOpenIcon className="h-4 w-4" /> Open in File Viewer</button>
                <button onClick={() => onReEmbed(document.name)} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover"><ArrowPathIcon className="h-4 w-4" /> Re-embed</button>
                <button onClick={() => onDelete(document.id)} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"><TrashIcon className="h-4 w-4" /> Remove from Index</button>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

const InfoItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{label}</p>
        <p className="text-sm mt-1 text-text-primary whitespace-pre-wrap">{value}</p>
    </div>
);

export default DocumentDetailPanel;