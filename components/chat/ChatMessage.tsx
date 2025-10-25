import React from 'react';
import { Message } from '../../types';
import { ClipboardDocumentIcon } from '../shared/Icons';

// Renders markdown-like text safely without dangerouslySetInnerHTML
const renderMessageContent = (text: string) => {
    // Split by newlines to handle paragraphs and list items
    const lines = text.split('\n');

    const parseLine = (line: string) => {
        // Regex to split text by markdown-like syntax (**bold**, *italic*, and URLs), keeping the delimiters
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|https?:\/\/[^\s]+)/g);

        return parts.map((part, index) => {
            if (!part) return null;
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index}>{part.slice(1, -1)}</em>;
            }
            if (part.match(/^https?:\/\/[^\s]+$/)) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{part}</a>;
            }
            return part; // Return plain text node, which React automatically escapes
        });
    };

    return lines.map((line, lineIndex) => {
        if (line.trim().startsWith('* ')) {
            // Render list items
            return <li key={lineIndex} className="ml-5 list-disc">{parseLine(line.trim().substring(2))}</li>;
        }
        // Render paragraphs
        return <p key={lineIndex}>{parseLine(line)}</p>;
    });
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // A more modern notification would be better, but alert is simple.
        alert("Copied to clipboard!");
    }

    if (isSystem) {
        return (
            <div className="text-center my-2">
                <p className="text-xs text-text-secondary italic px-4 py-1 bg-secondary rounded-full inline-block">
                    {message.text}
                </p>
            </div>
        );
    }
    
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
             <span className={`h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xl flex-shrink-0`}>
                {message.avatar}
            </span>
            <div className={`max-w-xl w-fit rounded-lg ${isUser ? 'bg-primary text-white' : 'bg-card border border-border text-text-primary'}`}>
                <div className="px-4 py-3 prose prose-sm prose-invert max-w-none">
                    {message.sender === 'agent' && <p className="text-xs font-bold text-primary mb-1">{message.agentName}</p>}
                    
                    {message.text.split(/(```[\s\S]*?```)/g).map((part, index) => {
                        if (part.startsWith('```')) {
                            const lang = part.match(/^```(\w+)/)?.[1] || '';
                            const code = part.replace(/^```\w*\n|```$/g, '');
                            return (
                                <div key={index} className="bg-background rounded-md my-2 overflow-hidden">
                                    <div className="flex justify-between items-center px-3 py-1 bg-secondary/50 text-xs">
                                        <span className="font-semibold text-text-secondary">{lang}</span>
                                        <button onClick={() => handleCopy(code)} className="flex items-center gap-1 text-text-secondary hover:text-text-primary">
                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                            Copy
                                        </button>
                                    </div>
                                    <pre className="p-3 text-sm overflow-x-auto"><code>{code}</code></pre>
                                </div>
                            );
                        }
                        // Use the new safe renderer
                        return <div key={index}>{renderMessageContent(part)}</div>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;