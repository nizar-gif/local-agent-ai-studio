





import React, { useState, useCallback, useEffect, createContext, useContext, ReactNode, useRef, useMemo } from 'react';
import { Page, Job, ChatSession, MasterSettings } from './types';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import RAG from './pages/RAG';
import Files from './pages/Files';
import Monitoring from './pages/Monitoring';
import Automation from './pages/Automation';
import Settings from './pages/Settings';
import Agents from './pages/Agents';
import Workflows from './pages/Workflows';
import Mail from './pages/Mail';
import Logs from './pages/Logs';
import Diagnostics from './pages/Diagnostics';
import UserProfile from './pages/UserProfile';
import Help from './pages/Help';
import Connectors from './pages/Connectors';
import { v4 as uuidv4 } from 'uuid';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from './components/shared/Icons';
import { getJobStatus, createChatSession as apiCreateChatSession, renameChatSession as apiRenameChatSession, deleteChatSession as apiDeleteChatSession, fetchChatSessions, fetchMasterSettings, saveMasterSettings as apiSaveMasterSettings } from './services/api';
import { isEqual, cloneDeep, set, get } from 'lodash';
import { MOCK_SETTINGS_STORE } from './services/mockData';


// --- START SHARED COMPONENTS (defined here due to file constraints) ---
export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
);
// --- END SHARED COMPONENTS ---


// --- START NOTIFICATION CONTEXT ---
export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string, type: Notification['type']) => void;
    removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: Notification['type']) => {
        const id = uuidv4();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeNotification(id);
        }, 5000); // Auto-dismiss after 5 seconds
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifier = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifier must be used within a NotificationProvider');
    }
    return context;
};

const NotificationItem: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
    const icons = {
        success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
        error: <XCircleIcon className="h-6 w-6 text-red-400" />,
        warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />,
    };

    const icon = icons[notification.type];

    return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1">
                <p className="font-bold">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
                <p className="text-sm text-text-secondary">{notification.message}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="p-1 rounded-full hover:bg-secondary">
                <XCircleIcon className="h-5 w-5 text-text-secondary" />
            </button>
        </div>
    );
};

const NotificationsContainer: React.FC = () => {
    const context = useContext(NotificationContext);
    if (!context) return null;

    const { notifications, removeNotification } = context;

    return (
        <div className="fixed top-20 right-6 w-96 z-50 space-y-4">
            {notifications.map(n => (
                <NotificationItem key={n.id} notification={n} onDismiss={removeNotification} />
            ))}
        </div>
    );
};
// --- END NOTIFICATION CONTEXT ---


