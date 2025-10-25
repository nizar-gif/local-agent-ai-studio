import React from 'react';
import { FileItem } from '../../types';
import { SparklesIcon, EyeIcon, TrashIcon, TagIcon, ArrowDownTrayIcon } from '../shared/Icons';

interface FileListViewProps {
    files: FileItem[];
    selectedFiles: string[];
    onSelectionChange: (selection: string[]) => void;
    onPreview: (file: FileItem) => void;
    onVectorize: (fileId: string) => void;
    onDelete: (fileId: string) => void;
    loading: boolean;
}

const getVectorizedClasses = (status: FileItem['vectorized']) => {
    switch (status) {
        case 'Yes': return 'text-green-400';
        case 'Pending': return 'text-yellow-400';
        case 'No': return 'text-text-secondary';
        default: return 'text-text-secondary';
    }
};

const FileListView: React.FC<FileListViewProps> = ({ files, selectedFiles, onSelectionChange, onPreview, onVectorize, onDelete, loading }) => {
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(e.target.checked ? files.map(f => f.id) : []);
    };
    
    const handleSelectOne = (id: string) => {
        onSelectionChange(selectedFiles.includes(id) ? selectedFiles.filter(i => i !== id) : [...selectedFiles, id]);
    };

    if (loading) return <div className="flex-1 flex items-center justify-center text-text-secondary">Loading files...</div>;

    return (
        <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-secondary z-10">
                    <tr className="border-b border-border">
                        <th className="p-3 w-10"><input type="checkbox" onChange={handleSelectAll} checked={files.length > 0 && selectedFiles.length === files.length} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Modified</th>
                        <th className="p-3">Vectorized</th>
                        <th className="p-3">Tags</th>
                        <th className="p-3">Accessed By</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => (
                        <tr key={file.id} className={`border-b border-border transition-colors ${selectedFiles.includes(file.id) ? 'bg-primary/10' : 'hover:bg-secondary'}`}>
                            <td className="p-3"><input type="checkbox" checked={selectedFiles.includes(file.id)} onChange={() => handleSelectOne(file.id)} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></td>
                            <td className="p-3 font-bold max-w-xs truncate">{file.name}</td>
                            <td className="p-3 uppercase font-mono text-xs">{file.type}</td>
                            <td className="p-3 text-text-secondary">{(file.size).toLocaleString()} KB</td>
                            <td className="p-3 text-text-secondary">{file.modifiedDate}</td>
                            <td className={`p-3 font-semibold ${getVectorizedClasses(file.vectorized)}`}>{file.vectorized}</td>
                            <td className="p-3">{file.tags.map(t => t.label).join(', ')}</td>
                            <td className="p-3 text-text-secondary">{file.lastAccessedBy || 'N/A'}</td>
                            <td className="p-3">
                                <div className="flex items-center gap-1">
                                    <ActionButton icon={EyeIcon} onClick={() => onPreview(file)} />
                                    <ActionButton icon={SparklesIcon} onClick={() => onVectorize(file.id)} />
                                    <ActionButton icon={TagIcon} onClick={() => alert(`Tagging ${file.name}`)} />
                                    <ActionButton icon={ArrowDownTrayIcon} onClick={() => alert(`Downloading ${file.name}`)} />
                                    <ActionButton icon={TrashIcon} onClick={() => onDelete(file.id)} danger />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{ className: string }>, onClick: React.MouseEventHandler, danger?: boolean }> = ({ icon: Icon, onClick, danger }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={`p-1.5 rounded-md ${danger ? 'text-red-400 hover:bg-red-500/20' : 'text-text-secondary hover:bg-secondary'}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);

export default FileListView;