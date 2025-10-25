import React from 'react';
import { FolderPlusIcon, SparklesIcon, ArrowPathIcon, TrashIcon, Cog6ToothIcon, ViewColumnsIcon, Squares2X2Icon } from '../shared/Icons';

interface FilesHeaderProps {
    currentPath: string;
    viewMode: 'List' | 'Grid';
    onViewModeChange: (mode: 'List' | 'Grid') => void;
    onUpload: () => void;
    onVectorize: () => void;
    onDelete: () => void;
    selectionCount: number;
}

const FilesHeader: React.FC<FilesHeaderProps> = ({ currentPath, viewMode, onViewModeChange, onUpload, onVectorize, onDelete, selectionCount }) => {
    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">File Manager</h2>
                <div className="flex items-center gap-4 text-sm mt-1 text-text-secondary flex-wrap">
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded-md">/Users/user/LocalAIAgent{currentPath}</span>
                    <span>2.4 GB used / 10 GB available</span>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={onUpload} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
                    <FolderPlusIcon className="h-5 w-5" />
                    Upload
                </button>
                <ActionButton icon={SparklesIcon} text="Vectorize" onClick={onVectorize} disabled={selectionCount === 0} />
                <ActionButton icon={TrashIcon} text="Delete" onClick={onDelete} disabled={selectionCount === 0} />
                <div className="h-8 border-l border-border mx-1"></div>
                <div className="bg-card p-1 rounded-lg flex items-center">
                    <button onClick={() => onViewModeChange('List')} className={`p-1.5 rounded-md ${viewMode === 'List' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary'}`} title="List View"><ViewColumnsIcon className="h-5 w-5"/></button>
                    <button onClick={() => onViewModeChange('Grid')} className={`p-1.5 rounded-md ${viewMode === 'Grid' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary'}`} title="Grid View"><Squares2X2Icon className="h-5 w-5"/></button>
                </div>
                <ActionButton icon={ArrowPathIcon} text="" onClick={() => alert("Syncing folder...")} title="Sync Folder" />
                <ActionButton icon={Cog6ToothIcon} text="" onClick={() => alert("Manage locations...")} title="Manage Locations" />
            </div>
        </header>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; title?: string; disabled?: boolean }> = ({ icon: Icon, text, onClick, title, disabled }) => (
    <button onClick={onClick} title={title} disabled={disabled} className="flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-background bg-card border border-border text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed">
        <Icon className="h-5 w-5" />
        {text && <span>{text}</span>}
    </button>
);

export default FilesHeader;