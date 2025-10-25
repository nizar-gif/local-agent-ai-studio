// services/mockData.ts

import { Stat, HealthComponent, Task, TaskExecution, Document, Workflow, Email, LogEntry, SchedulerJob, DashboardSummary, ChatSession, Attachment, ContextItem, Agent, KnowledgeBaseStats, RAGQueryResult, Folder, FolderNode, FileItem, DiagnosticTest, UserProfileData, UserPreferences, PromptPreset, KeyboardShortcut, UserActivitySummary, HelpTopic, HelpArticle, MasterSettings, Connector } from '../types';
import { cloneDeep } from 'lodash';

// --- START TASK EXECUTIONS MOCK DATA ---
export const mockTaskExecutions: TaskExecution[] = [
    { id: 'exec_101', title: 'Summarize Document', type: 'RAG', agent: 'Research Planner', status: 'Completed', progress: 100, startTime: '2023-10-27 10:00:00', duration: '12s', priority: 'Normal', createdBy: 'User', inputs: { docId: 'doc_1' } },
    { id: 'exec_102', title: 'Generate Q4 Report', type: 'Workflow', agent: 'Data Analyst', status: 'Failed', progress: 50, startTime: '2023-10-27 10:05:00', duration: '30s', priority: 'High', createdBy: 'Scheduler', inputs: {} },
    { id: 'exec_103', title: 'Generate Python Code', type: 'Chat', agent: 'Code Generator', status: 'Running', progress: 75, startTime: '2023-10-27 10:10:00', duration: '5m...', priority: 'Normal', createdBy: 'User', inputs: { prompt: "Create a FastAPI endpoint..." } },
    { id: 'exec_107', title: 'Data Pipeline', type: 'Automation', agent: 'System', status: 'Paused', progress: 40, startTime: '2023-10-27 10:15:00', duration: '10m', priority: 'High', createdBy: 'Scheduler', inputs: { pipelineId: 'p_456' } },
    { id: 'exec_104', title: 'list_messages', type: 'Automation', agent: 'Email Sorter', status: 'Completed', progress: 100, startTime: '2023-10-27 09:55:00', duration: '8s', priority: 'Normal', createdBy: 'Scheduler', inputs: {} },
    { id: 'exec_105', title: 'Scan Document Root', type: 'File', agent: 'System', status: 'Cancelled', progress: 10, startTime: '2023-10-27 09:50:00', duration: '2s', priority: 'Normal', createdBy: 'Agent', inputs: {} },
    { id: 'exec_106', title: 'Onboard New User', type: 'Workflow', agent: 'Onboarding Agent', status: 'Waiting', progress: 0, startTime: '2023-10-27 10:12:00', duration: '0s', priority: 'Critical', createdBy: 'User', inputs: { userId: 'user_xyz' } },
];
// --- END TASK EXECUTIONS MOCK DATA ---

// --- START DASHBOARD MOCK DATA ---
export const mockDashboardSummary: DashboardSummary = {
  agentActivity: { activeAgents: 8, queuedTasks: 3, throughput: 14.5 },
  modelHealth: { name: 'mistral:7b (Local)', contextWindow: 4096, temperature: 0.4, latency: [120, 150, 130, 160, 140, 135, 155, 148, 162, 150] },
  automation: { schedulerStatus: 'running', nextJobIn: '2m 15s' },
  knowledgeBase: { documentsIndexed: 1245, embeddingsPercent: 100, lastRebuild: '2023-10-27' },
  alerts: [
    { id: '1', severity: 'warning', message: 'Memory usage is high (85%).', timestamp: new Date().toISOString() },
    { id: '2', severity: 'error', message: 'Failed to connect to IMAP server for account "Work".', timestamp: new Date().toISOString() },
  ],
  performance: {
    cpu: [30, 40, 35, 50, 45, 60, 55, 48, 52, 49],
    gpu: [10, 15, 12, 20, 18, 25, 22, 19, 23, 21],
    memory: [75, 76, 78, 80, 82, 85, 85, 84, 83, 82],
    vram: [20, 22, 21, 25, 24, 28, 26, 27, 25, 26],
    diskIO: [5, 10, 8, 15, 12, 20, 18, 16, 19, 17],
    networkLatency: [50, 60, 55, 70, 65, 80, 75, 72, 78, 74],
  },
  jobHistory: [
    { id: '1', name: 'RAG Incremental Update', status: 'succeeded', timestamp: new Date(Date.now() - 60000 * 2).toISOString() },
    { id: '2', name: 'Health Check', status: 'succeeded', timestamp: new Date(Date.now() - 60000 * 5).toISOString() },
    { id: '3', name: 'Email Sync', status: 'failed', timestamp: new Date(Date.now() - 60000 * 10).toISOString() },
    { id: '4', name: 'System Backup', status: 'succeeded', timestamp: new Date(Date.now() - 60000 * 15).toISOString() },
    { id: '5', name: 'Resource Monitor', status: 'succeeded', timestamp: new Date(Date.now() - 60000 * 20).toISOString() },
  ],
  logs: [
    { id: '1', level: 'info', message: 'Agent `PlannerAgent` completed task #123.', timestamp: new Date().toISOString() },
    { id: '2', level: 'warn', message: 'Ollama latency high: 1.2s response time.', timestamp: new Date().toISOString() },
    { id: '3', level: 'info', message: 'RAG index incremental update complete.', timestamp: new Date().toISOString() },
  ],
};
// --- END DASHBOARD MOCK DATA ---

