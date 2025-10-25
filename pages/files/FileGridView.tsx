import React from 'react';
import { FileItem } from '../../types';
import { DocumentTextIcon, PhotoIcon, TableCellsIcon, CodeBracketSquareIcon, SparklesIcon } from '../../components/shared/Icons';

interface FileGridViewProps {
    files: FileItem[];
    selectedFiles: string[];
    onSelectionChange: (selection: string[]) => void;
    onPreview: (file: FileItem) => void;
    loading: boolean;
}

const FileTypeIcon: React.FC<{ type: FileItem['type'], className?: string }> = ({ type, className }) => {
    const iconMap = {
        pdf: DocumentTextIcon,
        docx: DocumentTextIcon,
        txt: DocumentTextIcon,
        md: DocumentTextIcon,
        csv: TableCellsIcon,
        png: PhotoIcon,
        jpg: PhotoIcon,
        py: CodeBracketSquareIcon,
        js: CodeBracketSquareIcon,
        json: CodeBracketSquareIcon,
        unknown: DocumentTextIcon,
    };
    const Icon = iconMap[type] || DocumentTextIcon;
    return <Icon className={className} />;
};

const FileGridView: React.FC<FileGridViewProps> = ({ files, selectedFiles, onSelectionChange, onPreview, loading }) => {
    const handleSelectOne = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectionChange(selectedFiles.includes(id) ? selectedFiles.filter(i => i !== id) : [...selectedFiles, id]);
    };

    if (loading) return <div className="flex-1 flex items-center justify-center text-text-secondary">Loading files...</div>;
    
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {files.map(file => {
                    const isSelected = selectedFiles.includes(file.id);
                    return (
                        <div
                            key={file.id}
                            onClick={() => onPreview(file)}
                            className={`relative group bg-secondary rounded-lg border-2 p-4 flex flex-col items-center justify-center text-center cursor-pointer aspect-square
                                ${isSelected ? 'border-primary' : 'border-transparent hover:border-border'}
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleSelectOne(file.id, e as any)}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-2 left-2 h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary z-10"
                            />
                            <div className="flex flex-col items-center justify-center">
                                <FileTypeIcon type={file.type} className="h-16 w-16 text-text-secondary mb-2" />
                                <p className="text-sm font-semibold truncate w-full">{file.name}</p>
                                <p className="text-xs text-text-secondary">{file.size} KB</p>
                            </div>
                            {file.vectorized === 'Yes' && (
                                <SparklesIcon className="absolute top-2 right-2 h-4 w-4 text-green-400">
                                    <title>Vectorized</title>
                                </SparklesIcon>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileGridView;