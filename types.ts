// types.ts

export enum Page {
  Dashboard = 'Dashboard',
  Chat = 'Chat',
  RAG = 'RAG',
  Files = 'Files',
  Tasks = 'Tasks',
  Workflows = 'Workflows',
  Automation = 'Automation',
  Agents = 'Agents',
  Mail = 'Mail',
  Connectors = 'Connectors',
  Monitoring = 'Monitoring',
  Logs = 'Logs',
  Settings = 'Settings',
  Diagnostics = 'Diagnostics',
  UserProfile = 'User Profile',
  Help = 'Help',
}

// --- START TASK PAGE TYPES ---
export interface TaskExecution {
  id: string;
  title: string;
  type: 'Chat' | 'Workflow' | 'RAG' | 'Automation' | 'File' | 'Custom';
  agent: string;
  status: 'Running' | 'Waiting' | 'Completed' | 'Failed' | 'Cancelled' | 'Paused';
  progress: number;
  startTime: string;
  duration: string;
  priority: 'Normal' | 'High' | 'Critical';
  createdBy: 'User' | 'Agent' | 'Scheduler';
  inputs: Record<string, any>;
  output?: any;
}
// --- END TASK PAGE TYPES ---

// --- START DASHBOARD TYPES ---

export interface Alert {
  id: string;
  severity: 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface DashboardLogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface JobHistoryItem {
  id: string;
  name: string;
  status: 'succeeded' | 'failed';
  timestamp: string;
}

export interface DashboardSummary {
  agentActivity: {
    activeAgents: number;
    queuedTasks: number;
    throughput: number; // tasks/min
  };
  modelHealth: {
    name: string;
    contextWindow: number;
    temperature: number;
    latency: number[]; // array of recent latencies in ms
  };
  automation: {
    schedulerStatus: 'running' | 'paused';
    nextJobIn: string; // e.g., "5m 30s"
  };
  knowledgeBase: {
    documentsIndexed: number;
    embeddingsPercent: number;
    lastRebuild: string;
  };
  alerts: Alert[];
  performance: {
    cpu: number[];
    gpu: number[];
    memory: number[];
    vram: number[];
    diskIO: number[];
    networkLatency: number[];
  };
  jobHistory: JobHistoryItem[];
  logs: DashboardLogEntry[];
}


// --- END DASHBOARD TYPES ---

// --- START CHAT CONSOLE TYPES ---

export interface ChatSession {
  id: string;
  name: string;
  lastActivity: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number; // in KB
}

export interface ContextItem {
  id: string;
  type: 'RAG Chunk' | 'Planner Step';
  content: string;
  source: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant' | 'agent' | 'system';
    agentName?: string;
    timestamp: string;
    citations?: { text: string, docId: string }[];
    avatar?: string;
    isReasoningStep?: boolean;
}

// --- END CHAT CONSOLE TYPES ---


// --- START MASTER SETTINGS TYPES ---

export interface Job {
  id: string;
  name: string;
  status: 'running' | 'succeeded' | 'failed' | 'cancelled';
  progress: number;
  message: string;
  startTime: number;
}

export interface Profile {
    id: string;
    name: string;
}

export interface WorkspaceSettings {
  workspaceName: string;
  configStoragePath: string;
  dataRootPath: string;
  profile: string; // ID of the current profile
  profiles: Profile[];
  autoSaveInterval: number;
  configVersion: string;
}

export interface LLMParams {
  temperature: number;
  top_p: number;
  top_k: number;
  repeat_penalty: number;
  seed: number;
}

export interface LocalLLMSettings {
  base_url: string;
  model: string;
  context_window: number;
  params: LLMParams;
  stream: boolean;
}

export interface OpenAISettings {
  api_key: string;
  model: string;
  organization?: string;
  base_url?: string;
  stream: boolean;
}

export interface HFSettings {
  api_token: string;
  model: string;
  task: 'text-generation' | 'chat';
  stream: boolean;
}

export interface LLMSettings {
  provider_mode: 'local' | 'openai' | 'hf';
  local: LocalLLMSettings;
  openai: OpenAISettings;
  hf: HFSettings;
}

export interface OrchestrationSettings {
  activeOrchestrator: 'LangChain/LangGraph' | 'smolagents' | 'AutoGen';
  defaultSystemPrompt: string;
  maxTurnsPerTask: number;
  concurrency: {
    maxConcurrentTasks: number;
    perAgentParallelism: number;
  };
  governance: {
    toolAllowlist: string[];
    internetAccess: boolean;
    shellAccess: boolean;
    pythonExecSandbox: boolean;
    tokenBudgetPerTask: number;
  };
  autoGen: {
    agentTopology: 'Planner+Executor' | 'Triad' | 'Custom';
    maxRounds: number;
    stopCriteria: string;
  };
  smolagents: {
    executionBackend: 'Python local';
    maxCodeCells: number;
    timeoutPerCell: number;
  };
}

export interface RAGSettings {
  doc_roots: string[];
  types: ('pdf' | 'docx' | 'md' | 'txt' | 'eml' | 'html' | 'csv')[];
  chunking: {
    size: number;
    overlap: number;
    splitter: 'Recursive' | 'Markdown' | 'Code-aware';
  };
  embeddings: {
    model: string;
    batch: number;
    device: 'cpu' | 'gpu0';
  };
  vector: {
    backend: 'faiss';
    index_path: string;
    dim: number;
  };
  retrieval: {
    top_k: number;
    score_threshold: number;
    reranker: string | null;
  };
  watchers: {
    auto_ingest: boolean;
    interval: number;
    ignore: string[];
  };
}

export interface EmailAccount {
  id: string;
  label: string;
  imapHost: string;
  imapPort: number;
  useSsl: boolean;
  username: string;
  password?: string;
  folderInclusion: string[];
  syncInterval: number;
}

export interface EmailSettings {
  accounts: EmailAccount[];
  aiFeatures: {
    summarizeThreads: boolean;
    autoTriage: boolean;
    vectorizeEmails: boolean;
    redactionRules: string[];
  };
}

export interface SchedulerSettings {
  schedulerEnabled: boolean;
  timezone: string;
  maxConcurrentJobs: number;
  autoRecovery: {
    restartOllama: boolean;
    maxRestarts: number;
    cooldown: number;
    alertOnFailure: boolean;
  };
}

export interface SchedulerJob {
    id: string;
    name: string;
    description?: string;
    jobType: 'health_check' | 'resource_monitor' | 'rag_incremental' | 'email_sync' | 'backup' | 'custom_workflow' | 'custom_agent';
    triggerType: 'cron' | 'interval' | 'event';
    triggerValue: string; // e.g., '60s' or '0 2 * * *'
    enabled: boolean;
    lastRun?: {
        timestamp: string;
        status: 'succeeded' | 'failed' | 'running';
        duration: string;
    };
    nextRun?: string;
    owner: 'System' | 'User' | 'Agent' | 'Workflow';
    parameters?: Record<string, any>;
    logs?: { timestamp: string, message: string, level: 'info' | 'error'}[];
    performance?: {
        runs: { timestamp: string, duration_ms: number, status: 'succeeded' | 'failed'}[];
    }
}


export interface SystemSettings {
  runtime: {
    apiPort: number;
    uiPort: number;
    corsAllowedOrigins: string[];
  };
  devices: {
    gpuSelection: ('cpu' | 'gpu0')[];
    vramCap: number;
  };
  limits: {
    maxParallelRequests: number;
    requestTimeout: number;
    maxUploadSize: number;
  };
  logging: {
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    filePath: string;
    retention: number;
  };
  proxy: {
    httpProxy?: string;
    httpsProxy?: string;
    noProxyHosts: string[];
  };
}

export interface Secret {
    key: string;
    value?: string;
    source: '.env' | 'vault';
}

export interface SecuritySettings {
    secretsVaultPath: string;
    encryptionEnabled: boolean;
    revealOnClick: boolean;
    copyToClipboardAllowed: boolean;
    exportSecrets: boolean;
    sessionLockTimeout: number;
    safeMode: boolean;
    secrets: Secret[];
}

export interface UISettings {
  theme: 'Light' | 'Dark' | 'System';
  density: 'Compact' | 'Comfortable';
  fontSize: 'Small' | 'Normal' | 'Large';
  language: string;
  animations: boolean;
  highContrast: boolean;
  chatUx: {
    enterToSend: boolean;
    showTokens: boolean;
    showAgentSteps: boolean;
  };
}

export interface BackupSettings {
    schedule: string;
    include: ('config' | 'db' | 'vector_index' | 'logs')[];
}

// --- START MCP SETTINGS TYPES ---
export interface MCPSettings {
    enabled: boolean;
    port: number;
    context_ttl: number; // in seconds
    allowed_origins: string[];
    auth_mode: 'none' | 'api_key';
    api_key?: string;
}
// --- END MCP SETTINGS TYPES ---

export interface MasterSettings {
  config_version: string;
  workspace: WorkspaceSettings;
  llm: LLMSettings;
  orchestration: OrchestrationSettings;
  rag: RAGSettings;
  email: EmailSettings;
  scheduler: SchedulerSettings;
  system: SystemSettings;
  security: SecuritySettings;
  ui: UISettings;
  backup: BackupSettings;
  mcp: MCPSettings;
}

// --- END MASTER SETTINGS TYPES ---

// --- START AGENT PAGE TYPES ---
export interface Agent {
  id: string;
  name: string;
  role: string;
  framework: 'LangChain' | 'smolagents' | 'AutoGen';
  status: 'Active' | 'Idle' | 'Waiting' | 'Error';
  uptime: string;
  lastTask: string;
  memoryUse: number; // MB
  tokenUsage: {
    lastHour: number;
    total: number;
  };
  config: {
    llmProvider: string;
    model: string;
    maxTokens: number;
    temperature: number;
    contextWindow: number;
    toolAllowlist: string[];
    sandboxLevel: 'none' | 'file read only' | 'isolated';
    memoryMode: 'episodic' | 'semantic' | 'RAG';
    taskConcurrencyLimit: number;
    systemPrompt: string;
    goals: string[];
  };
}
// --- END AGENT PAGE TYPES ---

// --- START WORKFLOWS TYPES ---
export type WorkflowNodeType = 'Agent' | 'Document' | 'Function' | 'Loop' | 'Timer' | 'Email' | 'End';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: { x: number; y: number };
  // config specific to the node type
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
    id: string;
    name: string;
    type: 'Manual' | 'Scheduled' | 'Event-triggered';
    createdBy: string;
    steps: number;
    lastRun: string;
    duration: string;
    status: 'Active' | 'Draft' | 'Failed';
    nextRun?: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}