// --- START CHAT CONSOLE MOCK DATA ---
export const mockChatContext: { context: ContextItem[], attachments: Attachment[] } = {
    context: [
        { id: 'ctx_1', type: 'RAG Chunk', content: 'The projected revenue for Q4 is estimated to be $2.5 million...', source: 'Project_Proposal.pdf' },
        { id: 'ctx_2', type: 'Planner Step', content: 'Step 1: Analyze the provided document for revenue figures.', source: 'PlannerAgent' },
    ],
    attachments: [
        { id: 'att_1', name: 'Project_Proposal.pdf', size: 1200 },
    ]
};
// --- END CHAT CONSOLE MOCK DATA ---

// --- START AGENTS MOCK DATA ---
export const mockAgents: Agent[] = [
    {
      id: 'agent_1',
      name: 'Research Planner',
      role: 'Plans research tasks and delegates to other agents.',
      framework: 'AutoGen',
      status: 'Active',
      uptime: '2h 15m',
      lastTask: 'task_001',
      memoryUse: 128,
      tokenUsage: { lastHour: 12500, total: 180000 },
      config: {
        llmProvider: 'local',
        model: 'mistral:7b',
        maxTokens: 4096,
        temperature: 0.5,
        contextWindow: 8192,
        toolAllowlist: ['DuckDuckGoSearchTool', 'FileReadTool'],
        sandboxLevel: 'file read only',
        memoryMode: 'semantic',
        taskConcurrencyLimit: 1,
        systemPrompt: 'You are a master research planner...',
        goals: ['Plan research', 'Verify sources'],
      },
    },
    {
      id: 'agent_2',
      name: 'Code Generator',
      role: 'Generates Python code based on specifications.',
      framework: 'smolagents',
      status: 'Idle',
      uptime: '1d 4h',
      lastTask: 'task_003',
      memoryUse: 64,
      tokenUsage: { lastHour: 0, total: 320000 },
      config: {
        llmProvider: 'local',
        model: 'qwen2.5-coder:14b',
        maxTokens: 8192,
        temperature: 0.2,
        contextWindow: 16384,
        toolAllowlist: ['FileWriteTool', 'PythonExecTool'],
        sandboxLevel: 'isolated',
        memoryMode: 'episodic',
        taskConcurrencyLimit: 1,
        systemPrompt: 'You are an expert Python developer...',
        goals: ['Write clean code', 'Add comments'],
      },
    },
    {
        id: 'agent_3',
        name: 'Data Analyst',
        role: 'Analyzes data and creates reports.',
        framework: 'LangChain',
        status: 'Waiting',
        uptime: '30m',
        lastTask: 'task_002',
        memoryUse: 256,
        tokenUsage: { lastHour: 5000, total: 5000 },
        config: {
            llmProvider: 'cloud',
            model: 'gpt-4o-mini',
            maxTokens: 4096,
            temperature: 0.7,
            contextWindow: 128000,
            toolAllowlist: ['FileReadTool', 'PythonExecTool'],
            sandboxLevel: 'isolated',
            memoryMode: 'RAG',
            taskConcurrencyLimit: 2,
            systemPrompt: 'You are a data analyst...',
            goals: ['Find insights', 'Create visualizations'],
        },
    },
    {
        id: 'agent_4',
        name: 'Email Sorter',
        role: 'Reads and categorizes incoming emails.',
        framework: 'smolagents',
        status: 'Error',
        uptime: '5m',
        lastTask: 'task_004',
        memoryUse: 32,
        tokenUsage: { lastHour: 100, total: 100 },
        config: {
            llmProvider: 'local',
            model: 'mistral:7b',
            maxTokens: 2048,
            temperature: 0.8,
            contextWindow: 8192,
            toolAllowlist: ['EmailReadTool'],
            sandboxLevel: 'none',
            memoryMode: 'episodic',
            taskConcurrencyLimit: 1,
            systemPrompt: 'You are an email sorting assistant...',
            goals: ['Categorize email', 'Identify priority'],
        },
    }
];
// --- END AGENTS MOCK DATA ---

