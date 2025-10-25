
import React, { useState, useEffect, useCallback } from 'react';
import { HelpTopic, HelpArticle } from '../types';
import { fetchHelpTopics } from '../services/api';
import HelpHeader from '../components/help/HelpHeader';
import DocsTree from '../components/help/DocsTree';
import DocViewer from '../components/help/DocViewer';
import AiHelpSidebar from '../components/help/AiHelpSidebar';
import { useNotifier, Spinner } from '../App';

const Help: React.FC = () => {
    const { addNotification } = useNotifier();
    const [topics, setTopics] = useState<HelpTopic[]>([]);
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAiHelpOpen, setIsAiHelpOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchHelpTopics();
                setTopics(data);
                if (data.length > 0 && data[0].children && data[0].children.length > 0) {
                    setActiveTopicId(data[0].children[0].id);
                } else if (data.length > 0) {
                    setActiveTopicId(data[0].id);
                }
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load help topics.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [addNotification]);

    const handleSelectTopic = (topicId: string) => {
        setActiveTopicId(topicId);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col h-full -m-6 relative">
            <HelpHeader 
                onSearch={setSearchTerm}
                onAskAi={() => setIsAiHelpOpen(true)}
            />
            <div className="flex-1 flex min-h-0">
                <DocsTree 
                    topics={topics}
                    activeTopicId={activeTopicId}
                    onSelectTopic={handleSelectTopic}
                    searchTerm={searchTerm}
                />
                <DocViewer
                    activeTopicId={activeTopicId}
                />
            </div>
            <AiHelpSidebar
                isOpen={isAiHelpOpen}
                onClose={() => setIsAiHelpOpen(false)}
            />
        </div>
    );
};

export default Help;
