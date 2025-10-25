import React from 'react';
import { Folder } from '../../types';

interface FolderTreeProps {
    folders: Folder[];
    activeFolder: Folder | null;
    onSelectFolder: (folder: Folder) => void;
    onCompose: () => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ folders, activeFolder, onSelectFolder, onCompose }) => {
    return (
        <aside className="w-64 flex-shrink-0 bg-secondary/30 p-4 border-r border-border">
            <button onClick={onCompose} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg mb-4 text-sm">
                Compose
            </button>
            <nav className="space-y-1">
                {folders.map(folder => (
                    <button 
                        key={folder.id} 
                        onClick={() => onSelectFolder(folder)}
                        className={`w-full text-left flex justify-between items-center p-2 rounded-md text-sm transition-colors ${
                            activeFolder?.id === folder.id 
                            ? 'bg-primary/20 text-primary font-semibold' 
                            : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                        }`}
                    >
                        <span>{folder.name}</span>
                        {folder.unreadCount > 0 && (
                            <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {folder.unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default FolderTree;