// --- START SCHEDULER MOCK DATA ---
export const mockSchedulerJobs: SchedulerJob[] = [
    { 
        id: 'job_health', 
        name: 'System Health Check',
        jobType: 'health_check',
        triggerType: 'interval',
        triggerValue: '60s', 
        enabled: true, 
        lastRun: { timestamp: new Date(Date.now() - 60000).toISOString(), status: 'succeeded', duration: '1.2s' },
        nextRun: new Date(Date.now() + 60000).toISOString(), 
        owner: 'System'
    },
    { 
        id: 'job_rag', 
        name: 'RAG Incremental Update',
        jobType: 'rag_incremental',
        triggerType: 'interval',
        triggerValue: '300s', 
        enabled: true, 
        lastRun: { timestamp: new Date(Date.now() - 300000).toISOString(), status: 'failed', duration: '30.5s' },
        nextRun: new Date(Date.now() + 300000).toISOString(), 
        owner: 'System'
    },
    { 
        id: 'job_backup', 
        name: 'Configuration Backup',
        jobType: 'backup',
        triggerType: 'cron',
        triggerValue: '0 2 * * *', 
        enabled: false, 
        lastRun: { timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'succeeded', duration: '2m 15s' },
        nextRun: new Date(Date.now() + 86400000).toISOString(), 
        owner: 'User'
    },
    { 
        id: 'evt_1', 
        name: 'On New Report, Summarize',
        jobType: 'custom_workflow',
        triggerType: 'event',
        triggerValue: 'file_created: "/reports"', 
        enabled: true, 
        owner: 'Workflow'
    },
    { 
        id: 'evt_2', 
        name: 'On VIP Email, Notify',
        jobType: 'custom_agent',
        triggerType: 'event',
        triggerValue: 'email_received: "ceo@company.com"', 
        enabled: true, 
        owner: 'Agent'
    },
];
// --- END SCHEDULER MOCK DATA ---

// --- START DIAGNOSTICS MOCK DATA ---
export const mockDiagnosticTests: DiagnosticTest[] = [
    // System Health
    { id: 'cpu_check', name: 'CPU / Memory / Disk', category: 'System Health', description: 'Checks resource usage against thresholds.' },
    { id: 'gpu_check', name: 'GPU Check', category: 'System Health', description: 'Verifies CUDA availability and device access.' },
    { id: 'ports_check', name: 'API Ports Check', category: 'System Health', description: 'Confirms FastAPI + Reflex ports are not in conflict.' },
    { id: 'permissions_check', name: 'File Permissions', category: 'System Health', description: 'Validates write access to workspace paths.' },
    { id: 'services_check', name: 'Background Services', category: 'System Health', description: 'Confirms scheduler and watcher threads are alive.' },

    // Connectivity
    { id: 'ollama_conn', name: 'Ollama Connection', category: 'Connectivity', description: 'Pings /api/version and measures latency.' },
    { id: 'loopback_test', name: 'API Loopback Test', category: 'Connectivity', description: 'Ensures frontend-backend communication is stable.' },
    { id: 'cloud_conn', name: 'Cloud Provider Test', category: 'Connectivity', description: 'Tests OpenAI/HF connectivity if enabled.' },
    { id: 'imap_conn', name: 'IMAP Connection', category: 'Connectivity', description: 'Tests connection for each configured email account.' },
    
    // Data & AI Validation
    { id: 'db_check', name: 'Database Check', category: 'Data & AI Validation', description: 'Verifies schema, migrations, and write access.' },
    { id: 'vector_store_check', name: 'Vector Store Check', category: 'Data & AI Validation', description: 'Ensures index file can be loaded.' },
    { id: 'embedding_model_check', name: 'Embedding Model Check', category: 'Data & AI Validation', description: 'Loads model and tests a sample encoding.' },
    { id: 'rag_sanity_check', name: 'RAG Sanity Query', category: 'Data & AI Validation', description: 'Runs a canary query against the index.' },
    { id: 'llm_health_check', name: 'LLM Health Test', category: 'Data & AI Validation', description: 'Sends a short prompt and measures latency.' },
    { id: 'orchestrator_dry_run', name: 'Orchestrator Dry-Run', category: 'Data & AI Validation', description: 'Executes a dummy pipeline to verify agents.' },
];
// --- END DIAGNOSTICS MOCK DATA ---

// --- START RAG MOCK DATA ---
export const mockKnowledgeBaseStats: KnowledgeBaseStats = {
    docCount: 218,
    chunkCount: 12450,
    embeddingModel: 'all-MiniLM-L6-v2',
    dimensionality: 384,
    indexSize: "1.2 GB",
    diskSpace: "56.3 GB available"
};

