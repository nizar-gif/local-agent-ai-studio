import React from 'react';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowPathIcon, ChatBubbleLeftRightIcon } from '../shared/Icons';

interface HelpHeaderProps {
    onSearch: (term: string) => void;
    onAskAi: () => void;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({ onSearch, onAskAi }) => {
    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">Help & Documentation</h2>
                <p className="text-sm text-text-secondary">Your guide to the AI Agent Platform.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-72 text-sm focus:ring-primary focus:border-primary transition"
                    />
                </div>
                <ActionButton icon={ChatBubbleLeftRightIcon} text="Ask AI" onClick={onAskAi} primary />
                <ActionButton icon={ArrowDownTrayIcon} text="Download" onClick={() => alert("Downloading docs...")} />
                <ActionButton icon={ArrowPathIcon} text="Update" onClick={() => alert("Checking for updates...")} />
            </div>
        </header>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; primary?: boolean }> = ({ icon: Icon, text, onClick, primary = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors
            ${primary 
                ? 'bg-primary hover:bg-primary-hover text-white' 
                : 'bg-card border border-border text-text-secondary hover:bg-background hover:text-text-primary'}
        `}>
        <Icon className="h-5 w-5" />
        {text && <span>{text}</span>}
    </button>
);


export default HelpHeader;
