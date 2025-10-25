import React from 'react';
import { FileItem, Page } from '../../types';
import { XCircleIcon, SparklesIcon, ChatBubbleLeftRightIcon, BeakerIcon } from '../shared/Icons';

interface FilePreviewModalProps {
    file: FileItem;
    onClose: () => void;
    setActivePage: (page: Page) => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose, setActivePage }) => {
    
    const renderPreview = () => {
        switch(file.type) {
            case 'png':
            case 'jpg':
                return <div className="bg-black flex items-center justify-center h-full"><p className="text-white">Image Preview for {file.name}</p></div>;
            case 'csv':
                return <div className="p-4"><p>Table preview for {file.name}</p></div>;
            case 'py':
            case 'js':
            case 'json':
            case 'md':
                return <pre className="p-4 bg-black text-white text-sm overflow-auto h-full rounded-b-lg"><code>{file.content || 'No content to display.'}</code></pre>;
            case 'pdf':
            case 'docx':
            case 'txt':
            default:
                return <div className="p-4 text-sm whitespace-pre-wrap overflow-auto h-full">{file.content || 'No preview available for this file type.'}</div>
        }
    };

    const handleAsk = () => {
        // Here you might also pass the file context to the chat state
        setActivePage(Page.Chat);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
            <div className="bg-card border border-border rounded-lg w-full max-w-4xl flex flex-col h-full">
                <header className="p-3 border-b border-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold">{file.name}</h2>
                        <p className="text-xs text-text-secondary font-mono">{file.path} - {file.mimeType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ActionButton icon={SparklesIcon} text="Summarize" onClick={() => alert('Summarizing...')} />
                        <ActionButton icon={ChatBubbleLeftRightIcon} text="Ask" onClick={handleAsk} />
                        <ActionButton icon={BeakerIcon} text="Extract Entities" onClick={() => alert('Extracting...')} />
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary ml-4">
                            <XCircleIcon className="h-6 w-6 text-text-secondary" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 bg-background">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{icon: React.FC<{className: string}>, text: string, onClick: () => void}> = ({ icon: Icon, text, onClick }) => (
     <button onClick={onClick} className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover px-3 py-1.5 rounded-md font-semibold bg-primary/10 hover:bg-primary/20">
        <Icon className="h-5 w-5" /> {text}
    </button>
);

export default FilePreviewModal;
