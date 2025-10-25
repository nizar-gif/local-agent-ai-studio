

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchTaskExecutions, fetchTasks, createTaskExecution, cancelTaskExecution } from '../services/api';
import { TaskExecution, Task, Page, Job } from '../types';
import TaskHeader from '../components/tasks/TaskHeader';
import TaskTable from '../components/tasks/TaskTable';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import TaskCreationModal from '../components/tasks/TaskCreationModal';
import { useJobs, useNotifier, Spinner } from '../App';
import { v4 as uuidv4 } from 'uuid';

interface TasksProps {
  setActivePage: (page: Page) => void;
}

const Tasks: React.FC<TasksProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [tasks, setTasks] = useState<TaskExecution[]>([]);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<TaskExecution | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [initialLoad, setInitialLoad] = useState(true);

    const loadTasks = useCallback(async () => {
        if (initialLoad) {
            setLoading(true);
        }
        try {
            const [executionsData, availableTasksData] = await Promise.all([fetchTaskExecutions(), fetchTasks()]);
            const sortedTasks = executionsData.sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
            setTasks(sortedTasks);
            setAvailableTasks(availableTasksData);
            if(sortedTasks.length > 0) {
              setSelectedTask(prev => sortedTasks.find(t => t.id === prev?.id) || sortedTasks[0]);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load tasks.', 'error');
        } finally {
            if (initialLoad) {
                setLoading(false);
                setInitialLoad(false);
            }
        }
    }, [addNotification, initialLoad]);

    useEffect(() => {
        loadTasks();
        const interval = setInterval(loadTasks, 5000); // Poll for live updates
        return () => clearInterval(interval);
    }, [loadTasks]);
    
    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        if (typeFilter !== 'All') {
            filtered = filtered.filter(task => task.type === typeFilter);
        }

        if (filter) {
            const lowercasedFilter = filter.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(lowercasedFilter) ||
                task.agent.toLowerCase().includes(lowercasedFilter) ||
                task.status.toLowerCase().includes(lowercasedFilter) ||
                task.type.toLowerCase().includes(lowercasedFilter)
            );
        }
        return filtered;
    }, [tasks, filter, typeFilter]);

    const handleClearCompleted = () => {
        setTasks(prev => prev.filter(t => t.status === 'Running' || t.status === 'Waiting'));
        setSelectedTask(null);
    };
    
    const handleCancelTask = async (taskId: string) => {
        const originalTasks = tasks;
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: 'Cancelled'} : t));
        try {
            await cancelTaskExecution(taskId);
            addNotification(`Task ${taskId} cancellation requested.`, 'success');
        } catch (error) {
            addNotification(error instanceof Error ? error.message : `Failed to cancel task ${taskId}.`, 'error');
            setTasks(originalTasks); // Revert on failure
        }
    };
    
    const handleRetryTask = (taskId: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: 'Running', progress: 0, duration: '0s...'} : t));
    };
    
    const handlePauseResumeTask = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return {...t, status: t.status === 'Paused' ? 'Running' : 'Paused'};
            }
            return t;
        }));
    }

    const handleAddTask = async (taskDetails: { title: string, agent: string, type: TaskExecution['type'], priority: TaskExecution['priority'] }) => {
        try {
            await createTaskExecution(taskDetails);
            addNotification(`Task "${taskDetails.title}" created successfully.`, 'success');
            loadTasks(); // Immediately fetch the updated list
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to create task.', 'error');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="flex flex-col h-full -m-6">
            {isModalOpen && <TaskCreationModal availableTasks={availableTasks} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />}

            <TaskHeader
                tasks={tasks}
                onNewTask={() => setIsModalOpen(true)}
                onClearCompleted={handleClearCompleted}
                filter={filter}
                setFilter={setFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                onRefresh={loadTasks}
            />
            
            <div className="flex-1 flex min-h-0">
                <div className="w-full lg:w-3/5 border-r border-border flex flex-col">
                    <TaskTable 
                        tasks={filteredTasks}
                        selectedTask={selectedTask}
                        onSelectTask={setSelectedTask}
                        onDoubleClickTask={() => setActivePage(Page.Chat)}
                        onCancelTask={handleCancelTask}
                        onRetryTask={handleRetryTask}
                        setActivePage={setActivePage}
                    />
                </div>
                
                <div className="hidden lg:block lg:w-2/5 overflow-y-auto">
                   {selectedTask ? (
                        <TaskDetailPanel 
                            task={selectedTask} 
                            setActivePage={setActivePage}
                            onCancel={() => handleCancelTask(selectedTask.id)}
                            onRetry={() => handleRetryTask(selectedTask.id)}
                            onPauseResume={() => handlePauseResumeTask(selectedTask.id)}
                        />
                    ) : (
                        <div className="p-8 text-center text-text-secondary">Select a task to see details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;