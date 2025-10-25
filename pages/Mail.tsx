
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchEmails, fetchFolders, fetchMasterSettings } from '../services/api';
import { Email, Folder, MasterSettings, Page, Job } from '../types';
import MailHeader from '../components/mail/MailHeader';
import FolderTree from '../components/mail/FolderTree';
import EmailTable from '../components/mail/EmailTable';
import EmailDetail from '../components/mail/EmailDetail';
import AiDraftModal from '../components/mail/AiDraftModal';
import { useJobs, useNotifier, Spinner } from '../App';

interface MailProps {
    setActivePage: (page: Page) => void;
}

const Mail: React.FC<MailProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [emails, setEmails] = useState<Email[]>([]);
    const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<MasterSettings | null>(null);
    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [draftTargetEmail, setDraftTargetEmail] = useState<Email | null>(null);
    
    const [selection, setSelection] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const isConfigured = settings && settings.email.accounts.length > 0 && settings.email.accounts[0].imapHost && settings.email.accounts[0].username;

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [settingsData, foldersData] = await Promise.all([fetchMasterSettings(), fetchFolders()]);
                setSettings(settingsData);
                setFolders(foldersData);
                setActiveFolder(foldersData[0] || null);
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load mail settings.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [addNotification]);
    
    const loadEmails = useCallback(async (folderName: string) => {
        setLoading(true);
        try {
            const data = await fetchEmails(folderName);
            const sortedData = data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setEmails(sortedData);
            if (sortedData.length > 0) {
                 const firstUnread = sortedData.find(e => !e.read);
                 const emailToSelect = firstUnread || sortedData[0];
                 setSelectedEmail(emailToSelect);
            } else {
                setSelectedEmail(null);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : `Failed to load emails for ${folderName}.`, 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);
    
    useEffect(() => {
        if(selectedEmail && !selectedEmail.read) {
            setEmails(prevEmails => prevEmails.map(e => e.id === selectedEmail.id ? {...e, read: true} : e));
            setSelectedEmail(prev => prev ? {...prev, read: true} : null);
            setFolders(prevFolders => prevFolders.map(f => {
                if(f.name === activeFolder?.name && f.unreadCount > 0) {
                    return {...f, unreadCount: f.unreadCount - 1};
                }
                return f;
            }));
        }
    }, [selectedEmail, activeFolder?.name]);


    useEffect(() => {
        if (isConfigured && activeFolder) {
            loadEmails(activeFolder.name);
            setSelection([]);
        } else if (settings) {
            setLoading(false);
        }
    }, [activeFolder, isConfigured, settings, loadEmails]);

    const handleSelectFolder = (folder: Folder) => {
        setActiveFolder(folder);
        setSelectedEmail(null);
    };
    
    const handleOpenCompose = () => {
        setDraftTargetEmail(null);
        setIsDraftModalOpen(true);
    };

    const handleOpenReply = () => {
        if (selectedEmail) {
            setDraftTargetEmail(selectedEmail);
            setIsDraftModalOpen(true);
        }
    };
    
    const handleToggleStar = (emailId: string) => {
        setEmails(prev => prev.map(e => e.id === emailId ? {...e, starred: !e.starred} : e));
         if (selectedEmail?.id === emailId) {
            setSelectedEmail(prev => prev ? {...prev, starred: !prev.starred} : null);
        }
    };

    const handleMarkUnread = (emailIds: string[]) => {
        setEmails(prev => prev.map(e => emailIds.includes(e.id) ? {...e, read: false} : e));
        setFolders(prev => prev.map(f => {
            if (f.name === activeFolder?.name) {
                const unreadCountInSelection = emails.filter(e => emailIds.includes(e.id) && e.read).length;
                return {...f, unreadCount: f.unreadCount + unreadCountInSelection };
            }
            return f;
        }));
        if(selectedEmail && emailIds.includes(selectedEmail.id)) {
            setSelectedEmail(null);
        }
        setSelection([]);
    };

    const handleDelete = (emailIds: string[]) => {
        const remainingEmails = emails.filter(e => !emailIds.includes(e.id));
        setEmails(remainingEmails);
        
        if (selectedEmail && emailIds.includes(selectedEmail.id)) {
            const currentIndex = emails.findIndex(e => e.id === selectedEmail.id);
            const nextEmail = remainingEmails[currentIndex] || remainingEmails[currentIndex-1] || null;
            setSelectedEmail(nextEmail);
        }
        setSelection([]);
    };
    
    const filteredEmails = useMemo(() => {
        if (!searchTerm) return emails;
        const lowercasedTerm = searchTerm.toLowerCase();
        return emails.filter(e => 
            e.subject.toLowerCase().includes(lowercasedTerm) ||
            e.sender.toLowerCase().includes(lowercasedTerm) ||
            e.snippet.toLowerCase().includes(lowercasedTerm) ||
            e.body.toLowerCase().includes(lowercasedTerm)
        );
    }, [emails, searchTerm]);

    if (settings === null) {
        return <Spinner />;
    }

    if (!isConfigured) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold mb-2">Mail Not Configured</h2>
                <p className="text-text-secondary mb-4">
                    Please configure your IMAP server details in the Settings page to use the mail client.
                </p>
                 <button onClick={() => setActivePage(Page.Settings)} className="text-sm font-bold text-primary hover:underline">
                    Go to Settings &gt; Integrations to get started.
                 </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full -m-6 bg-card border border-border rounded-lg overflow-hidden">
            {isDraftModalOpen && (
                <AiDraftModal
                    email={draftTargetEmail}
                    onClose={() => setIsDraftModalOpen(false)}
                    addJob={addJob}
                />
            )}
            <MailHeader
                accounts={settings.email.accounts}
                unreadCount={folders.find(f => f.id === 'f1')?.unreadCount || 0}
                setActivePage={setActivePage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selection={selection}
                onMarkUnread={() => handleMarkUnread(selection)}
                onDelete={() => handleDelete(selection)}
            />
            <div className="flex-1 flex min-h-0">
                <FolderTree 
                    folders={folders}
                    activeFolder={activeFolder}
                    onSelectFolder={handleSelectFolder}
                    onCompose={handleOpenCompose}
                />
                <EmailTable
                    emails={filteredEmails}
                    selectedEmail={selectedEmail}
                    onSelectEmail={setSelectedEmail}
                    loading={loading}
                    selection={selection}
                    onSelectionChange={setSelection}
                    onToggleStar={handleToggleStar}
                />
                <EmailDetail 
                    email={selectedEmail} 
                    onReply={handleOpenReply}
                    setActivePage={setActivePage}
                    onToggleStar={handleToggleStar}
                    onMarkUnread={handleMarkUnread}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default Mail;
