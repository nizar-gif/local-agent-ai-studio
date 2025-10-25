import React, { useState } from 'react';
import { PaperAirplaneIcon, StopCircleIcon, ArrowPathIcon, PuzzlePieceIcon, MicrophoneIcon } from '../shared/Icons';

interface PromptComposerProps {
    isStreaming: boolean;
    onSend: (input: string, contextToggles: { memory: boolean, documents: boolean, streaming: boolean}) => void;
    onStop: () => void;
    onRegenerate: () => void;
    enterToSend: boolean;
    showTokens: boolean;
}

const PromptComposer: React.FC<PromptComposerProps> = ({ isStreaming, onSend, onStop, onRegenerate, enterToSend, showTokens }) => {
    const [input, setInput] = useState('');
    const [contextToggles, setContextToggles] = useState({
        memory: true,
        documents: true,
        streaming: true,
    });

    const handleSendClick = () => {
        onSend(input, contextToggles);
        setInput('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (enterToSend && e.key === 'Enter' && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className="flex-shrink-0 p-4 border-t border-border bg-secondary/50">
            <div className="bg-card p-2 rounded-lg border border-border">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here... (Shift+Enter for newline)"
                    className="w-full bg-transparent p-2 focus:outline-none resize-none"
                    rows={3}
                    disabled={isStreaming}
                />
                <div className="flex justify-between items-center mt-2 p-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => alert("Voice input clicked")} disabled={isStreaming} className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50" title="Voice Input">
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                         <ContextToggle 
                            label="Memory" 
                            enabled={contextToggles.memory} 
                            onChange={(e) => setContextToggles(p => ({...p, memory: e}))}
                        />
                         <ContextToggle 
                            label="Documents" 
                            enabled={contextToggles.documents} 
                            onChange={(e) => setContextToggles(p => ({...p, documents: e}))}
                        />
                        <ContextToggle 
                            label="Streaming" 
                            enabled={contextToggles.streaming} 
                            onChange={(e) => setContextToggles(p => ({...p, streaming: e}))}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {showTokens && <span className="text-xs text-text-secondary font-mono mr-2">Est. Cost: $0.002</span>}
                        <button onClick={() => alert("Use Tool clicked")} disabled={isStreaming} className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50" title="Use Tool">
                            <PuzzlePieceIcon className="h-5 w-5" />
                        </button>
                        <button onClick={onRegenerate} disabled={isStreaming} className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50" title="Regenerate Last Response">
                            <ArrowPathIcon className="h-5 w-5" />
                        </button>
                        {isStreaming ? (
                            <button onClick={onStop} className="p-2 text-red-500 hover:text-red-400" title="Stop Generation">
                                <StopCircleIcon className="h-6 w-6" />
                            </button>
                        ) : (
                            <button onClick={handleSendClick} className="p-2 text-primary hover:text-primary-hover" title="Send Message">
                                <PaperAirplaneIcon className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContextToggle: React.FC<{label: string; enabled: boolean; onChange: (enabled: boolean) => void;}> = ({label, enabled, onChange}) => (
    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-text-secondary">
        <input 
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded bg-secondary border-border text-primary focus:ring-primary focus:ring-offset-background"
        />
        {label}
    </label>
)


export default PromptComposer;