// --- END WORKFLOWS TYPES ---

// --- START RAG PAGE TYPES ---
export interface KnowledgeBaseStats {
    docCount: number;
    chunkCount: number;
    embeddingModel: string;
    dimensionality: number;
    indexSize: string;
    diskSpace: string;
}

export interface Chunk {
    id: string;
    vectorId: string;
    text: string;
}

export interface RAGQueryResult {
    chunk: Chunk;
    fileName: string;
    score: number;
    explanation?: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'txt' | 'md' | 'docx' | 'eml' | 'csv' | 'html';
    source: 'local' | 'uploaded' | 'email';
    status: 'Embedded' | 'Pending' | 'Failed';
    chunks: Chunk[];
    dateAdded: string;
    lastUpdated: string;
    size: number; // in KB
    category?: 'Knowledge' | 'Support' | 'Code' | 'Policy';
    metadata: Record<string, string>;
    relationships: { docId: string; score: number }[];
    queries: { query: string; score: number }[];
}

// --- END RAG PAGE TYPES ---

// --- START MAIL TYPES ---
export type AILabel = 'Action' | 'Follow-up' | 'Later' | 'None';

export interface Email {
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    snippet: string;
    timestamp: string;
    read: boolean;
    folder: string;
    body: string;
    attachments: Attachment[];
    starred: boolean;
    flaggedByAI: boolean;
    aiLabel: AILabel;
    aiSummary: string;
    smartActions: { action: string, confidence: number }[];
}

