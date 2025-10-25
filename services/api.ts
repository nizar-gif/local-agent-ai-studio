

import { 
    Stat, HealthComponent, Task, TaskExecution, Document, Workflow, Email, 
    LogEntry, MasterSettings, SchedulerJob, DashboardSummary, Profile, ChatSession, 
    Attachment, ContextItem, Agent, KnowledgeBaseStats, RAGQueryResult, Folder, 
    FolderNode, FileItem, DiagnosticTest, UserProfileData, UserPreferences, Job,
    PromptPreset, KeyboardShortcut, UserActivitySummary, HelpTopic, HelpArticle, Message, Connector
} from '../types';

import {
    mockTaskExecutions,
    mockDashboardSummary,
    mockChatContext,
    mockAgents,
    MOCK_SETTINGS_STORE,
    mockHealthStatus,
    mockTasks,
    mockWorkflows,
    mockLogs,
    mockTools,
    mockSchedulerJobs,
    mockDiagnosticTests,
    mockKnowledgeBaseStats,
    mockDocuments,
    mockFolders,
    allEmails,
    MOCK_FILE_TREE,
    MOCK_FILES,
    mockUserProfile,
    mockUserPreferences,
    mockPromptPresets,
    mockKeyboardShortcuts,
    mockUserActivitySummary,
    MOCK_HELP_TOPICS,
    MOCK_HELP_ARTICLES,
    mockConnectors
} from './mockData';

import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';

// A simple in-memory store to track mock job progress for triggered jobs
const mockJobStore: Record<string, Job> = {};

const createMockTrigger = (name: string, message: string): Promise<{job_id: string}> => {
    const jobId = 'mock_job_' + uuidv4().slice(0, 8);
    mockJobStore[jobId] = {
        id: jobId,
        name: name,
        status: 'running',
        progress: 0,
        message: message,
        startTime: Date.now(),
    };
    return Promise.resolve({ job_id: jobId });
}


// --- START TASK EXECUTIONS API ---
export const fetchTaskExecutions = (): Promise<TaskExecution[]> => new Promise(resolve => setTimeout(() => resolve(mockTaskExecutions), 300));
export const createTaskExecution = (taskDetails: Partial<TaskExecution>): Promise<TaskExecution> => new Promise(resolve => {
    const newTask: TaskExecution = {
        id: `exec_${uuidv4().slice(0,4)}`,
        title: taskDetails.title || 'New Task',
        type: taskDetails.type || 'Custom',
        agent: taskDetails.agent || 'Auto-select',
        status: 'Waiting',
        progress: 0,
        startTime: new Date().toISOString(),
        duration: '0s',
        priority: taskDetails.priority || 'Normal',
        createdBy: 'User',
        inputs: taskDetails.inputs || {}
    };
    mockTaskExecutions.unshift(newTask);
    setTimeout(() => resolve(newTask), 200);
});
export const cancelTaskExecution = (taskId: string): Promise<{ status: string }> => new Promise(resolve => {
    const task = mockTaskExecutions.find(t => t.id === taskId);
    if(task) task.status = 'Cancelled';
    setTimeout(() => resolve({ status: 'cancelled' }), 200);
});
// --- END TASK EXECUTIONS API ---

// --- START DASHBOARD API ---
export const fetchDashboardSummary = (): Promise<DashboardSummary> => new Promise(resolve => setTimeout(() => resolve(mockDashboardSummary), 500));
// --- END DASHBOARD API ---

// --- START CHAT CONSOLE API ---

// Internal state for chat sessions to prevent direct mutation from components
let MOCK_SESSIONS: ChatSession[] = [
    { id: 'session_1', name: 'Q4 Report Analysis', lastActivity: '10m ago' },
    { id: 'session_2', name: 'Code Generation for UI', lastActivity: '2h ago' },
    { id: 'session_3', name: 'Untitled Chat', lastActivity: '1d ago' },
];

export const fetchChatSessions = (): Promise<ChatSession[]> => {
    return Promise.resolve(JSON.parse(JSON.stringify(MOCK_SESSIONS)));
};

export const createChatSession = (name: string): Promise<ChatSession> => {
    const newSession: ChatSession = { id: `session_${uuidv4()}`, name, lastActivity: 'Just now' };
    MOCK_SESSIONS.unshift(newSession);
    return Promise.resolve(JSON.parse(JSON.stringify(newSession)));
};

export const renameChatSession = (sessionId: string, name: string): Promise<ChatSession> => {
    const session = MOCK_SESSIONS.find(s => s.id === sessionId);
    if (session) {
        session.name = name;
        session.lastActivity = 'Just now';
        return Promise.resolve(JSON.parse(JSON.stringify(session)));
    }
    return Promise.reject(new Error("Session not found"));
};

export const deleteChatSession = (sessionId: string): Promise<void> => {
    MOCK_SESSIONS = MOCK_SESSIONS.filter(s => s.id !== sessionId);
    return Promise.resolve();
};

export const fetchChatContext = (sessionId: string): Promise<{ context: ContextItem[], attachments: Attachment[] }> => Promise.resolve(mockChatContext);