// --- START JOBS CONTEXT ---
interface JobsContextType {
    jobs: Job[];
    addJob: (jobInfo: { name: string; message: string; trigger?: () => Promise<{ job_id: string }> }) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const { addNotification } = useNotifier();
    const pollingIntervals = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        // Cleanup intervals on unmount
        return () => {
            pollingIntervals.current.forEach(intervalId => clearInterval(intervalId));
        };
    }, []);

    const addJob = useCallback(async (jobInfo: { name: string; message: string; trigger?: () => Promise<{ job_id: string }> }) => {
        const tempId = uuidv4();
        
        // --- Real Backend Job ---
        if (jobInfo.trigger) {
            const initialJob: Job = {
                id: tempId, name: jobInfo.name, message: jobInfo.message,
                status: 'running', progress: 0, startTime: Date.now(),
            };
            setJobs(prev => [initialJob, ...prev]);

            try {
                const { job_id } = await jobInfo.trigger();
                
                // Update job with real ID
                setJobs(prev => prev.map(j => j.id === tempId ? { ...j, id: job_id } : j));

                const intervalId = window.setInterval(async () => {
                    try {
                        const updatedJob = await getJobStatus(job_id);
                        setJobs(prev => prev.map(j => j.id === job_id ? { ...updatedJob, startTime: j.startTime } : j));
                        
                        if (updatedJob.status === 'succeeded' || updatedJob.status === 'failed' || updatedJob.status === 'cancelled') {
                            clearInterval(intervalId);
                            pollingIntervals.current.delete(job_id);
                            addNotification(`Job "${updatedJob.name}" ${updatedJob.status}.`, updatedJob.status === 'succeeded' ? 'success' : 'error');
                        }
                    } catch (pollError) {
                        console.error(`Polling error for job ${job_id}:`, pollError);
                        addNotification(`Could not get status for job "${jobInfo.name}".`, 'error');
                        clearInterval(intervalId);
                        pollingIntervals.current.delete(job_id);
                         setJobs(prev => prev.map(j => j.id === job_id ? { ...j, status: 'failed', message: 'Polling failed.' } : j));
                    }
                }, 2000);
                pollingIntervals.current.set(job_id, intervalId);

            } catch (triggerError) {
                console.error("Job trigger error:", triggerError);
                addNotification(`Failed to start job "${jobInfo.name}".`, 'error');
                setJobs(prev => prev.map(j => j.id === tempId ? { ...j, status: 'failed', message: 'Failed to trigger job.' } : j));
            }
        } 
        // --- Mock/Simulated Job ---
        else {
            const newJob: Job = {
                id: tempId, name: jobInfo.name, message: jobInfo.message,
                status: 'running', progress: 0, startTime: Date.now(),
            };
            setJobs(prevJobs => [newJob, ...prevJobs]);

            const duration = 2000 + Math.random() * 3000;
            const intervals = 20;
            let currentProgress = 0;
            const intervalId = setInterval(() => {
                currentProgress += 100 / intervals;
                setJobs(prevJobs => prevJobs.map(j => j.id === newJob.id ? { ...j, progress: Math.min(currentProgress, 100) } : j));
            }, duration / intervals);

            setTimeout(() => {
                clearInterval(intervalId);
                const finalStatus: Job['status'] = Math.random() > 0.2 ? 'succeeded' : 'failed';
                setJobs(prevJobs => prevJobs.map(j => j.id === newJob.id ? { ...j, status: finalStatus, progress: 100, message: `Job ${finalStatus}.` } : j));
                addNotification(`Job "${newJob.name}" ${finalStatus}.`, finalStatus === 'succeeded' ? 'success' : 'error');
            }, duration);
        }
    }, [addNotification]);

    const displayedJobs = useMemo(() => {
        return jobs
            .filter(j => !(j.status === 'succeeded' && (Date.now() - j.startTime) > 10000)) // Clear successful jobs after 10s
            .sort((a,b) => b.startTime - a.startTime);
    }, [jobs]);

    return (
        <JobsContext.Provider value={{ jobs: displayedJobs, addJob }}>
            {children}
        </JobsContext.Provider>
    );
};


export const useJobs = (): JobsContextType => {
    const context = useContext(JobsContext);
    if (context === undefined) {
        throw new Error('useJobs must be used within a JobsProvider');
    }
    return context;
};
// --- END JOBS CONTEXT ---


// --- START CHAT SESSION CONTEXT ---
interface ChatSessionContextType {
    sessions: ChatSession[];
    activeSession: ChatSession | null;
    isLoading: boolean;
    newChatRequested: boolean;
    
    switchSession: (session: ChatSession | null) => void;
    createSession: (name: string) => Promise<ChatSession | undefined>;
    renameSession: (sessionId: string, newName: string) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    requestNewChat: () => void;
    clearNewChatRequest: () => void;
}

export const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

const ChatSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newChatRequested, setNewChatRequested] = useState(false);
    const { addNotification } = useNotifier();

    useEffect(() => {
        const loadInitialSessions = async () => {
            setIsLoading(true);
            try {
                const data = await fetchChatSessions();
                setSessions(data);
                // We now let the Chat page decide whether to activate a session or create a new one.
            } catch (error) {
                addNotification("Failed to load chat sessions.", 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialSessions();
    }, [addNotification]);
    
    const switchSession = useCallback((session: ChatSession | null) => {
        setActiveSession(session);
    }, []);

    const createSession = useCallback(async (name: string) => {
        try {
            const newSession = await apiCreateChatSession(name);
            setSessions(prev => [newSession, ...prev]);
            setActiveSession(newSession);
            addNotification(`Created new session: "${name}"`, 'success');
            return newSession;
        } catch (error) {
            addNotification('Failed to create new chat session.', 'error');
            return undefined;
        }
    }, [addNotification]);
    
    const renameSession = useCallback(async (sessionId: string, newName: string) => {
        try {
            const updatedSession = await apiRenameChatSession(sessionId, newName);
            setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
            setActiveSession(prev => (prev?.id === sessionId ? updatedSession : prev));
            addNotification(`Session renamed to "${newName}"`, 'success');
        } catch (error) {
            addNotification('Failed to rename session.', 'error');
        }
    }, [addNotification]);

    const deleteSession = useCallback(async (sessionId: string) => {
        try {
            await apiDeleteChatSession(sessionId);
            addNotification(`Session deleted.`, 'success');
            
            setSessions(prevSessions => {
                const remainingSessions = prevSessions.filter(s => s.id !== sessionId);
                setActiveSession(prevActive => {
                    if (prevActive?.id === sessionId) {
                        return remainingSessions.length > 0 ? remainingSessions[0] : null;
                    }
                    return prevActive;
                });
                return remainingSessions;
            });
        } catch (error) {
            addNotification('Failed to delete session.', 'error');
        }
    }, [addNotification]);

    const requestNewChat = useCallback(() => setNewChatRequested(true), []);
    const clearNewChatRequest = useCallback(() => setNewChatRequested(false), []);

    const value = useMemo(() => ({
        sessions, activeSession, isLoading, switchSession, createSession,
        renameSession, deleteSession, newChatRequested,
        requestNewChat, clearNewChatRequest
    }), [sessions, activeSession, isLoading, switchSession, createSession, renameSession, deleteSession, newChatRequested, requestNewChat, clearNewChatRequest]);

    return (
        <ChatSessionContext.Provider value={value}>
            {children}
        </ChatSessionContext.Provider>
    );
};

export const useChatSession = (): ChatSessionContextType => {
    const context = useContext(ChatSessionContext);
    if (context === undefined) {
        throw new Error('useChatSession must be used within a ChatSessionProvider');
    }
    return context;
};
// --- END CHAT SESSION CONTEXT ---

// --- START SETTINGS CONTEXT ---
const findDiffs = (obj1: any, obj2: any, path: string = '', diffs: Set<string> = new Set()): Set<string> => {
    if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return diffs;
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    keys.forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        const val1 = get(obj1, key);
        const val2 = get(obj2, key);
        if (!isEqual(val1, val2)) {
            if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null && !Array.isArray(val1)) {
                 findDiffs(val1, val2, newPath, diffs);
            } else {
                diffs.add(newPath);
            }
        }
    });
    return diffs;
};