export const mockDocuments: Document[] = [
    { id: 'doc_1', name: 'Project_Proposal.pdf', type: 'pdf', source: 'uploaded', status: 'Embedded', category: 'Knowledge', chunks: [{id:'c1', vectorId: 'v1', text: 'Section 1: The projected revenue for Q4 is estimated to be $2.5 million...'}], dateAdded: '2023-10-26', lastUpdated: '2023-10-26', size: 1200, metadata: {author: 'Admin'}, relationships: [{docId: 'doc_4', score: 0.85}], queries: [{query: 'Q4 revenue', score: 0.92}] },
    { id: 'doc_2', name: 'meeting_notes.txt', type: 'txt', source: 'local', status: 'Embedded', category: 'Support', chunks: [{id:'c2', vectorId:'v2', text:'Discussed marketing strategy for new feature launch.'}], dateAdded: '2023-10-25', lastUpdated: '2023-10-26', size: 45, metadata: {}, relationships: [], queries: [] },
    { id: 'doc_3', name: 'architecture.md', type: 'md', source: 'local', status: 'Pending', category: 'Code', chunks: [], dateAdded: '2023-10-27', lastUpdated: '2023-10-27', size: 210, metadata: {}, relationships: [], queries: [] },
    { id: 'doc_4', name: 'competitor_analysis.docx', type: 'docx', source: 'uploaded', status: 'Failed', category: 'Policy', chunks: [], dateAdded: '2023-10-24', lastUpdated: '2023-10-24', size: 3500, metadata: {error: 'Failed to parse file content.'}, relationships: [], queries: [] },
];
// --- END RAG MOCK DATA ---

// --- START MAIL MOCK DATA ---
export const allEmails: Email[] = [
    { 
        id: 'email_1', 
        sender: 'team@example.com', 
        recipient: 'me@example.com',
        subject: 'Q4 Project Kick-off', 
        snippet: 'Hi team, let\'s discuss the Q4 roadmap and allocate resources for the new feature launch. The proposal is attached.', 
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), 
        read: false, 
        folder: 'Inbox', 
        body: 'Full email body for Q4 project kick-off. We need to finalize the budget by EOD Friday. Please review the attached document and come prepared with your feedback.',
        attachments: [{ id: 'att_1', name: 'Q4_Proposal.pdf', size: 1200 }],
        starred: true,
        flaggedByAI: false,
        aiLabel: 'Action',
        aiSummary: 'The sender wants to discuss the Q4 roadmap, allocate resources for a new feature, and is asking for feedback on the attached proposal by Friday.',
        smartActions: [{ action: 'Add to tasks: Review Q4 Proposal', confidence: 0.95 }, { action: 'Schedule meeting: Q4 Kick-off', confidence: 0.90 }]
    },
    { 
        id: 'email_2', 
        sender: 'John Doe', 
        recipient: 'me@example.com',
        subject: 'Re: Your inquiry about pricing', 
        snippet: 'Thanks for reaching out. I\'ve attached the document you requested with our latest pricing tiers.', 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
        read: true, 
        folder: 'Inbox', 
        body: 'Full email body for the inquiry response. Let me know if you have any other questions!',
        attachments: [{ id: 'att_2', name: 'Pricing_2024.pdf', size: 450 }],
        starred: false,
        flaggedByAI: false,
        aiLabel: 'None',
        aiSummary: 'John Doe has responded to a pricing inquiry and attached the latest pricing document.',
        smartActions: [{ action: 'Reply with summary', confidence: 0.8 }]
    },
    { 
        id: 'email_3', 
        sender: 'Me', 
        recipient: 'jane.doe@example.com',
        subject: 'Draft for review', 
        snippet: 'Here is the draft for the proposal we discussed. Please let me know your thoughts.', 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
        read: true, 
        folder: 'Sent', 
        body: 'Full email body of the sent draft.',
        attachments: [],
        starred: false,
        flaggedByAI: false,
        aiLabel: 'None',
        aiSummary: '',
        smartActions: []
    },
     { 
        id: 'email_4', 
        sender: 'noreply@alerts.example.com', 
        recipient: 'me@example.com',
        subject: 'Security Alert: New login from unrecognized device', 
        snippet: 'We detected a new login to your account from a device we don\'t recognize. If this was you, you can safely ignore this email.', 
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
        read: false, 
        folder: 'Inbox', 
        body: 'Details of the login will be here.',
        attachments: [],
        starred: false,
        flaggedByAI: true,
        aiLabel: 'Follow-up',
        aiSummary: 'A security alert was triggered due to a login from an unrecognized device.',
        smartActions: [{ action: 'Mark as safe', confidence: 0.7 }, { action: 'Reset password', confidence: 0.85 }]
    },
];

export const mockFolders: Folder[] = [
    { id: 'f1', name: 'Inbox', unreadCount: 2 },
    { id: 'f2', name: 'Sent', unreadCount: 0 },
    { id: 'f3', name: 'Drafts', unreadCount: 0 },
    { id: 'f4', name: 'Archive', unreadCount: 0 },
    { id: 'f5', name: 'Spam', unreadCount: 14 },
];
// --- END MAIL MOCK DATA ---

