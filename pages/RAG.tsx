

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchDocuments, fetchKnowledgeBaseStats } from '../services/api';
import { Document, KnowledgeBaseStats, Job, Page } from '../types';
import RAGHeader from '../components/rag/RAGHeader';
import DocumentTable from '../components/rag/DocumentTable';
import DocumentDetailPanel from '../components/rag/DocumentDetailPanel';
import UploadModal from '../components/rag/UploadModal';
import QueryTesterModal from '../components/rag/QueryTesterModal';
import { useJobs, useNotifier, Spinner } from '../App';

type SortConfig = {
    key: keyof Document;
    direction: 'ascending' | 'descending';
};
type ActiveTab = 'Overview' | 'Chunks' | 'Metadata' | 'Relationships' | 'Queries';

interface RAGProps {
    setActivePage: (page: Page) => void;
}

const RAG: React.FC<RAGProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isQueryModalOpen, setQueryModalOpen] = useState(false);
    const [detailTab, setDetailTab] = useState<ActiveTab>('Overview');

    // New states for full functionality
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'dateAdded', direction: 'descending' });
    const [filters, setFilters] = useState<{ type: string; source: string; status: string }>({ type: 'all', source: 'all', status: 'all' });
    const [selection, setSelection] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const docsPerPage = 10;

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [docsData, statsData] = await Promise.all([fetchDocuments(), fetchKnowledgeBaseStats()]);
            setDocuments(docsData);
            setStats(statsData);
            if (docsData.length > 0) {
                const sorted = [...docsData].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
                setSelectedDoc(sorted[0]);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load RAG data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setDetailTab('Overview');
    }, [selectedDoc]);
    
    const filteredAndSortedDocuments = useMemo(() => {
        let sortedDocuments = [...documents];

        // Filtering logic
        sortedDocuments = sortedDocuments.filter(doc => {
            const typeMatch = filters.type === 'all' || doc.type === filters.type;
            const sourceMatch = filters.source === 'all' || doc.source === filters.source;
            const statusMatch = filters.status === 'all' || doc.status === filters.status;
            return typeMatch && sourceMatch && statusMatch;
        });

        // Sorting logic
        sortedDocuments.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortedDocuments;
    }, [documents, sortConfig, filters]);
    
    const paginatedDocuments = useMemo(() => {
        const startIndex = (currentPage - 1) * docsPerPage;
        return filteredAndSortedDocuments.slice(startIndex, startIndex + docsPerPage);
    }, [filteredAndSortedDocuments, currentPage]);

    const handleSort = (key: keyof Document) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const handleDeleteDocument = (docId: string) => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        if (selectedDoc?.id === docId) {
            setSelectedDoc(documents.length > 1 ? documents.filter(d => d.id !== docId)[0] : null);
        }
    };

    const handleReEmbed = (docName: string) => {
        addJob({
            name: `Re-embed: ${docName}`,
            message: 'Queueing re-embedding task...',
        });
    };

    if (loading || !stats) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col h-full -m-6">
            {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
            {isQueryModalOpen && <QueryTesterModal onClose={() => setQueryModalOpen(false)} />}

            <RAGHeader 
                stats={stats} 
                onUpload={() => setUploadModalOpen(true)} 
                onTestQuery={() => setQueryModalOpen(true)} 
                setActivePage={setActivePage}
            />
            
            <div className="flex-1 flex min-h-0">
                <div className="w-full lg:w-3/5 border-r border-border flex flex-col">
                    <DocumentTable 
                        documents={paginatedDocuments}
                        selectedDocument={selectedDoc}
                        onSelectDocument={setSelectedDoc}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        filters={filters}
                        onFilterChange={setFilters}
                        selection={selection}
                        onSelectionChange={setSelection}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredAndSortedDocuments.length / docsPerPage)}
                        onPageChange={setCurrentPage}
                        onDelete={handleDeleteDocument}
                        onReEmbed={handleReEmbed}
                        onPreviewChunks={() => setDetailTab('Chunks')}
                    />
                </div>
                
                <div className="hidden lg:block lg:w-2/5 overflow-y-auto">
                   {selectedDoc ? (
                        <DocumentDetailPanel 
                            document={selectedDoc}
                            activeTab={detailTab}
                            setActiveTab={setDetailTab}
                            onDelete={handleDeleteDocument}
                            onReEmbed={handleReEmbed}
                            setActivePage={setActivePage}
                        />
                    ) : (
                        <div className="p-8 text-center text-text-secondary">Select a document to see details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RAG;