interface SettingsContextType {
    settings: MasterSettings | null;
    savedSettings: MasterSettings | null;
    loading: boolean;
    isDirty: boolean;
    dirtyFields: Set<string>;
    overrideFields: Set<string>;
    updateSetting: (path: string, value: any) => void;
    saveSettings: () => Promise<void>;
    resetSettings: () => void;
    switchProfile: (profileId: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<MasterSettings | null>(null);
    const [savedSettings, setSavedSettings] = useState<MasterSettings | null>(null);
    const [defaultSettings, setDefaultSettings] = useState<MasterSettings | null>(null);
    const [activeProfileId, setActiveProfileId] = useState<string>('default');
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotifier();

    const loadSettings = useCallback(async (profileId: string) => {
        setLoading(true);
        try {
            const [profileData, defaultData] = await Promise.all([
                fetchMasterSettings(profileId),
                fetchMasterSettings('default')
            ]);
            setSettings(cloneDeep(profileData));
            setSavedSettings(cloneDeep(profileData));
            setDefaultSettings(cloneDeep(defaultData));
        } catch (error) {
            addNotification("Failed to load settings, using fallback.", 'error');
            const fallbackSettings = MOCK_SETTINGS_STORE['default'];
            setSettings(cloneDeep(fallbackSettings));
            setSavedSettings(cloneDeep(fallbackSettings));
            setDefaultSettings(cloneDeep(fallbackSettings));
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        loadSettings(activeProfileId);
    }, [loadSettings, activeProfileId]);

    const switchProfile = useCallback((profileId: string) => {
        if (profileId !== activeProfileId) {
            setActiveProfileId(profileId);
        }
    }, [activeProfileId]);

    const updateSetting = useCallback((path: string, value: any) => {
        setSettings(prev => {
            if (!prev) return null;
            const newState = cloneDeep(prev);
            set(newState, path, value);
            return newState;
        });
    }, []);
    
    const saveSettings = useCallback(async () => {
        if (!settings) return;
        try {
            const result = await apiSaveMasterSettings(settings, activeProfileId);
            setSavedSettings(cloneDeep(settings));
            addNotification('Settings saved successfully.', 'success');
            if(result.restart_required) {
                addNotification("A restart is required for some changes to take effect.", 'warning');
            }
        } catch (error) {
            addNotification('Failed to save settings.', 'error');
        }
    }, [settings, addNotification, activeProfileId]);

    const resetSettings = useCallback(() => {
        if (savedSettings) {
            setSettings(cloneDeep(savedSettings));
        }
    }, [savedSettings]);

    const { isDirty, dirtyFields } = useMemo(() => {
        if (!settings || !savedSettings) return { isDirty: false, dirtyFields: new Set<string>() };
        const diffs = findDiffs(savedSettings, settings);
        return { isDirty: diffs.size > 0, dirtyFields: diffs };
    }, [settings, savedSettings]);

    const overrideFields = useMemo(() => {
        if (activeProfileId === 'default' || !settings || !defaultSettings) {
            return new Set<string>();
        }
        return findDiffs(defaultSettings, settings);
    }, [settings, defaultSettings, activeProfileId]);

    const value = useMemo(() => ({
        settings, savedSettings, loading, isDirty, dirtyFields, overrideFields,
        updateSetting, saveSettings, resetSettings, switchProfile
    }), [settings, savedSettings, loading, isDirty, dirtyFields, overrideFields, updateSetting, saveSettings, resetSettings, switchProfile]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
// --- END SETTINGS CONTEXT ---


// --- BREADCRUMB LOGIC ---
const PAGE_HIERARCHY: { [key in Page]?: { parent?: string; title?: string; parentPage?: Page } } = {
    [Page.Tasks]: { parent: 'Automation', parentPage: Page.Tasks },
    [Page.Agents]: { parent: 'Automation', parentPage: Page.Tasks },
    [Page.Workflows]: { parent: 'Automation', parentPage: Page.Tasks },
    [Page.Automation]: { parent: 'Automation', title: 'Schedules', parentPage: Page.Tasks },
    [Page.Connectors]: { parent: 'Automation', parentPage: Page.Tasks },
    [Page.Monitoring]: { parent: 'System', parentPage: Page.Monitoring },
    [Page.Logs]: { parent: 'System', title: 'Logs & Reports', parentPage: Page.Monitoring },
    [Page.Diagnostics]: { parent: 'System', parentPage: Page.Monitoring },
    [Page.Settings]: { parent: 'System', parentPage: Page.Monitoring },
    [Page.Help]: { parent: 'System', title: 'Help & Support', parentPage: Page.Monitoring },
    [Page.RAG]: { title: 'RAG Center' },
};

const getBreadcrumbPath = (page: Page): { title: string, page: Page | null }[] => {
    const path: { title: string, page: Page | null }[] = [];
    const details = PAGE_HIERARCHY[page];

    const title = details?.title || page;
    path.push({ title, page });

    if (details?.parent) {
        path.unshift({ title: details.parent, page: details.parentPage || null });
    }

    return path;
};


const PageRenderer: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const breadcrumb = getBreadcrumbPath(activePage);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard setActivePage={setActivePage} />;
      case Page.Tasks:
        return <Tasks setActivePage={setActivePage} />;
      case Page.Chat:
        return <Chat />;
      case Page.RAG:
        return <RAG setActivePage={setActivePage} />;
      case Page.Files:
        return <Files setActivePage={setActivePage} />;
      case Page.Monitoring:
        return <Monitoring setActivePage={setActivePage} />;
      case Page.Automation:
        return <Automation setActivePage={setActivePage} />;
      case Page.Settings:
        return <Settings />;
      case Page.Agents:
        return <Agents setActivePage={setActivePage} />;
      case Page.Workflows:
        return <Workflows setActivePage={setActivePage} />;
      case Page.Mail:
        return <Mail setActivePage={setActivePage} />;
      case Page.Logs:
        return <Logs />;
      case Page.Diagnostics:
        return <Diagnostics />;
      case Page.UserProfile:
        return <UserProfile />;
      case Page.Help:
        return <Help />;
      case Page.Connectors:
        return <Connectors setActivePage={setActivePage} />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  }, [activePage]);

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar breadcrumb={breadcrumb} setActivePage={setActivePage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
    const { settings, loading } = useSettings();

    useEffect(() => {
        const theme = settings?.ui.theme;
        const doc = document.documentElement;
        if (theme === 'Light') {
            doc.classList.add('light');
        } else {
            // Dark is the default, remove light class
            doc.classList.remove('light');
        }
    }, [settings?.ui.theme]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <ChatSessionProvider>
            <NotificationsContainer />
            <PageRenderer />
        </ChatSessionProvider>
    );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
        <JobsProvider>
            <SettingsProvider>
                <AppContent />
            </SettingsProvider>
        </JobsProvider>
    </NotificationProvider>
  );
};

export default App;