// --- START FILES MOCK DATA ---
export const MOCK_FILE_TREE: FolderNode[] = [
    { id: 'root', name: 'data', path: '/', fileCount: 2, totalSize: 1245, lastModified: '2023-10-27', isIndexed: true, children: [
        { id: 'f1', name: 'reports', path: '/reports', fileCount: 1, totalSize: 3500, lastModified: '2023-10-24', isIndexed: true, children: [] },
        { id: 'f2', name: 'images', path: '/images', fileCount: 1, totalSize: 210, lastModified: '2023-10-27', isIndexed: false, children: [
            { id: 'f3', name: 'icons', path: '/images/icons', fileCount: 0, totalSize: 0, lastModified: '2023-10-27', isIndexed: false, children: [] }
        ] },
        { id: 'f4', name: 'code', path: '/code', fileCount: 2, totalSize: 15, lastModified: '2023-10-25', isIndexed: true, children: [] },
    ]}
];

export const MOCK_FILES: { [key: string]: FileItem[] } = {
    '/': [
        { id: 'file1', name: 'Project_Proposal.pdf', type: 'pdf', mimeType: 'application/pdf', size: 1200, modifiedDate: '2023-10-26', vectorized: 'Yes', tags: [{id: 't1', label: 'project', color: 'blue'}], lastAccessedBy: 'Research Planner', path: '/', content: 'This is the content of the project proposal PDF.' },
        { id: 'file2', name: 'meeting_notes.txt', type: 'txt', mimeType: 'text/plain', size: 45, modifiedDate: '2023-10-25', vectorized: 'Yes', tags: [], path: '/' },
    ],
    '/reports': [
        { id: 'file3', name: 'competitor_analysis.docx', type: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 3500, modifiedDate: '2023-10-24', vectorized: 'No', tags: [{id: 't2', label: 'research', color: 'green'}], path: '/reports' },
    ],
    '/images': [
        { id: 'file4', name: 'architecture_diagram.png', type: 'png', mimeType: 'image/png', size: 210, modifiedDate: '2023-10-27', vectorized: 'No', tags: [], path: '/images' },
    ],
    '/code': [
         { id: 'file5', name: 'main_script.py', type: 'py', mimeType: 'text/x-python', size: 12, modifiedDate: '2023-10-25', vectorized: 'Pending', tags: [], lastAccessedBy: 'Code Generator', path: '/code', content: 'import os\n\nprint("Hello, World!")' },
         { id: 'file6', name: 'data.json', type: 'json', mimeType: 'application/json', size: 3, modifiedDate: '2023-10-25', vectorized: 'No', tags: [], path: '/code', content: '{"key": "value"}' },
    ],
};
// --- END FILES MOCK DATA ---

// --- START MISC MOCK DATA ---
export const mockStats: Stat[] = [
  { title: 'Total Tasks', value: '42', change: '+2', changeType: 'increase' },
  { title: 'Active Agents', value: '8', change: '-1', changeType: 'decrease' },
  { title: 'Documents Indexed', value: '1,245', change: '+50', changeType: 'increase' },
  { title: 'LLM Status', value: 'Online' },
];

export const mockHealthStatus: HealthComponent[] = [
    { name: 'Database', status: 'OK', details: 'Connected successfully' },
    { name: 'Ollama LLM', status: 'OK', details: 'qwen2.5:7b responding' },
    { name: 'Disk Usage', status: 'OK', details: '34.5 / 100 GB used' },
    { name: 'Memory Usage', status: 'Warning', details: '12.8 / 16 GB used' },
    { name: 'Automation Service', status: 'OK', details: 'Running' },
];

export const mockTasks: Task[] = [
    { id: 'task_001', title: 'Summarize Document', description: 'Summarizes a given text document using an LLM.', inputs_schema: { "text": "string" } },
    { id: 'task_002', title: 'Translate Text', description: 'Translates text from one language to another.', inputs_schema: { "text": "string", "target_language": "string" } },
    { id: 'task_003', title: 'Generate Image', description: 'Generates an image from a text prompt.', inputs_schema: { "prompt": "string" } },
    { id: 'task_004', title: 'list_messages', description: 'Fetches emails from an Outlook inbox.', inputs_schema: null },
];

