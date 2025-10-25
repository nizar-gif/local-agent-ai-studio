import React from 'react';
import { XCircleIcon, PaperAirplaneIcon } from '../shared/Icons';

interface AiHelpSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AiHelpSidebar: React.FC<AiHelpSidebarProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-0 right-0 h-full w-96 bg-card border-l border-border shadow-2xl z-40 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
            <header className="flex-shrink-0 p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold">Contextual Help</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                    <XCircleIcon className="h-6 w-6 text-text-secondary" />
                </button>
            </header>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Chat messages would go here */}
                <div className="p-3 bg-secondary rounded-lg text-sm">
                    <p className="font-bold text-primary">AI Assistant</p>
                    <p>Hello! Ask me anything about the documentation. For example: "How do I configure a new agent?"</p>
                </div>
            </div>

            <footer className="flex-shrink-0 p-3 border-t border-border">
                <div className="flex items-center bg-secondary rounded-lg">
                    <input
                        type="text"
                        placeholder="Ask AI..."
                        className="flex-1 bg-transparent p-3 focus:outline-none text-sm"
                    />
                    <button className="p-3 text-primary hover:text-primary-hover">
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AiHelpSidebar;
