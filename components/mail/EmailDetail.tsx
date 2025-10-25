

import React, { useState, useEffect } from 'react';
import { Email, Page, Job } from '../../types';
import { ArrowPathIcon, PaperClipIcon, SparklesIcon, BoltIcon, DocumentTextIcon, CodeBracketSquareIcon, StarIcon, EnvelopeIcon, TrashIcon } from '../shared/Icons';
import { useJobs } from '../../App';
import { v4 as uuidv4 } from 'uuid';

interface EmailDetailProps {
    email: Email | null;
    onReply: () => void;
    setActivePage: (page: Page) => void;
    onToggleStar: (emailId: string) => void;
    onMarkUnread: (emailIds: string[]) => void;
    onDelete: (emailIds: string[]) => void;
}

type ActiveTab = 'Message' | 'AI Summary' | 'Smart Actions' | 'Thread' | 'Metadata';

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onReply, setActivePage, onToggleStar, onMarkUnread, onDelete }) => {
    const { addJob } = useJobs();
    const [activeTab, setActiveTab] = useState<ActiveTab>('Message');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    useEffect(() => {
        // When a new email is selected, default to 'Message' or 'AI Summary' if available
        if (email?.aiSummary) {
            setActiveTab('AI Summary');
        } else {
            setActiveTab('Message');
        }
    }, [email]);

    const handleCreateTask = () => {
        if (!email) return;
        addJob({
            name: `Task from email: ${email.subject}`,
            message: 'Creating task from email context...',
        });
    };
    
    const handleRegenerateSummary = () => {
        if (!email) return;
        setIsGeneratingSummary(true);
        // Simulate API call
        setTimeout(() => setIsGeneratingSummary(false), 2000);
    }

    if (!email) {
        return <div className="flex-1 p-8 text-center text-text-secondary">Select an email to view its content.</div>;
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Message':
                return (
                    <div className="prose prose-sm prose-invert max-w-none text-text-primary">
                        <p>{email.body}</p>
                    </div>
                );
            case 'AI Summary':
                 return (
                    <div className="space-y-4">
                        <div className="p-4 bg-secondary rounded-lg border border-border min-h-[100px]">
                            {isGeneratingSummary ? (
                                <p className="text-sm text-text-secondary animate-pulse">Generating summary...</p>
                            ) : (
                                <>
                                    <p className="text-sm">{email.aiSummary || "No AI summary available for this email."}</p>
                                    {email.aiSummary && <p className="text-xs text-right text-text-secondary mt-2">Confidence: 95%</p>}
                                </>
                            )}
                        </div>
                        <button onClick={handleRegenerateSummary} disabled={isGeneratingSummary} className="text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-wait">
                            Regenerate Summary
                        </button>
                    </div>
                );
            case 'Smart Actions':
                 if (email.smartActions.length === 0) {
                     return <p className="text-sm text-text-secondary">No smart actions suggested for this email.</p>;
                 }
                return (
                    <div className="space-y-3">
                        {email.smartActions.map((action, i) => (
                            <div key={i} className="p-3 bg-secondary rounded-lg border border-border flex justify-between items-center">
                                <div>
                                    <span className="text-sm font-semibold">{action.action}</span>
                                    <p className="text-xs text-text-secondary">Confidence: {Math.round(action.confidence * 100)}%</p>
                                </div>
                                <button className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover">
                                    <BoltIcon className="h-4 w-4" /> Execute
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case 'Thread':
                 return <p className="text-sm text-text-secondary">Thread context and semantic links will appear here.</p>;
            case 'Metadata':
                return <p className="text-sm text-text-secondary">Email headers and RAG embedding IDs will appear here.</p>;
            default: return null;
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 p-4 border-b border-border">
                <h2 className="text-lg font-bold">{email.subject}</h2>
                <p className="text-sm text-text-secondary">From: {email.sender} &nbsp;|&nbsp; To: {email.recipient}</p>
                <div className="flex items-center gap-2 mt-3">
                    <button onClick={onReply} className="text-sm font-bold py-1.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white">Reply (AI)</button>
                    <button className="text-sm font-bold py-1.5 px-4 rounded-lg bg-secondary hover:bg-background">Forward</button>
                    <DetailActionButton icon={StarIcon} onClick={() => onToggleStar(email.id)} title={email.starred ? 'Unstar' : 'Star'} active={email.starred} />
                    <DetailActionButton icon={EnvelopeIcon} onClick={() => onMarkUnread([email.id])} title="Mark as unread" />
                    <DetailActionButton icon={TrashIcon} onClick={() => onDelete([email.id])} title="Delete" />
                    <DetailActionButton icon={DocumentTextIcon} onClick={handleCreateTask} title="Add to tasks" />
                    <DetailActionButton icon={CodeBracketSquareIcon} onClick={() => setActivePage(Page.Workflows)} title="Add to workflow" />
                </div>
            </header>

            <div className="border-b border-border px-4">
                 <nav className="-mb-px flex space-x-4">
                    <TabButton name="Message" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="AI Summary" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Smart Actions" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Thread" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="Metadata" activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
                 {email.attachments.length > 0 && (
                    <div className="mt-6 border-t border-border pt-4">
                        <h4 className="font-semibold mb-2">{email.attachments.length} Attachment(s)</h4>
                        <div className="flex gap-2">
                        {email.attachments.map(att => (
                            <div key={att.id} className="p-2 bg-secondary rounded-md flex items-center gap-2 text-sm">
                                <PaperClipIcon className="h-4 w-4" />
                                <span>{att.name} ({(att.size / 1024).toFixed(1)}MB)</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailActionButton: React.FC<{icon: React.FC<{className: string}>, onClick: () => void, title: string, active?: boolean}> = ({icon: Icon, onClick, title, active}) => (
    <button onClick={onClick} className="p-2 rounded-md hover:bg-secondary" title={title}>
        <Icon className={`h-5 w-5 ${active ? 'text-yellow-400 fill-current' : 'text-text-secondary'}`} />
    </button>
);


const TabButton: React.FC<{ name: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === name ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
    >
        {name}
    </button>
);

export default EmailDetail;