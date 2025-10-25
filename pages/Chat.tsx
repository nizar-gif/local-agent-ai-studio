import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatSession, Attachment, ContextItem, Agent } from '../types';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from '../components/chat/ChatHeader';
import ContextPanel from '../components/chat/ContextPanel';
import PromptComposer from '../components/chat/PromptComposer';
import ChatMessage from '../components/chat/ChatMessage';
import { fetchChatContext, streamChat, fetchAgents } from '../services/api';
import { useNotifier, Spinner, useChatSession, useJobs, useSettings } from '../App';
import { XCircleIcon } from '../components/shared/Icons';

// --- START Advanced Settings Modal ---
interface AdvancedChatSettingsModalProps {
    onClose: () => void;
}

const AdvancedChatSettingsModal: React.FC<AdvancedChatSettingsModalProps> = ({ onClose }) => {
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [selectedMicrophone, setSelectedMicrophone] = useState('');
    const [model, setModel] = useState('gemini-2.5-pro');
    const [template, setTemplate] = useState('react-ts');

    useEffect(() => {
        const getMicrophones = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
                setMicrophones(audioInputDevices);
                if (audioInputDevices.length > 0) {
                    setSelectedMicrophone(audioInputDevices[0].deviceId);
                }
            } catch (error) {
                console.error("Error getting microphone permissions or listing devices:", error);
            }
        };

        getMicrophones();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-lg flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Advanced settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Model Selector */}
                    <div>
                        <label htmlFor="model-selector" className="block text-sm font-medium text-text-primary">
                            Select model for the code assistant:
                        </label>
                        <select
                            id="model-selector"
                            name="model-selector"
                            className="mt-1 block w-full bg-secondary border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        >
                            <option value="gemini-2.5-pro">Default (Gemini 2.5 Pro)</option>
                            <option value="gemini-flash-latest">Gemini Flash</option>
                            <option value="gemini-2.5-pro-latest">Gemini 2.5 Pro (Latest)</option>
                        </select>
                        <p className="mt-2 text-xs text-text-secondary">
                            The model will be used by the code assistant to generate code.
                        </p>
                    </div>

                    {/* System Instructions */}
                    <div>
                        <button className="w-full text-left p-4 bg-secondary rounded-lg border border-border hover:bg-background transition-colors">
                            <h3 className="font-semibold text-text-primary">System instructions</h3>
                            <p className="text-sm text-text-secondary mt-1">
                                Add custom instructions for your project to control style, models used, add specific knowledge, and more.
                            </p>
                        </button>
                    </div>
                    
                    <hr className="border-border" />

                    {/* System Instructions Template */}
                    <div>
                        <label htmlFor="template-selector" className="block text-sm font-medium text-text-primary">
                            System instructions template
                        </label>
                        <select
                            id="template-selector"
                            name="template-selector"
                            className="mt-1 block w-full bg-secondary border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                        >
                            <option value="react-ts">React (TypeScript)</option>
                            <option value="vanilla-js">Vanilla JS (HTML, CSS, JS)</option>
                            <option value="vue">Vue (SFC)</option>
                            <option value="svelte">Svelte</option>
                            <option value="angular">Angular</option>
                        </select>
                        <p className="mt-2 text-xs text-text-secondary">
                            The configuration is for working with different frontend frameworks. Code Assistant follows strict guidelines for using the Gemini API.
                        </p>
                    </div>
                    
                    <hr className="border-border" />

                    {/* Microphone Selector */}
                    <div>
                        <label htmlFor="mic-selector" className="block text-sm font-medium text-text-primary">
                            Microphone selector
                        </label>
                        <select
                            id="mic-selector"
                            name="mic-selector"
                            className="mt-1 block w-full bg-secondary border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            value={selectedMicrophone}
                            onChange={(e) => setSelectedMicrophone(e.target.value)}
                            disabled={microphones.length === 0}
                        >
                            {microphones.length > 0 ? (
                                microphones.map(mic => (
                                    <option key={mic.deviceId} value={mic.deviceId}>{mic.label || `Microphone ${mic.deviceId.substring(0, 8)}`}</option>
                                ))
                            ) : (
                                <option>No microphones found or permission denied</option>
                            )}
                        </select>
                        <p className="mt-2 text-xs text-text-secondary">
                            Select the audio source for the speech-to-text feature.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END Advanced Settings Modal ---


