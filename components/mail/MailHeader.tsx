

import React from 'react';
import { EmailAccount, Page, Job } from '../../types';
import { ChevronDownIcon, MagnifyingGlassIcon, ArrowPathIcon, SparklesIcon, Cog6ToothIcon, ArchiveBoxXMarkIcon, TrashIcon, EnvelopeIcon } from '../shared/Icons';
import { useJobs } from '../../App';
import { syncEmails } from '../../services/api';

interface MailHeaderProps {
    accounts: EmailAccount[];
    unreadCount: number;
    setActivePage: (page: Page) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selection: string[];
    onMarkUnread: () => void;
    onDelete: () => void;
}

const MailHeader: React.FC<MailHeaderProps> = ({ accounts, unreadCount, setActivePage, searchTerm, setSearchTerm, selection, onMarkUnread, onDelete }) => {
    const { addJob } = useJobs();
    
    const handleSync = () => {
        addJob({
            name: 'Mail Sync',
            message: 'Starting manual mail sync...',
            trigger: syncEmails,
        });
    };

    const handleSummarize = () => {
         addJob({
            name: 'Summarize Folder',
            message: 'Queueing folder summarization task...',
        });
    };
    
    if (selection.length > 0) {
        return (
            <header className="flex-shrink-0 p-3 border-b border-border flex justify-between items-center bg-secondary">
                <span className="font-semibold text-sm">{selection.length} selected</span>
                <div className="flex items-center gap-2">
                    <ActionButton icon={ArchiveBoxXMarkIcon} text="Archive" onClick={() => {}} />
                    <ActionButton icon={TrashIcon} text="Delete" onClick={onDelete} />
                    <ActionButton icon={EnvelopeIcon} text="Mark Unread" onClick={onMarkUnread} />
                </div>
            </header>
        );
    }
    
    return (
        <header className="flex-shrink-0 p-3 border-b border-border flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <select className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary">
                    {accounts.map(acc => <option key={acc.id}>{acc.label}</option>)}
                </select>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>Inbox <span className="font-bold text-white bg-primary rounded-full px-2 py-0.5 text-xs">{unreadCount}</span></span>
                </div>
            </div>
            
            <div className="flex-1 flex justify-center min-w-[300px]">
                 <div className="relative w-full max-w-lg">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Search by sender, subject, or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:ring-primary focus:border-primary transition"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handleSync} className="p-2 rounded-md hover:bg-secondary" title="Sync Now">
                    <ArrowPathIcon className="h-5 w-5 text-text-secondary" />
                </button>
                <button onClick={handleSummarize} className="p-2 rounded-md hover:bg-secondary" title="Summarize Folder">
                    <SparklesIcon className="h-5 w-5 text-text-secondary" />
                </button>
                <button onClick={() => setActivePage(Page.Settings)} className="p-2 rounded-md hover:bg-secondary" title="Manage Accounts">
                    <Cog6ToothIcon className="h-5 w-5 text-text-secondary" />
                </button>
            </div>
        </header>
    );
};

const ActionButton: React.FC<{icon: React.FC<{className: string}>, text: string, onClick: () => void}> = ({ icon: Icon, text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-1.5 text-xs p-1.5 rounded-md hover:bg-background">
        <Icon className="h-4 w-4 text-text-secondary" />
        <span>{text}</span>
    </button>
);


export default MailHeader;