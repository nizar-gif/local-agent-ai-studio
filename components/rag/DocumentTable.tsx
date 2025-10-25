import React from 'react';
import { Document } from '../../types';
import { DocumentTextIcon, ArrowPathIcon, DocumentMagnifyingGlassIcon, TrashIcon, FolderOpenIcon } from '../shared/Icons';

interface DocumentTableProps {
    documents: Document[];
    selectedDocument: Document | null;
    onSelectDocument: (doc: Document) => void;
    sortConfig: { key: keyof Document; direction: 'ascending' | 'descending' };
    onSort: (key: keyof Document) => void;
    filters: { type: string; source: string; status: string };
    onFilterChange: React.Dispatch<React.SetStateAction<{ type: string; source: string; status: string }>>;
    selection: string[];
    onSelectionChange: (selection: string[]) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDelete: (docId: string) => void;
    onReEmbed: (docName: string) => void;
    onPreviewChunks: (docId: string) => void;
}

const getStatusClasses = (status: Document['status']) => {
    switch (status) {
        case 'Embedded': return { bg: 'bg-green-500/10', text: 'text-green-400', pill: 'bg-green-500' };
        case 'Pending': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', pill: 'bg-yellow-500' };
        case 'Failed': return { bg: 'bg-red-500/10', text: 'text-red-400', pill: 'bg-red-500' };
        default: return { bg: '', text: 'text-text-secondary', pill: 'bg-gray-500' };
    }
};

const SortableHeader: React.FC<{
    label: string;
    sortKey: keyof Document;
    sortConfig: DocumentTableProps['sortConfig'];
    onSort: DocumentTableProps['onSort'];
}> = ({ label, sortKey, sortConfig, onSort }) => {
    const isSorted = sortConfig.key === sortKey;
    const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';
    return (
        <th className="p-3 cursor-pointer" onClick={() => onSort(sortKey)}>
            {label} <span className="text-xs">{directionIcon}</span>
        </th>
    );
};

const DocumentTable: React.FC<DocumentTableProps> = (props) => {
    const { documents, selectedDocument, onSelectDocument, sortConfig, onSort, filters, onFilterChange, selection, onSelectionChange, currentPage, totalPages, onPageChange, onDelete, onReEmbed, onPreviewChunks } = props;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(e.target.checked ? documents.map(d => d.id) : []);
    };
    
    const handleSelectSingle = (id: string) => {
        onSelectionChange(selection.includes(id) ? selection.filter(i => i !== id) : [...selection, id]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-secondary z-10">
                        <tr className="border-b border-border">
                            <th className="p-3 w-10"><input type="checkbox" onChange={handleSelectAll} checked={documents.length > 0 && selection.length === documents.length} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></th>
                            <SortableHeader label="Name" sortKey="name" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Type" sortKey="type" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Source" sortKey="source" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Chunks" sortKey="chunks" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Size" sortKey="size" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Date Added" sortKey="dateAdded" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Last Updated" sortKey="lastUpdated" sortConfig={sortConfig} onSort={onSort} />
                            <th className="p-3">Actions</th>
                        </tr>
                        {/* Filter Row */}
                        <tr className="border-b border-border bg-background">
                             <th></th>
                             <th></th>
                             <th><FilterSelect options={['all', 'pdf', 'txt', 'md', 'docx']} value={filters.type} onChange={v => onFilterChange(f => ({...f, type: v}))} /></th>
                             <th><FilterSelect options={['all', 'local', 'uploaded', 'email']} value={filters.source} onChange={v => onFilterChange(f => ({...f, source: v}))} /></th>
                             <th><FilterSelect options={['all', 'Embedded', 'Pending', 'Failed']} value={filters.status} onChange={v => onFilterChange(f => ({...f, status: v}))} /></th>
                             <th colSpan={5}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => {
                            const statusClasses = getStatusClasses(doc.status);
                            const isSelected = selectedDocument?.id === doc.id;
                            return (
                                <tr
                                    key={doc.id}
                                    onClick={() => onSelectDocument(doc)}
                                    className={`border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : `hover:${statusClasses.bg}`}`}
                                >
                                    <td className="p-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selection.includes(doc.id)} onChange={() => handleSelectSingle(doc.id)} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/></td>
                                    <td className="p-3 font-bold truncate max-w-xs">{doc.name}</td>
                                    <td className="p-3 uppercase font-mono text-xs">{doc.type}</td>
                                    <td className="p-3 capitalize">{doc.source}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${statusClasses.pill}`}></span>
                                            <span className={`font-semibold ${statusClasses.text}`}>{doc.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-xs">{doc.chunks.length}</td>
                                    <td className="p-3 text-xs">{doc.size} KB</td>
                                    <td className="p-3 text-xs">{doc.dateAdded}</td>
                                    <td className="p-3 text-xs">{doc.lastUpdated}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            <ActionButton icon={ArrowPathIcon} onClick={() => onReEmbed(doc.name)} />
                                            <ActionButton icon={DocumentMagnifyingGlassIcon} onClick={() => onPreviewChunks(doc.id)} />
                                            <ActionButton icon={FolderOpenIcon} onClick={() => alert(`Opening file location for ${doc.name}`)} />
                                            <ActionButton icon={TrashIcon} onClick={() => onDelete(doc.id)} danger />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
             <div className="flex-shrink-0 p-2 border-t border-border flex justify-between items-center text-sm">
                <div>{selection.length} selected</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 disabled:opacity-50">&lt;</button>
                    <span>Page {currentPage} of {totalPages}</span>
                     <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50">&gt;</button>
                </div>
            </div>
        </div>
    );
};

const FilterSelect: React.FC<{options: string[], value: string, onChange: (value: string) => void}> = ({options, value, onChange}) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border-border rounded-md text-xs p-1 focus:ring-primary focus:border-primary">
        {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
    </select>
);


const ActionButton: React.FC<{ icon: React.FC<{ className: string }>, onClick: React.MouseEventHandler, danger?: boolean }> = ({ icon: Icon, onClick, danger }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={`p-1.5 rounded-md ${danger ? 'text-red-400 hover:bg-red-500/20' : 'text-text-secondary hover:bg-secondary'}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);

export default DocumentTable;