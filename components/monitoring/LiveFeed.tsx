import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '../shared/Icons';
import { Page } from '../../types';

interface LiveFeedItemProps {
    item: any;
    onClick: () => void;
}

const LiveFeedItem: React.FC<LiveFeedItemProps> = ({ item, onClick }) => {
    const color = {
        SYSTEM: 'text-yellow-400',
        LLM: 'text-blue-400',
        AGENT: 'text-green-400',
        SCHEDULER: 'text-purple-400',
        RAG: 'text-indigo-400',
        SECURITY: 'text-red-400'
    }[item.type] || 'text-gray-400';

    return (
        <button onClick={onClick} className="w-full text-left p-2 bg-background rounded-md text-sm transition-all hover:bg-black/20">
            <p className="text-xs text-text-secondary font-mono">{item.timestamp}</p>
            <p className="mt-1">
                <span className={`font-bold ${color}`}>[{item.type}]</span> {item.message}
            </p>
        </button>
    );
};

const MOCK_LIVE_FEED_INITIAL = [
    { type: 'SYSTEM', message: 'CPU usage exceeded 90% threshold.', timestamp: new Date().toLocaleTimeString() },
    { type: 'LLM', message: 'Response latency for mistral:7b > 1.5s.', timestamp: new Date().toLocaleTimeString() },
    { type: 'AGENT', message: 'Agent `Code Generator` completed task #exec_103.', timestamp: new Date().toLocaleTimeString() },
    { type: 'SCHEDULER', message: 'Job `email_sync` failed.', timestamp: new Date().toLocaleTimeString() },
    { type: 'RAG', message: 'Embedding task finished for 12 documents.', timestamp: new Date().toLocaleTimeString() },
    { type: 'SECURITY', message: 'Safe mode triggered by shell access attempt.', timestamp: new Date().toLocaleTimeString() },
];

interface LiveFeedProps {
    setActivePage: (page: Page) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ setActivePage }) => {
    const [liveFeed, setLiveFeed] = useState(MOCK_LIVE_FEED_INITIAL);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const feedInterval = setInterval(() => {
            const eventTypes = ['SYSTEM', 'LLM', 'AGENT', 'SCHEDULER', 'RAG', 'SECURITY'];
            const messages: Record<string, string> = {
                SYSTEM: 'Memory usage is stable.',
                LLM: 'New query received.',
                AGENT: `Agent 'Email Sorter' starting new task.`,
                SCHEDULER: 'Job `rag_incremental` succeeded.',
                RAG: 'Watcher detected 3 new files.',
                SECURITY: 'Anomalous tool usage pattern detected.'
            }
            const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const newEvent = { type, message: messages[type], timestamp: new Date().toLocaleTimeString()};
            setLiveFeed(prev => [newEvent, ...prev].slice(0, 100));
        }, 5000);
        return () => clearInterval(feedInterval);
    }, []);

    if (isCollapsed) {
        return (
            <aside className="w-12 flex-shrink-0 bg-secondary border-l border-border flex flex-col items-center py-4 transition-all duration-300">
                <button onClick={() => setIsCollapsed(false)} title="Expand Feed" className="p-2 hover:bg-background rounded-md">
                    <ChevronLeftIcon className="h-6 w-6 text-text-secondary" />
                </button>
            </aside>
        );
    }

    return (
        <aside className="w-96 flex-shrink-0 bg-secondary border-l border-border flex flex-col transition-all duration-300">
            <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="text-lg font-bold">Live Metrics Feed</h3>
                <button onClick={() => setIsCollapsed(true)} title="Collapse Feed" className="p-2 hover:bg-background rounded-md">
                    <ChevronRightIcon className="h-6 w-6 text-text-secondary" />
                </button>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {liveFeed.map((item, index) => <LiveFeedItem key={index} item={item} onClick={() => setActivePage(Page.Logs)} />)}
            </div>
        </aside>
    );
};

export default LiveFeed;