const Chat: React.FC = () => {
    const { addNotification } = useNotifier();
    const { 
        sessions, activeSession, switchSession, createSession, 
        renameSession, deleteSession, newChatRequested, 
        clearNewChatRequest, isLoading: isLoadingSessions 
    } = useChatSession();
    const { addJob } = useJobs();
    const { settings, updateSetting } = useSettings();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeAgentId, setActiveAgentId] = useState<string>('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);

    // Context state
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [contextItems, setContextItems] = useState<ContextItem[]>([]);
    
    const chatUxSettings = settings?.ui.chatUx;

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewChat = useCallback(async (isProgrammatic = false) => {
        const defaultName = `New Chat - ${new Date().toLocaleTimeString()}`;
        const newName = isProgrammatic ? defaultName : prompt("Enter new chat session name:", defaultName);
        if (newName && newName.trim()) {
            await createSession(newName.trim());
        }
    }, [createSession]);
    
    const handleRenameSession = async () => {
        if (!activeSession) return;
        const newName = prompt("Enter new name for this session:", activeSession.name);
        if (newName && newName.trim() && newName !== activeSession.name) {
            await renameSession(activeSession.id, newName.trim());
        }
    };
    
    const handleDeleteSession = async () => {
        if (!activeSession) return;
        if (window.confirm(`Are you sure you want to delete "${activeSession.name}"? This cannot be undone.`)) {
            await deleteSession(activeSession.id);
        }
    };

    useEffect(() => {
        if (newChatRequested) {
            handleNewChat(true);
            clearNewChatRequest();
        }
    }, [newChatRequested, handleNewChat, clearNewChatRequest]);

    useEffect(() => {
        fetchAgents().then(data => {
            setAgents(data);
            if(data.length > 0) setActiveAgentId(data[0].id);
        }).catch(err => addNotification(err.message, 'error'));
    }, [addNotification]);

    useEffect(() => {
        if (activeSession) {
            setLoadingMessages(true);
            setMessages([]); // Clear previous messages for better UX
            fetchChatContext(activeSession.id).then(({context, attachments}) => {
                setContextItems(context);
                setAttachments(attachments);
                setMessages([
                    { id: uuidv4(), sender: 'assistant', text: `Switched to session: "${activeSession.name}". How can I help?`, timestamp: new Date().toISOString(), avatar: '🤖' }
                ]);
            }).catch(err => addNotification(err.message, 'error'))
            .finally(() => setLoadingMessages(false));
        } else if (!isLoadingSessions) {
             if (sessions.length > 0) {
                // If sessions exist, activate the first one.
                switchSession(sessions[0]);
            } else {
                // If NO sessions exist after loading, create one.
                handleNewChat(true);
            }
        }
    }, [activeSession, isLoadingSessions, sessions, switchSession, handleNewChat, addNotification]);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);
    
    const handleSummarizeChat = () => {
        if (!activeSession) {
            addNotification('No active session to summarize.', 'warning');
            return;
        }
        addJob({
            name: `Summarize: ${activeSession.name}`,
            message: 'Starting chat summarization task...',
        });
    };

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newAttachment: Attachment = {
                id: uuidv4(),
                name: file.name,
                size: Math.round(file.size / 1024), // size in KB
            };
            setAttachments(prev => [...prev, newAttachment]);
            addNotification(`Attached file: ${file.name}`, 'success');
        }
        if(event.target) {
            event.target.value = '';
        }
    };
    
    const handleRemoveAttachment = (attachmentId: string) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    };


    const handleSend = async (input: string, contextToggles: { memory: boolean, documents: boolean, streaming: boolean}) => {
        if (!input.trim() || isStreaming || !activeSession) return;

        const userMessage: Message = { id: uuidv4(), sender: 'user', text: input, timestamp: new Date().toISOString(), avatar: '🧑‍💻' };
        setMessages(prev => [...prev, userMessage]);
        
        setIsStreaming(true);
        abortControllerRef.current = new AbortController();
        
        try {
            const stream = streamChat(input, activeSession.id, activeAgentId, contextToggles, abortControllerRef.current.signal);
            
            let assistantMessageId: string | null = null;

            for await (const chunk of stream) {
                if (!assistantMessageId) {
                    // First chunk is the message shell with an ID.
                    assistantMessageId = chunk.id;
                    setMessages(prev => [...prev, chunk]);
                } else {
                    // Subsequent chunks contain text updates. Efficiently update the last message.
                    setMessages(prev => {
                        const lastIndex = prev.length - 1;
                        if (lastIndex >= 0 && prev[lastIndex].id === assistantMessageId) {
                            const updatedMessages = [...prev];
                            const lastMessage = { ...updatedMessages[lastIndex] };
                            lastMessage.text = (lastMessage.text || '') + (chunk.text || '');
                            updatedMessages[lastIndex] = lastMessage;
                            return updatedMessages;
                        }
                        return prev;
                    });
                }
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                addNotification(error instanceof Error ? error.message : 'An error occurred while streaming the chat response.', 'error');
                const errorMessage: Message = {
                    id: uuidv4(), sender: 'system', text: 'Connection to agent lost.', timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };
    
    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }
    
    const handleRegenerate = () => {
         const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
         if(lastUserMessage) {
             handleSend(lastUserMessage.text, { memory: true, documents: true, streaming: true });
         }
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-2xl overflow-hidden -m-6">
            {isAdvancedSettingsOpen && <AdvancedChatSettingsModal onClose={() => setIsAdvancedSettingsOpen(false)} />}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                className="hidden"
                aria-hidden="true"
            />
            <ChatHeader 
                sessions={sessions} 
                activeSession={activeSession}
                onSessionChange={switchSession}
                agents={agents}
                activeAgentId={activeAgentId}
                onAgentChange={setActiveAgentId}
                onNewChat={() => handleNewChat(false)}
                onRenameSession={handleRenameSession}
                onDeleteSession={handleDeleteSession}
                onSummarizeChat={handleSummarizeChat}
                onAttachFile={handleAttachFile}
                showTokens={chatUxSettings?.showTokens ?? false}
                onOpenAdvancedSettings={() => setIsAdvancedSettingsOpen(true)}
            />
            <div className="flex flex-1 min-h-0">
                <div className="flex-1 flex flex-col">
                    <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto relative">
                        {isLoadingSessions || loadingMessages ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-card/50">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {messages.filter(msg => (chatUxSettings?.showAgentSteps ?? false) || !msg.isReasoningStep).map(msg => <ChatMessage key={msg.id} message={msg} />)}
                                {isStreaming && (
                                    <div className="flex items-start gap-3">
                                        <span className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xl flex-shrink-0">🤖</span>
                                        <div className="pt-2">
                                            <div className="animate-pulse flex space-x-1">
                                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                                                <div className="h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
                                                <div className="h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <PromptComposer 
                        isStreaming={isStreaming} 
                        onSend={handleSend}
                        onStop={handleStop}
                        onRegenerate={handleRegenerate}
                        enterToSend={chatUxSettings?.enterToSend ?? true}
                        showTokens={chatUxSettings?.showTokens ?? false}
                    />
                </div>
                <ContextPanel 
                    contextItems={contextItems}
                    attachments={attachments}
                    showReasoning={chatUxSettings?.showAgentSteps ?? false}
                    onShowReasoningChange={(value) => updateSetting('ui.chatUx.showAgentSteps', value)}
                    onRemoveAttachment={handleRemoveAttachment}
                    onSend={handleSend}
                />
            </div>
        </div>
    );
};

export default Chat;