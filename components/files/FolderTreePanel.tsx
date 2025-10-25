import React, { useState } from 'react';
import { FolderNode } from '../../types';
import { FolderIcon, ChevronRightIcon } from '../shared/Icons';

interface FolderTreePanelProps {
    folderTree: FolderNode[];
    selectedFolder: FolderNode | null;
    onSelectFolder: (folder: FolderNode) => void;
}

const FolderTreeItem: React.FC<{ node: FolderNode; selectedFolder: FolderNode | null; onSelectFolder: (folder: FolderNode) => void; level: number }> = ({ node, selectedFolder, onSelectFolder, level }) => {
    const [isOpen, setIsOpen] = useState(level < 2);
    const isSelected = selectedFolder?.id === node.id;

    return (
        <div>
            <div
                onClick={() => onSelectFolder(node)}
                className={`flex items-center p-2 rounded-md cursor-pointer ${isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'}`}
                style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
            >
                {node.children.length > 0 && (
                    <ChevronRightIcon
                        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                        className={`h-4 w-4 mr-1 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                    />
                )}
                <FolderIcon className={`h-5 w-5 mr-2 ${node.isIndexed ? 'text-primary' : 'text-text-secondary'}`} />
                <span className="flex-1 truncate text-sm font-semibold">{node.name}</span>
                <span className="text-xs text-text-secondary">{node.fileCount}</span>
            </div>
            {isOpen && node.children.length > 0 && (
                <div className="border-l border-border/50 ml-3">
                    {node.children.map(child => (
                        <FolderTreeItem key={child.id} node={child} selectedFolder={selectedFolder} onSelectFolder={onSelectFolder} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FolderTreePanel: React.FC<FolderTreePanelProps> = ({ folderTree, selectedFolder, onSelectFolder }) => {
    return (
        <aside className="w-72 flex-shrink-0 bg-secondary/30 p-4 border-r border-border flex flex-col">
            <h3 className="text-sm font-bold text-text-secondary uppercase px-2 mb-2">Workspace</h3>
            <div className="flex-1 overflow-y-auto pr-2">
                {folderTree.map(node => (
                    <FolderTreeItem key={node.id} node={node} selectedFolder={selectedFolder} onSelectFolder={onSelectFolder} level={0} />
                ))}
            </div>
        </aside>
    );
};

export default FolderTreePanel;
