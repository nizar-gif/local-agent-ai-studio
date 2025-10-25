import React, { useState } from 'react';
import { HelpTopic } from '../../types';
import { ChevronRightIcon } from '../shared/Icons';

interface DocsTreeProps {
    topics: HelpTopic[];
    activeTopicId: string | null;
    onSelectTopic: (topicId: string) => void;
    searchTerm: string;
}

const TopicItem: React.FC<{
    topic: HelpTopic;
    level: number;
    activeTopicId: string | null;
    onSelectTopic: (topicId: string) => void;
}> = ({ topic, level, activeTopicId, onSelectTopic }) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const hasChildren = topic.children && topic.children.length > 0;
    const isActive = activeTopicId === topic.id;

    if (!hasChildren) {
        return (
            <button
                onClick={() => onSelectTopic(topic.id)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-secondary'}`}
                style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
            >
                {topic.title}
            </button>
        );
    }

    return (
        <div>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center p-2 rounded-md cursor-pointer hover:bg-secondary"
                style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
            >
                <ChevronRightIcon className={`h-4 w-4 mr-1 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                <span className="font-bold text-text-secondary text-sm uppercase">{topic.title}</span>
            </div>
            {isOpen && (
                <div className="space-y-1 mt-1">
                    {topic.children?.map(child => (
                        <TopicItem
                            key={child.id}
                            topic={child}
                            level={level + 1}
                            activeTopicId={activeTopicId}
                            onSelectTopic={onSelectTopic}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const filterTopics = (topics: HelpTopic[], term: string): HelpTopic[] => {
    if (!term) return topics;
    const lowercasedTerm = term.toLowerCase();
    
    const results: HelpTopic[] = [];

    const search = (topic: HelpTopic) => {
        if (topic.title.toLowerCase().includes(lowercasedTerm)) {
            results.push(topic);
        }
        if (topic.children) {
            topic.children.forEach(search);
        }
    };

    topics.forEach(search);
    return results.map(t => ({...t, children: undefined})); // Return a flat list for search results
};

const DocsTree: React.FC<DocsTreeProps> = ({ topics, activeTopicId, onSelectTopic, searchTerm }) => {
    const filtered = filterTopics(topics, searchTerm);

    return (
        <aside className="w-80 flex-shrink-0 bg-secondary/30 p-4 border-r border-border overflow-y-auto">
            <nav className="space-y-2">
                 {filtered.map(topic => (
                    <TopicItem
                        key={topic.id}
                        topic={topic}
                        level={0}
                        activeTopicId={activeTopicId}
                        onSelectTopic={onSelectTopic}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default DocsTree;
