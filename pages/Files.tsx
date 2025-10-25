

import React, { useState, useEffect, useCallback } from 'react';
import { fetchFileTree, fetchFiles, vectorizeFiles } from '../services/api';
import { FolderNode, FileItem, Page, Job } from '../types';
import FilesHeader from '../components/files/FilesHeader';
import FolderTreePanel from '../components/files/FolderTreePanel';
import FileListView from '../components/files/FileListView';
import FileGridView from '../components/files/FileGridView';
import UploadModal from '../components/files/UploadModal';
import FilePreviewModal from '../components/files/FilePreviewModal';
import { useJobs, useNotifier, Spinner } from '../App';

interface FilesProps {
    setActivePage: (page: Page) => void;
}

const Files: React.FC<FilesProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [fileTree, setFileTree] = useState<FolderNode[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'List' | 'Grid'>('List');
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [fileToPreview, setFileToPreview] = useState<FileItem | null>(null);

    const loadFiles = useCallback(async (folder: FolderNode) => {
        setLoading(true);
        try {
            const data = await fetchFiles(folder.path);
            setFiles(data);
        } catch (error) {
            addNotification(error instanceof Error ? error.message : `Failed to load files for ${folder.path}.`, 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const data = await fetchFileTree();
                setFileTree(data);
                const rootFolder = data[0];
                if (rootFolder) {
                    setSelectedFolder(rootFolder);
                    await loadFiles(rootFolder);
                }
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load file tree.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [loadFiles, addNotification]);

    const handleSelectFolder = (folder: FolderNode) => {
        setSelectedFolder(folder);
        setSelectedFiles([]);
        loadFiles(folder);
    };

    const handleVectorizeFiles = (fileIds: string[]) => {
        if (fileIds.length === 0) return;
        addJob({
            name: `Vectorize ${fileIds.length} file(s)`,
            message: 'Starting vectorization...',
            trigger: () => vectorizeFiles(fileIds),
        });
    };

    const handleDeleteFiles = (fileIds: string[]) => {
        if (fileIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${fileIds.length} file(s)? This action cannot be undone.`)) {
            setFiles(prev => prev.filter(f => !fileIds.includes(f.id)));
            setSelectedFiles(prev => prev.filter(id => !fileIds.includes(id)));
        }
    };


    return (
        <div className="flex flex-col h-full -m-6">
            {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
            {fileToPreview && <FilePreviewModal file={fileToPreview} onClose={() => setFileToPreview(null)} setActivePage={setActivePage} />}

            <FilesHeader
                currentPath={selectedFolder?.path || '/'}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onUpload={() => setUploadModalOpen(true)}
                onVectorize={() => handleVectorizeFiles(selectedFiles)}
                onDelete={() => handleDeleteFiles(selectedFiles)}
                selectionCount={selectedFiles.length}
            />

            <div className="flex-1 flex min-h-0">
                <FolderTreePanel
                    folderTree={fileTree}
                    selectedFolder={selectedFolder}
                    onSelectFolder={handleSelectFolder}
                />
                <div className="flex-1 flex flex-col min-h-0">
                    {loading ? <Spinner /> : viewMode === 'List' ? (
                        <FileListView
                            files={files}
                            selectedFiles={selectedFiles}
                            onSelectionChange={setSelectedFiles}
                            onPreview={setFileToPreview}
                            onVectorize={(fileId) => handleVectorizeFiles([fileId])}
                            onDelete={(fileId) => handleDeleteFiles([fileId])}
                            loading={loading}
                        />
                    ) : (
                        <FileGridView
                            files={files}
                            selectedFiles={selectedFiles}
                            onSelectionChange={setSelectedFiles}
                            onPreview={setFileToPreview}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Files;