export async function* streamChat(
    message: string, 
    sessionId: string,
    agentId: string, 
    context: { memory: boolean, documents: boolean },
    signal: AbortSignal
): AsyncGenerator<Message> {
    const mockResponse = "This is a simulated streaming response. The real implementation would use WebSockets to get live data from the backend agent. Each word is yielded as a separate chunk to demonstrate the streaming effect.";
    const words = mockResponse.split(' ');
    const assistantMessageId = uuidv4();

    yield {
        id: assistantMessageId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toISOString(),
        agentName: mockAgents.find(a => a.id === agentId)?.name || 'Assistant',
        avatar: '🤖'
    };

    for (const word of words) {
        if (signal.aborted) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
        yield {
            id: assistantMessageId,
            sender: 'assistant',
            text: word + ' ',
            timestamp: new Date().toISOString()
        };
    }
}
// --- END CHAT CONSOLE API ---


// --- START AGENTS API ---
export const fetchAgents = (): Promise<Agent[]> => Promise.resolve(mockAgents);
// --- END AGENTS API ---


// --- START MASTER SETTINGS API ---
export const fetchMasterSettings = (profileId: string = 'default'): Promise<MasterSettings> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const settings = MOCK_SETTINGS_STORE[profileId] || MOCK_SETTINGS_STORE['default'];
            if (settings) {
                // Ensure the returned settings object correctly identifies its profile
                const settingsForProfile = cloneDeep(settings);
                settingsForProfile.workspace.profile = profileId;
                resolve(settingsForProfile);
            } else {
                reject(new Error(`Profile with id "${profileId}" not found.`));
            }
        }, 200);
    });
};

export const saveMasterSettings = (settings: MasterSettings, profileId: string): Promise<{ applied: boolean; restart_required: boolean; warnings: string[] }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (MOCK_SETTINGS_STORE[profileId]) {
                MOCK_SETTINGS_STORE[profileId] = cloneDeep(settings);
                resolve({ applied: true, restart_required: false, warnings: [] });
            } else {
                 reject(new Error(`Profile with id "${profileId}" not found. Cannot save.`));
            }
        }, 500);
    });
};
// --- END MASTER SETTINGS API ---


// --- START HEALTH & MISC API ---
export const fetchHealthStatus = (): Promise<HealthComponent[]> => Promise.resolve(mockHealthStatus);
export const fetchTasks = (): Promise<Task[]> => Promise.resolve(mockTasks);
export const fetchWorkflows = (): Promise<Workflow[]> => Promise.resolve(mockWorkflows);
export const fetchLogs = (): Promise<LogEntry[]> => Promise.resolve(mockLogs);
export const fetchTools = (): Promise<string[]> => Promise.resolve(mockTools);
// --- END HEALTH & MISC API ---


// --- START CONNECTION TESTS API ---
export const testOllamaConnection = (): Promise<any> => Promise.resolve({ ok: true, message: 'Mock connection successful.', latency_ms: 123, model: 'mock-model' });
export const testOpenAIConnection = (apiKey: string): Promise<any> => Promise.resolve({ ok: true, message: 'Mock connection successful.', latency_ms: 321, model: 'mock-gpt' });
export const testHFConnection = (apiToken: string): Promise<any> => Promise.resolve({ ok: true, message: 'Mock connection successful.', latency_ms: 456, model: 'mock-hf' });
export const testImapConnection = (account: any): Promise<any> => Promise.resolve({ ok: true, message: `Mock IMAP connection to ${account.imapHost} successful.` });
// --- END CONNECTION TESTS API ---

// --- START JOB-TRIGGERING & STATUS API ---
export const getJobStatus = (jobId: string): Promise<Job> => new Promise(resolve => {
    const job = mockJobStore[jobId];
    if (!job) {
        resolve({ id: jobId, name: 'Unknown Job', status: 'failed', progress: 100, message: 'Job not found in mock store.', startTime: Date.now() });
        return;
    }

    if (job.status === 'running') {
        job.progress = Math.min(job.progress + 20, 100);
        job.message = `Processing... ${job.progress}%`;
        if (job.progress >= 100) {
            job.status = 'succeeded';
            job.message = 'Job completed successfully.';
        }
    }
    
    setTimeout(() => resolve({...job}), 200);
});

// --- END JOB-TRIGGERING & STATUS API ---


