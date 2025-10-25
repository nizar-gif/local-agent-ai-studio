import React, { useState, useEffect } from 'react';
import { HelpArticle } from '../../types';
import { fetchHelpArticle } from '../../services/api';
import { ClipboardDocumentIcon } from '../shared/Icons';

interface DocViewerProps {
    activeTopicId: string | null;
}

const CodeBlock: React.FC<{ code: string, lang: string }> = ({ code, lang }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className="bg-background rounded-md my-4 overflow-hidden border border-border">
            <div className="flex justify-between items-center px-4 py-1 bg-secondary/50 text-xs">
                <span className="font-semibold text-text-secondary">{lang}</span>
                <button onClick={handleCopy} className="flex items-center gap-1 text-text-secondary hover:text-text-primary">
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    Copy
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{code}</code></pre>
        </div>
    );
};


const DocViewer: React.FC<DocViewerProps> = ({ activeTopicId }) => {
    const [article, setArticle] = useState<HelpArticle | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTopicId) {
            setLoading(true);
            fetchHelpArticle(activeTopicId).then(data => {
                setArticle(data);
                setLoading(false);
            });
        }
    }, [activeTopicId]);

    const renderMarkdown = (content: string) => {
        return content.split(/(```[\s\S]*?```)/g).map((part, index) => {
            if (part.startsWith('```')) {
                const lang = part.match(/^```(\w+)/)?.[1] || '';
                const code = part.replace(/^```\w*\n|```$/g, '');
                return <CodeBlock key={index} code={code} lang={lang} />;
            }
            
            const lines = part.trim().split('\n');
            return lines.map((line, lineIndex) => {
                 if (line.startsWith('# ')) return <h1 key={`${index}-${lineIndex}`} className="text-3xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                 if (line.startsWith('## ')) return <h2 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-5 mb-3 border-b border-border pb-2">{line.substring(3)}</h2>;
                 if (line.startsWith('*   ')) return <li key={`${index}-${lineIndex}`} className="ml-6 list-disc">{line.substring(4)}</li>;
                 return <p key={`${index}-${lineIndex}`} className="my-2">{line}</p>;
            });
        });
    };

    if (loading) {
        return <div className="flex-1 p-8 text-center">Loading article...</div>;
    }

    if (!article) {
        return <div className="flex-1 p-8 text-center">Please select a topic to read the documentation.</div>;
    }

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto prose prose-sm prose-invert">
                {renderMarkdown(article.content)}
            </div>
        </main>
    );
};

export default DocViewer;
