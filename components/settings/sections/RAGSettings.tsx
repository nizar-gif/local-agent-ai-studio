





import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RAGSettings, Job } from '../../../types';
import { InputField, SectionTitle, SelectField, Toggle } from '../fields';
import { SettingsSectionProps } from '../SettingsLayout';
import { rebuildRAGIndex, incrementalRAGUpdate } from '../../../services/api';

interface Props extends SettingsSectionProps {
  settings: RAGSettings;
  addJob: (job: { name: string; message: string; trigger?: () => Promise<{ job_id: string }> }) => void;
}

const RAGSettings: React.FC<Props> = ({ settings, addJob, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm, showAdvanced }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        handleFieldChange(name, isNumber ? parseFloat(value) || 0 : value);
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFieldChange(e.target.name, e.target.value.split(',').map(s => s.trim()).filter(Boolean));
    };

    const handleToggleChange = (name: string, checked: boolean) => {
        handleFieldChange(name, checked);
    };

  const handleRebuildIndex = () => {
    if (window.confirm("This is a dangerous operation that will re-process all documents. Are you sure?")) {
        addJob({
            name: "Rebuild RAG Index",
            message: "Starting full re-index...",
            trigger: rebuildRAGIndex,
        });
    }
  };
  
  const handleIncrementalUpdate = () => {
    addJob({
        name: "Incremental RAG Update",
        message: "Scanning for new documents...",
        trigger: incrementalRAGUpdate,
    });
  };

  return (
    <div>
      <SectionTitle
        title="Data & RAG"
        subtitle="End-to-end control of ingestion, embeddings, vector store, and retrieval."
        searchTerm={searchTerm}
      />
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h4 className="font-semibold text-lg">Ingestion & Chunking</h4>
                <InputField path="rag.doc_roots" name="rag.doc_roots" label="Document Roots" value={settings.doc_roots.join(', ')} onChange={handleArrayChange} isDirty={dirtyFields.has('rag.doc_roots')} isOverride={overrideFields.has('rag.doc_roots')} onReset={() => handleResetField('rag.doc_roots')} searchTerm={searchTerm} />
                <SelectField path="rag.chunking.splitter" name="rag.chunking.splitter" label="Splitter" value={settings.chunking.splitter} options={['Recursive', 'Markdown', 'Code-aware']} onChange={handleChange} isDirty={dirtyFields.has('rag.chunking.splitter')} isOverride={overrideFields.has('rag.chunking.splitter')} onReset={() => handleResetField('rag.chunking.splitter')} searchTerm={searchTerm} />
                <InputField path="rag.chunking.size" name="rag.chunking.size" label="Chunk Size (tokens)" type="number" value={settings.chunking.size} onChange={handleChange} isDirty={dirtyFields.has('rag.chunking.size')} isOverride={overrideFields.has('rag.chunking.size')} onReset={() => handleResetField('rag.chunking.size')} tooltip="The maximum number of tokens in a single document chunk. Smaller sizes can improve specificity but may lose context." searchTerm={searchTerm} />
                {showAdvanced && <InputField path="rag.chunking.overlap" name="rag.chunking.overlap" label="Chunk Overlap (tokens)" type="number" value={settings.chunking.overlap} onChange={handleChange} isDirty={dirtyFields.has('rag.chunking.overlap')} isOverride={overrideFields.has('rag.chunking.overlap')} onReset={() => handleResetField('rag.chunking.overlap')} tooltip="Number of tokens to overlap between consecutive chunks to maintain context." searchTerm={searchTerm} />}
            </div>
            <div className="space-y-6">
                <h4 className="font-semibold text-lg">Embeddings & Retrieval</h4>
                <SelectField path="rag.embeddings.model" name="rag.embeddings.model" label="Embedding Model" value={settings.embeddings.model} options={['sentence-transformers/all-MiniLM-L6-v2']} onChange={handleChange} isDirty={dirtyFields.has('rag.embeddings.model')} isOverride={overrideFields.has('rag.embeddings.model')} onReset={() => handleResetField('rag.embeddings.model')} searchTerm={searchTerm} />
                 <SelectField path="rag.embeddings.device" name="rag.embeddings.device" label="Device" value={settings.embeddings.device} options={['cpu', 'gpu0']} onChange={handleChange} isDirty={dirtyFields.has('rag.embeddings.device')} isOverride={overrideFields.has('rag.embeddings.device')} onReset={() => handleResetField('rag.embeddings.device')} searchTerm={searchTerm} />
                <InputField path="rag.retrieval.top_k" name="rag.retrieval.top_k" label="Top K" type="number" value={settings.retrieval.top_k} onChange={handleChange} isDirty={dirtyFields.has('rag.retrieval.top_k')} isOverride={overrideFields.has('rag.retrieval.top_k')} onReset={() => handleResetField('rag.retrieval.top_k')} tooltip="The number of most relevant document chunks to retrieve for a given query." searchTerm={searchTerm} />
                {showAdvanced && <InputField path="rag.retrieval.score_threshold" name="rag.retrieval.score_threshold" label="Score Threshold" type="number" step="0.05" min="0" max="1" value={settings.retrieval.score_threshold} onChange={handleChange} isDirty={dirtyFields.has('rag.retrieval.score_threshold')} isOverride={overrideFields.has('rag.retrieval.score_threshold')} onReset={() => handleResetField('rag.retrieval.score_threshold')} tooltip="Minimum similarity score for a chunk to be considered relevant. Lower values return more, but potentially less relevant, results." searchTerm={searchTerm} />}
            </div>
        </div>
        <div className="space-y-6">
            <h4 className="font-semibold text-lg">Watchers & Actions</h4>
            <Toggle path="rag.watchers.auto_ingest" name="rag.watchers.auto_ingest" label="Auto-ingest New Files" checked={settings.watchers.auto_ingest} onChange={(c) => handleToggleChange('rag.watchers.auto_ingest', c)} isDirty={dirtyFields.has('rag.watchers.auto_ingest')} isOverride={overrideFields.has('rag.watchers.auto_ingest')} onReset={() => handleResetField('rag.watchers.auto_ingest')} searchTerm={searchTerm} />
            <div className="flex gap-4 items-center">
                 <button onClick={handleIncrementalUpdate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Incremental Update
                </button>
                <button onClick={handleRebuildIndex} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Rebuild Index
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RAGSettings;