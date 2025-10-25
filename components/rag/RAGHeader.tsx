

import React from 'react';
import { KnowledgeBaseStats, Job, Page } from '../../types';
import { FolderPlusIcon, ArrowPathIcon, Cog6ToothIcon, BeakerIcon, ArchiveBoxXMarkIcon } from '../shared/Icons';
import { useJobs } from '../../App';
import { rebuildRAGIndex, purgeRAGIndex } from '../../services/api';

interface RAGHeaderProps {
    stats: KnowledgeBaseStats;
    onUpload: () => void;
    onTestQuery: () => void;
    setActivePage: (page: Page) => void;
}

const RAGHeader: React.FC<RAGHeaderProps> = ({ stats, onUpload, onTestQuery, setActivePage }) => {
    const { addJob } = useJobs();

    const handleRebuild = () => {
        if (window.confirm("This will re-process all documents and can be slow. Are you sure?")) {
            addJob({
                name: "Rebuild RAG Index",
                message: "Starting full re-index...",
                trigger: rebuildRAGIndex,
            });
        }
    };

    const handleCleanup = () => {
        if (window.confirm("This will purge obsolete files from the index. Continue?")) {
            addJob({
                name: "Purge RAG Index",
                message: "Purging obsolete entries...",
                trigger: purgeRAGIndex,
            });
        }
    };

    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">RAG Knowledge Base</h2>
                <div className="flex items-center gap-4 text-sm mt-1 text-text-secondary flex-wrap">
                    <span>{stats.docCount} docs / {stats.chunkCount} chunks</span>
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded-md">{stats.embeddingModel} ({stats.dimensionality}d)</span>
                    <span>Index: {stats.indexSize} / Disk: {stats.diskSpace}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={onUpload} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
                    <FolderPlusIcon className="h-5 w-5" />
                    Upload Documents
                </button>
                <button onClick={handleRebuild} className="p-2 rounded-lg hover:bg-background" title="Rebuild Index"><ArrowPathIcon className="h-5 w-5 text-text-secondary"/></button>
                <button onClick={() => setActivePage(Page.Settings)} className="p-2 rounded-lg hover:bg-background" title="RAG Settings"><Cog6ToothIcon className="h-5 w-5 text-text-secondary"/></button>
                <button onClick={onTestQuery} className="p-2 rounded-lg hover:bg-background" title="Test Query"><BeakerIcon className="h-5 w-5 text-text-secondary"/></button>
                <button onClick={handleCleanup} className="p-2 rounded-lg hover:bg-background" title="Cleanup Index"><ArchiveBoxXMarkIcon className="h-5 w-5 text-text-secondary"/></button>
            </div>
        </header>
    );
};

export default RAGHeader;
