
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWorkflows } from '../services/api';
import { Workflow, Page, Job } from '../types';
import WorkflowHeader from '../components/workflows/WorkflowHeader';
import WorkflowTable from '../components/workflows/WorkflowTable';
import WorkflowCanvas from '../components/workflows/WorkflowCanvas';
import NewWorkflowModal from '../components/workflows/NewWorkflowModal';
import { useJobs, useNotifier, Spinner } from '../App';

interface WorkflowsProps {
    setActivePage: (page: Page) => void;
}

const Workflows: React.FC<WorkflowsProps> = ({ setActivePage }) => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
    const [selection, setSelection] = useState<string[]>([]);

    const loadWorkflows = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchWorkflows();
            setWorkflows(data);
            if (data.length > 0 && !selectedWorkflow) {
                setSelectedWorkflow(data[0]);
            }
        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'Failed to load workflows.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification, selectedWorkflow]);

    useEffect(() => {
        loadWorkflows();
    }, [loadWorkflows]);

    if (loading) return <Spinner />;
    
    const activeWorkflows = workflows.filter(w => w.status === 'Active').length;
    const draftWorkflows = workflows.filter(w => w.status === 'Draft').length;

    return (
        <div className="flex flex-col h-full -m-6">
            {isModalOpen && <NewWorkflowModal onClose={() => setIsModalOpen(false)} />}

            <WorkflowHeader
                stats={{ active: activeWorkflows, draft: draftWorkflows, scheduled: workflows.filter(w => w.type === 'Scheduled').length }}
                onNewWorkflow={() => setIsModalOpen(true)}
                selection={selection}
            />

            <div className="flex-1 flex min-h-0">
                <div className="w-2/5 flex flex-col border-r border-border">
                    <WorkflowTable 
                        workflows={workflows} 
                        onSelectWorkflow={setSelectedWorkflow} 
                        selectedWorkflow={selectedWorkflow} 
                        selection={selection}
                        onSelectionChange={setSelection}
                        setActivePage={setActivePage}
                    />
                </div>
                <div className="w-3/5 flex flex-col">
                    <WorkflowCanvas workflow={selectedWorkflow} />
                </div>
            </div>
        </div>
    );
};

export default Workflows;
