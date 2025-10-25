import React from 'react';
import { Email } from '../../types';
import { PaperClipIcon, StarIcon, ExclamationTriangleIcon } from '../shared/Icons';

interface EmailTableProps {
    emails: Email[];
    selectedEmail: Email | null;
    onSelectEmail: (email: Email | null) => void;
    loading: boolean;
    selection: string[];
    onSelectionChange: React.Dispatch<React.SetStateAction<string[]>>;
    onToggleStar: (emailId: string) => void;
}

const AILabelColors: Record<string, string> = {
    Action: 'bg-blue-500',
    'Follow-up': 'bg-yellow-500',
    Later: 'bg-gray-500',
    None: '',
};

const EmailTable: React.FC<EmailTableProps> = ({ emails, selectedEmail, onSelectEmail, loading, selection, onSelectionChange, onToggleStar }) => {
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(e.target.checked ? emails.map(em => em.id) : []);
    };
    
    const handleSelectOne = (id: string) => {
        onSelectionChange(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <main className="w-96 lg:w-[450px] flex-shrink-0 border-r border-border flex flex-col">
            <header className="flex-shrink-0 p-2 border-b border-border bg-secondary flex items-center">
                 <div className="px-3">
                     <input type="checkbox" onChange={handleSelectAll} checked={emails.length > 0 && selection.length === emails.length} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/>
                </div>
                <span className="text-sm font-semibold">Inbox</span>
            </header>
            
            <div className="overflow-y-auto flex-1">
                 {loading ? <p className="p-4 text-text-secondary text-sm">Loading messages...</p> : 
                 emails.length === 0 ? <p className="p-4 text-text-secondary text-sm">No messages in this folder.</p> :
                 (
                    <ul>
                        {emails.map(email => (
                            <li key={email.id} onClick={() => onSelectEmail(email)}
                                className={`flex items-start gap-3 p-3 border-b border-border cursor-pointer transition-colors ${selectedEmail?.id === email.id ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
                            >
                                <div className="flex items-center gap-3 mt-1">
                                    <input type="checkbox" checked={selection.includes(email.id)} onChange={() => handleSelectOne(email.id)} onClick={e => e.stopPropagation()} className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"/>
                                     {!email.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" title="Unread"></div>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold text-sm truncate">{email.sender}</p>
                                        <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{new Date(email.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-semibold text-sm truncate">{email.subject}</p>
                                    <p className="text-xs text-text-secondary truncate">{email.snippet}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {email.aiLabel !== 'None' && <div className={`px-1.5 py-0.5 text-xs font-bold text-white rounded ${AILabelColors[email.aiLabel]}`}>{email.aiLabel}</div>}
                                        {email.attachments.length > 0 && <PaperClipIcon className="h-4 w-4 text-text-secondary"><title>{`${email.attachments.length} attachment(s)`}</title></PaperClipIcon>}
                                        <button onClick={(e) => { e.stopPropagation(); onToggleStar(email.id); }} title={email.starred ? 'Unstar' : 'Star'}>
                                            <StarIcon className={`h-4 w-4 ${email.starred ? 'text-yellow-400 fill-current' : 'text-text-secondary hover:text-yellow-400'}`} />
                                        </button>
                                        {email.flaggedByAI && <ExclamationTriangleIcon className="h-4 w-4 text-red-400"><title>Flagged by AI</title></ExclamationTriangleIcon>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                 )}
            </div>
        </main>
    );
};

export default EmailTable;