export const mockWorkflows: Workflow[] = [
    {
        id: 'wf_1', name: 'New Employee Onboarding', type: 'Manual', createdBy: 'Admin', steps: 5, lastRun: '2023-10-26 14:00:00', duration: '5m 12s', status: 'Active',
        nodes: [
            { id: '1', type: 'Timer', label: 'Start', position: { x: 50, y: 150 } },
            { id: '2', type: 'Agent', label: 'Create Accounts', position: { x: 250, y: 100 } },
            { id: '3', type: 'Email', label: 'Send Welcome Email', position: { x: 500, y: 150 } },
            { id: '4', type: 'End', label: 'End', position: { x: 700, y: 150 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ]
    },
    {
        id: 'wf_2', name: 'Customer Support Inquiry', type: 'Event-triggered', createdBy: 'System', steps: 3, lastRun: '2023-10-27 10:15:00', duration: '1m 30s', status: 'Active',
        nodes: [], edges: []
    },
    {
        id: 'wf_3', name: 'Q4 Financial Report', type: 'Scheduled', createdBy: 'Admin', steps: 8, lastRun: '2023-09-30 23:00:00', duration: '25m 45s', status: 'Draft', nextRun: '2023-12-31 23:00:00',
        nodes: [], edges: []
    },
];

export const mockLogs: LogEntry[] = [
    { 
        id: 'log_1', 
        timestamp: new Date(Date.now() - 500).toISOString(), 
        level: 'INFO', 
        message: 'Agent `Research Planner` completed task `summarize-doc-123`. Execution time: 1.2s.', 
        module: 'agent_core', 
        correlationId: 'task-exec-456' 
    },
    { 
        id: 'log_2', 
        timestamp: new Date(Date.now() - 1200).toISOString(), 
        level: 'ERROR', 
        message: 'Failed to connect to IMAP server for account "Work". Connection timed out.', 
        module: 'integrations.email', 
        source: 'email_client.py:112',
        stackTrace: 'Traceback (most recent call last):\n  File "email_client.py", line 108, in connect\n    self.client.login(self.user, self.password)\nimaplib.IMAP4.error: b\'[AUTHENTICATIONFAILED] Invalid credentials (Failure)\''
    },
    { 
        id: 'log_3', 
        timestamp: new Date(Date.now() - 2500).toISOString(), 
        level: 'WARNING', 
        message: 'Ollama response latency is high: 2500ms for model `mistral:7b`.', 
        module: 'llm_provider.ollama',
        correlationId: 'chat-session-789'
    },
    { 
        id: 'log_4', 
        timestamp: new Date(Date.now() - 3200).toISOString(), 
        level: 'DEBUG', 
        message: 'Received payload for RAG query. Top K=4.', 
        module: 'rag_core.retrieval',
        correlationId: 'rag-query-abc'
    },
    {
        id: 'log_5',
        timestamp: new Date(Date.now() - 4500).toISOString(),
        level: 'CRITICAL',
        message: 'Scheduler main loop has crashed. Attempting auto-recovery.',
        module: 'scheduler.main',
        stackTrace: 'panic: runtime error: invalid memory address or nil pointer dereference\n[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x49f4c8]'
    },
     { 
        id: 'log_6', 
        timestamp: new Date(Date.now() - 6500).toISOString(), 
        level: 'INFO', 
        message: 'Starting incremental RAG update job.', 
        module: 'scheduler.jobs', 
        correlationId: 'job-rag-incremental-1' 
    },
];

export const mockTools = [
    "FileReadTool",
    "FileWriteTool",
    "DuckDuckGoSearchTool",
    "PythonExecTool",
    "EmailReadTool",
    "EmailSendTool"
];
// --- END MISC MOCK DATA ---


// --- START USER PROFILE MOCK DATA ---
export const mockUserProfile: UserProfileData = {
  id: 'user_123',
  displayName: 'Alex Smith',
  email: 'alex.smith@example.com',
  role: 'Administrator',
  workspace: 'Default Workspace',
  lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  language: 'English (US)',
  timezone: 'America/New_York',
};

export const mockUserPreferences: UserPreferences = {
  theme: 'System',
  fontSize: 'Normal',
  density: 'Comfortable',
  chat: {
    enterToSend: true,
    showReasoningSteps: false,
    streamResponses: true,
  },
  notifications: {
    desktop: true,
    taskCompletion: true,
    automationFailures: false,
  },
  accessibility: {
    highContrast: false,
  },
  security: {
    sessionTimeout: 30,
    twoFactorEnabled: false,
  },
};

export const mockPromptPresets: PromptPreset[] = [
  { id: 'p1', name: 'Code Reviewer', category: 'Code Review', description: 'Acts as a senior dev reviewing code.', text: 'You are a senior software engineer. Review the following code for bugs, style issues, and performance improvements.', shortcut: 'Ctrl+1' },
  { id: 'p2', name: 'Concise Summarizer', category: 'Research Query', description: 'Summarizes text in three bullet points.', text: 'Summarize the following text in exactly three bullet points:', shortcut: 'Ctrl+2' },
  { id: 'p3', name: 'Formal Email', category: 'Email Drafting', description: 'Writes a formal email.', text: 'Write a formal email with the following key points: ...' },
];

export const mockKeyboardShortcuts: KeyboardShortcut[] = [
  { id: 's1', keybinding: 'Ctrl + K', action: 'Focus Global Search' },
  { id: 's2', keybinding: 'Ctrl + S', action: 'Save Current Session' },
  { id: 's3', keybinding: 'Ctrl + Shift + N', action: 'New Chat Session' },
  { id: 's4', keybinding: 'Alt + 1', action: 'Switch to Dashboard' },
];

export const mockUserActivitySummary: UserActivitySummary = {
  totalTasks: 128,
  favoriteAgent: 'Research Planner',
  lastSessions: [
    { id: 'sess1', name: 'Q4 Report Analysis' },
    { id: 'sess2', name: 'Code Gen for UI' },
  ],
  tokenUsage: 1250000,
  ragHits: 450,
};
// --- END USER PROFILE MOCK DATA ---


// --- START HELP MOCK DATA ---
export const MOCK_HELP_TOPICS: HelpTopic[] = [
  { id: 'getting-started', title: 'Getting Started', children: [
      { id: 'welcome', title: 'Welcome to the Platform' },
      { id: 'dashboard-overview', title: 'Dashboard Overview' },
  ]},
  { id: 'user-guide', title: 'User Guide', children: [
      { id: 'chat-basics', title: 'Using the Chat Console' },
      { id: 'task-management', title: 'Managing Tasks' },
  ]},
  { id: 'developer-guide', title: 'Developer Guide', children: [
      { id: 'api-reference', title: 'API Reference' },
      { id: 'custom-agents', title: 'Creating Custom Agents' },
  ]},
   { id: 'troubleshooting', title: 'Troubleshooting', children: [
      { id: 'connection-issues', title: 'Connection Issues' },
  ]},
];

export const MOCK_HELP_ARTICLES: Record<string, HelpArticle> = {
    'welcome': {
        id: 'welcome',
        title: 'Welcome to the Local AI Agent Platform',
        content: `
# Welcome to the Local AI Agent Platform

This platform provides a comprehensive suite of tools to manage, interact with, and automate AI agents on your local machine.

## Key Features

*   **Dashboard**: Monitor the health and activity of your entire system at a glance.
*   **Chat Console**: Engage in multi-agent conversations, leverage RAG, and more.
*   **Control Center**: A unified settings panel to configure every aspect of the system.

Navigate using the sidebar to explore different sections.
        `
    },
    'dashboard-overview': {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        content: `
# Dashboard Overview

The dashboard is your command center. It provides real-time telemetry on:

*   Agent Activity
*   Model Health and Latency
*   System Resource Usage (CPU, GPU, Memory)
*   Automation and Scheduler Status
        `
    },
    'connection-issues': {
        id: 'connection-issues',
        title: 'Troubleshooting Connection Issues',
        content: `
# Troubleshooting Connection Issues

If you're having trouble connecting to a local or remote model, follow these steps:

1.  **Verify Backend is Running**: Ensure the main backend process is active.
2.  **Check Settings**: Go to **Settings > Providers & Models** and verify the Base URL for your selected provider.
3.  **Run Diagnostics**: Use the **Diagnostics** page to run connectivity tests.

## Example: Checking Ollama

You can test your local Ollama connection with the following command:
\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
If this fails, your Ollama server is not running correctly.
        `
    }
};
// --- END HELP MOCK DATA ---

// --- START CONNECTORS MOCK DATA ---
export const mockConnectors: Connector[] = [
    { id: 'slack', name: 'Slack', description: 'Connect to Slack for team communication and notifications.', status: 'Connected', icon: '' },
    { id: 'github', name: 'GitHub', description: 'Manage code repositories and automate development workflows.', status: 'Not Configured', icon: '' },
    { id: 'jira', name: 'Jira', description: 'Integrate with Jira for agile project management and issue tracking.', status: 'Not Configured', icon: '' },
    { id: 'gdrive', name: 'Google Drive', description: 'Access and manage files stored in your Google Drive.', status: 'Connected', icon: '' },
    { id: 'notion', name: 'Notion', description: 'Connect to your Notion workspace for knowledge management.', status: 'Error', icon: '' },
    { id: 'discord', name: 'Discord', description: 'Manage Discord servers and automate community interactions.', status: 'Not Configured', icon: '' },
];
// --- END CONNECTORS MOCK DATA ---

// --- START MASTER SETTINGS MOCK DATA ---
const defaultMasterSettings: MasterSettings = {
  config_version: "1.3.0",
  workspace: {
    workspaceName: "Default Workspace",
    configStoragePath: "/Users/user/Library/Application Support/LocalAIAgent/config",
    dataRootPath: "/Users/user/LocalAIAgent",
    profile: "default",
    profiles: [
        { id: 'default', name: 'Default' },
        { id: 'coding', name: 'Coding Profile' },
        { id: 'research', name: 'Research Profile' },
    ],
    autoSaveInterval: 10,
    configVersion: "1.3.0"
  },
  llm: {
    provider_mode: "local",
    local: {
      base_url: "http://localhost:11434",
      model: "mistral:7b",
      context_window: 4096,
      params: { temperature: 0.4, top_p: 0.95, top_k: 40, repeat_penalty: 1.1, seed: 0 },
      stream: true
    },
    openai: { api_key: "", model: "gpt-4o-mini", stream: true },
    hf: { api_token: "", model: "mistralai/Mistral-7B-Instruct-v0.3", task: "text-generation", stream: true }
  },
  orchestration: {
    activeOrchestrator: "LangChain/LangGraph",
    defaultSystemPrompt: "You are a helpful AI assistant. You are running on a local agent platform.",
    maxTurnsPerTask: 25,
    concurrency: { maxConcurrentTasks: 12, perAgentParallelism: 4 },
    governance: {
      toolAllowlist: ["FileReadTool", "FileWriteTool", "DuckDuckGoSearchTool"],
      internetAccess: false,
      shellAccess: false,
      pythonExecSandbox: true,
      tokenBudgetPerTask: 0
    },
    autoGen: { agentTopology: "Planner+Executor", maxRounds: 20, stopCriteria: "TERMINATE" },
    smolagents: { executionBackend: "Python local", maxCodeCells: 10, timeoutPerCell: 60 }
  },
  rag: {
    doc_roots: ["/Users/user/LocalAIAgent/docs"],
    types: ["pdf", "docx", "md", "txt", "eml", "html", "csv"],
    chunking: { size: 500, overlap: 50, splitter: "Recursive" },
    embeddings: { model: "sentence-transformers/all-MiniLM-L6-v2", batch: 64, device: "cpu" },
    vector: { backend: "faiss", index_path: "/Users/user/LocalAIAgent/faiss/index.faiss", dim: 384 },
    retrieval: { top_k: 4, score_threshold: 0.2, reranker: null },
    watchers: { auto_ingest: true, interval: 30, ignore: ["*.tmp", "node_modules/**", ".*"] }
  },
  email: {
    accounts: [{
        id: 'acc_1',
        label: "Personal Gmail",
        imapHost: "imap.gmail.com",
        imapPort: 993,
        useSsl: true,
        username: "user@gmail.com",
        folderInclusion: ["INBOX"],
        syncInterval: 60
    }],
    aiFeatures: { summarizeThreads: true, autoTriage: false, vectorizeEmails: false, redactionRules: ["/[0-9]{9,16}/g"] }
  },
  scheduler: {
    schedulerEnabled: true,
    timezone: "Asia/Baghdad",
    maxConcurrentJobs: 5,
    autoRecovery: { restartOllama: true, maxRestarts: 3, cooldown: 60, alertOnFailure: true }
  },
  system: {
    runtime: { apiPort: 8000, uiPort: 3000, corsAllowedOrigins: ["http://localhost:3000"] },
    devices: { gpuSelection: ["cpu"], vramCap: 0 },
    limits: { maxParallelRequests: 25, requestTimeout: 120, maxUploadSize: 100 },
    logging: { level: "INFO", filePath: "/Users/user/LocalAIAgent/logs/agent_system.log", retention: 30 },
    proxy: { httpProxy: "", httpsProxy: "", noProxyHosts: ["localhost", "127.0.0.1"] }
  },
  security: {
      secretsVaultPath: "/Users/user/Library/Application Support/LocalAIAgent/config/vault",
      encryptionEnabled: true,
      revealOnClick: false,
      copyToClipboardAllowed: true,
      exportSecrets: false,
      sessionLockTimeout: 0,
      safeMode: true,
      secrets: [
          {key: 'OPENAI_API_KEY', source: '.env'},
          {key: 'HF_API_TOKEN', source: 'vault'},
      ]
  },
  ui: {
    theme: "Dark",
    density: "Comfortable",
    fontSize: "Normal",
    language: "English",
    animations: true,
    highContrast: false,
    chatUx: { enterToSend: true, showTokens: false, showAgentSteps: false }
  },
  backup: {
      schedule: "0 2 * * *",
      include: ["config", "db", "vector_index"]
  },
  mcp: {
    enabled: false,
    port: 8001,
    context_ttl: 3600,
    allowed_origins: ["http://localhost:3000"],
    auth_mode: "none",
    api_key: ""
  }
};

const codingProfileSettings = cloneDeep(defaultMasterSettings);
codingProfileSettings.workspace.workspaceName = "Coding Workspace";
codingProfileSettings.orchestration.activeOrchestrator = "smolagents";
codingProfileSettings.llm.local.params.temperature = 0.1;
codingProfileSettings.ui.chatUx.showAgentSteps = true;
codingProfileSettings.orchestration.governance.toolAllowlist.push("PythonExecTool");

const researchProfileSettings = cloneDeep(defaultMasterSettings);
researchProfileSettings.workspace.workspaceName = "Research Workspace";
researchProfileSettings.orchestration.activeOrchestrator = "AutoGen";
researchProfileSettings.orchestration.governance.internetAccess = true;
researchProfileSettings.rag.retrieval.top_k = 8;
researchProfileSettings.rag.retrieval.score_threshold = 0.3;
researchProfileSettings.ui.density = 'Compact';

export const MOCK_SETTINGS_STORE: { [key: string]: MasterSettings } = {
    'default': defaultMasterSettings,
    'coding': codingProfileSettings,
    'research': researchProfileSettings
};