export interface Folder {
    id: string;
    name: string;
    unreadCount: number;
    children?: Folder[];
}
// --- END MAIL TYPES ---

// --- START FILES PAGE TYPES ---
export interface FileTag {
    id: string;
    label: string;
    color: string;
}

export interface FileItem {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'txt' | 'csv' | 'png' | 'jpg' | 'py' | 'js' | 'json' | 'md' | 'unknown';
    mimeType: string;
    size: number; // in KB
    modifiedDate: string;
    vectorized: 'Yes' | 'No' | 'Pending';
    tags: FileTag[];
    lastAccessedBy?: string;
    path: string;
    content?: string; // for preview
}

export interface FolderNode {
    id: string;
    name: string;
    path: string;
    fileCount: number;
    totalSize: number; // in KB
    lastModified: string;
    children: FolderNode[];
    isIndexed: boolean;
}
// --- END FILES PAGE TYPES ---


// --- START DIAGNOSTICS PAGE TYPES ---
export interface DiagnosticTest {
    id: string;
    name: string;
    category: 'System Health' | 'Connectivity' | 'Data & AI Validation';
    description: string;
}

export interface DiagnosticResult extends DiagnosticTest {
    status: 'pending' | 'running' | 'success' | 'warning' | 'error';
    details: string;
    durationMs?: number;
}
// --- END DIAGNOSTICS PAGE TYPES ---