// --- START AUTOMATION/SCHEDULER API ---
export const fetchSchedulerJobs = (): Promise<SchedulerJob[]> => Promise.resolve(mockSchedulerJobs);
export const createSchedulerJob = (job: Partial<SchedulerJob>): Promise<SchedulerJob> => {
    const newJob = { ...job, id: `job_${uuidv4()}` } as SchedulerJob;
    mockSchedulerJobs.push(newJob);
    return Promise.resolve(newJob);
};
export const updateSchedulerJob = (jobId: string, job: Partial<SchedulerJob>): Promise<SchedulerJob> => {
    const index = mockSchedulerJobs.findIndex(j => j.id === jobId);
    if (index > -1) {
        mockSchedulerJobs[index] = { ...mockSchedulerJobs[index], ...job };
        return Promise.resolve(mockSchedulerJobs[index]);
    }
    return Promise.reject('Job not found');
};
export const deleteSchedulerJob = (jobId: string): Promise<{ status: string }> => Promise.resolve({ status: 'deleted' });
export const toggleSchedulerJob = (jobId: string): Promise<SchedulerJob> => {
    const job = mockSchedulerJobs.find(j => j.id === jobId);
    if(job) job.enabled = !job.enabled;
    return Promise.resolve(job as SchedulerJob);
};
export const runSchedulerJobNow = (jobId: string): Promise<{ job_id: string }> => {
    const job = mockSchedulerJobs.find(j => j.id === jobId);
    return createMockTrigger(`Manual Run: ${job?.name || jobId}`, 'Triggering manual job run...');
};
// --- END AUTOMATION/SCHEDULER API ---


// --- START DIAGNOSTICS API ---
export const fetchDiagnosticTests = (): Promise<DiagnosticTest[]> => Promise.resolve(mockDiagnosticTests);
export const runDiagnostics = (test_ids: string[]): Promise<{ job_id: string }> => createMockTrigger(`Run ${test_ids.length} diagnostics`, 'Starting diagnostic job...');
// --- END DIAGNOSTICS API ---


// --- START RAG API ---
export const fetchKnowledgeBaseStats = (): Promise<KnowledgeBaseStats> => Promise.resolve(mockKnowledgeBaseStats);
export const fetchDocuments = (): Promise<Document[]> => Promise.resolve(mockDocuments);
export const testRAGQuery = (query: string, topK: number, useExplanation: boolean): Promise<RAGQueryResult[]> => new Promise(resolve => {
    setTimeout(() => resolve([
        { chunk: { id: 'c1', vectorId: 'v1', text: 'The projected revenue for Q4 is estimated to be $2.5 million, an increase of 12% over the previous quarter.' }, fileName: 'Project_Proposal.pdf', score: 0.92, explanation: useExplanation ? "The query directly asks about revenue, and this chunk provides specific financial figures for Q4." : undefined },
        { chunk: { id: 'c2', vectorId: 'v2', text: 'Marketing spend will be increased in Q4 to support the new feature launch.' }, fileName: 'meeting_notes.txt', score: 0.85 },
    ].slice(0, topK)), 500);
});
export const rebuildRAGIndex = (): Promise<{ job_id: string }> => createMockTrigger('Rebuild RAG Index', 'Queueing full re-index job...');
export const purgeRAGIndex = (): Promise<{ job_id: string }> => createMockTrigger('Purge RAG Index', 'Queueing purge job...');
export const incrementalRAGUpdate = (): Promise<{ job_id: string }> => createMockTrigger('Incremental RAG Update', 'Queueing incremental update job...');
// --- END RAG API ---

// --- START MAIL API ---
export const fetchFolders = (): Promise<Folder[]> => Promise.resolve(mockFolders);
export const fetchEmails = (folder: string): Promise<Email[]> => Promise.resolve(allEmails.filter(e => e.folder === folder));
export const syncEmails = (): Promise<{ job_id: string }> => createMockTrigger('Email Sync', 'Starting email synchronization...');
// --- END MAIL API ---

// --- START FILES API ---
export const fetchFileTree = (): Promise<FolderNode[]> => Promise.resolve(MOCK_FILE_TREE);
export const fetchFiles = (folderPath: string): Promise<FileItem[]> => Promise.resolve(MOCK_FILES[folderPath] || []);
export const vectorizeFiles = (fileIds: string[]): Promise<{ job_id: string }> => createMockTrigger(`Vectorize ${fileIds.length} file(s)`, 'Queueing vectorization job...');
// --- END FILES API ---


// --- START USER PROFILE API ---
export const fetchUserProfile = (): Promise<UserProfileData> => Promise.resolve(mockUserProfile);
export const fetchUserPreferences = (): Promise<UserPreferences> => Promise.resolve(mockUserPreferences);
export const fetchPromptPresets = (): Promise<PromptPreset[]> => Promise.resolve(mockPromptPresets);
export const fetchKeyboardShortcuts = (): Promise<KeyboardShortcut[]> => Promise.resolve(mockKeyboardShortcuts);
export const fetchUserActivitySummary = (): Promise<UserActivitySummary> => Promise.resolve(mockUserActivitySummary);
// --- END USER PROFILE API ---


// --- START HELP API ---
export const fetchHelpTopics = (): Promise<HelpTopic[]> => Promise.resolve(MOCK_HELP_TOPICS);
export const fetchHelpArticle = (topicId: string): Promise<HelpArticle | null> => Promise.resolve(MOCK_HELP_ARTICLES[topicId] || null);
// --- END HELP API ---


// --- START CONNECTORS API ---
export const fetchConnectors = (): Promise<Connector[]> => Promise.resolve(mockConnectors);
// --- END CONNECTORS API ---