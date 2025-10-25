import React, { useState } from 'react';
import { XCircleIcon, PaperAirplaneIcon } from '../../components/shared/Icons';
import { testRAGQuery } from '../../services/api';
import { RAGQueryResult } from '../../types';
import { Toggle } from '../../components/settings/fields';

interface QueryTesterModalProps {
    onClose: () => void;
}

const QueryTesterModal: React.FC<QueryTesterModalProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [topK, setTopK] = useState(3);
    const [results, setResults] = useState<RAGQueryResult[]>([]);
    const [isTesting, setIsTesting] = useState(false);
    
    // New states for full functionality
    const [useReranker, setUseReranker] = useState(false);
    const [displaySimilarity, setDisplaySimilarity] = useState(true);
    const [includeExplanation, setIncludeExplanation] = useState(true);
    const [metadataFilter, setMetadataFilter] = useState('');

    const handleTest = async () => {
        setIsTesting(true);
        const res = await testRAGQuery(query, topK, includeExplanation);
        setResults(res);
        setIsTesting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg w-full max-w-3xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">RAG Query Tester</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center bg-secondary rounded-lg">
                        <input 
                            type="text" 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Ask a question about your documents..." 
                            className="flex-1 bg-transparent p-3 focus:outline-none"
                        />
                        <button onClick={handleTest} disabled={isTesting} className="p-3 text-primary hover:text-primary-hover transition-colors disabled:opacity-50">
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Top K: <span className="font-bold text-primary">{topK}</span></label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="w-48"
                            />
                        </div>
                        <input 
                            type="text" 
                            value={metadataFilter}
                            onChange={e => setMetadataFilter(e.target.value)}
                            placeholder='Metadata Filter (e.g., category="policies")' 
                            className="bg-secondary border border-border rounded-md p-2 text-sm w-full"
                        />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {/* FIX: Add missing 'path' prop to Toggle components */}
                        <Toggle name="useReranker" path="queryTester.useReranker" label="Use Reranker" checked={useReranker} onChange={setUseReranker} />
                        <Toggle name="displaySimilarity" path="queryTester.displaySimilarity" label="Display Similarity" checked={displaySimilarity} onChange={setDisplaySimilarity} />
                        <Toggle name="includeExplanation" path="queryTester.includeExplanation" label="Include Agent Explanation" checked={includeExplanation} onChange={setIncludeExplanation} />
                    </div>

                    <div className="border-t border-border pt-4">
                        <h3 className="font-semibold mb-2">Results</h3>
                        {isTesting ? <p>Testing...</p> : (
                            <div className="space-y-3">
                                {results.length > 0 && results[0].explanation && (
                                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary-content">
                                        <p className="font-bold">Agent Explanation:</p>
                                        <p>{results[0].explanation}</p>
                                    </div>
                                )}
                                {results.map((res, i) => (
                                    <div key={i} className="bg-secondary p-3 rounded-md border border-border">
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <p className="font-bold">{res.fileName}</p>
                                            {displaySimilarity && <p>Score: <span className="font-semibold text-green-400">{res.score.toFixed(2)}</span></p>}
                                        </div>
                                        <p className="text-sm mt-2 text-text-secondary">{res.chunk.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                 <footer className="p-4 border-t border-border flex justify-end gap-4">
                    <button onClick={onClose} className="bg-secondary hover:bg-background px-4 py-2 rounded-md font-semibold">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default QueryTesterModal;