// --- Existing types ---

export interface Stat {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export interface HealthComponent {
  name: string;
  status: 'OK' | 'Error' | 'Warning';
  details: string;
}

export interface Task {
  id: string;
  title:string;
  description: string;
  inputs_schema: Record<string, any> | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  module: string;
  correlationId?: string;
  source?: string;
  stackTrace?: string;
}

// --- START USER PROFILE TYPES ---
export interface UserProfileData {
  id: string;
  displayName: string;
  email: string;
  role: 'Administrator' | 'Developer' | 'Standard User';
  workspace: string;
  lastLogin: string;
  language: string;
  timezone: string;
  profilePictureUrl?: string;
}

export interface UserPreferences {
  theme: 'Light' | 'Dark' | 'System';
  fontSize: 'Small' | 'Normal' | 'Large';
  density: 'Compact' | 'Comfortable';
  chat: {
    enterToSend: boolean;
    showReasoningSteps: boolean;
    streamResponses: boolean;
  };
  notifications: {
    desktop: boolean;
    taskCompletion: boolean;
    automationFailures: boolean;
  };
  accessibility: {
    highContrast: boolean;
  };
  security: {
    sessionTimeout: number;
    twoFactorEnabled: boolean;
  };
}

export interface PromptPreset {
  id: string;
  name: string;
  category: 'Creative Writing' | 'Research Query' | 'Code Review' | 'Email Drafting' | 'System Instruction';
  description: string;
  text: string;
  shortcut?: string;
}

export interface KeyboardShortcut {
  id: string;
  keybinding: string;
  action: string;
}

export interface UserActivitySummary {
  totalTasks: number;
  favoriteAgent: string;
  lastSessions: { id: string; name: string }[];
  tokenUsage: number;
  ragHits: number;
}
// --- END USER PROFILE TYPES ---

// --- START HELP PAGE TYPES ---
export interface HelpTopic {
  id: string;
  title: string;
  children?: HelpTopic[];
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string; // Markdown content
}
// --- END HELP PAGE TYPES ---

// --- START CONNECTORS TYPES ---
export interface Connector {
    id: string;
    name: string;
    description: string;
    status: 'Connected' | 'Not Configured' | 'Error';
    icon: string; // URL or identifier for the icon
}
// --- END CONNECTORS TYPES ---
