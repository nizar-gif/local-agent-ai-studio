

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDiagnosticTests, runDiagnostics } from '../services/api';
import { DiagnosticTest, DiagnosticResult, Job } from '../types';
import DiagnosticsHeader from '../components/diagnostics/DiagnosticsHeader';
import TestCategory from '../components/diagnostics/TestCategory';
import DiagnosticsCard from '../components/diagnostics/DiagnosticsCard';
import DiagnosticsResultModal from '../components/diagnostics/DiagnosticsResultModal';
import SelectTestsModal from '../components/diagnostics/SelectTestsModal';
import { useJobs, useNotifier, Spinner } from '../App';
import { CpuChipIcon, LinkIcon, BeakerIcon } from '../components/shared/Icons';

interface DiagnosticsProps {}

const categoryIcons = {
    'System Health': CpuChipIcon,
    'Connectivity': LinkIcon,
    'Data & AI Validation': BeakerIcon,
};

const Diagnostics: React.FC<DiagnosticsProps> = () => {
    const { addJob } = useJobs();
    const { addNotification } = useNotifier();
    const [allTests, setAllTests] = useState<DiagnosticTest[]>([]);
    const [testResults, setTestResults] = useState<Record<string, DiagnosticResult>>({});
    const [loading, setLoading] = useState(true);
    const [isTesting, setIsTesting] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [lastRun, setLastRun] = useState<Date | null>(null);
    const [selectedTestIds, setSelectedTestIds] = useState<Set<string>>(new Set());

    const initializeTests = useCallback((tests: DiagnosticTest[]) => {
        const initialResults: Record<string, DiagnosticResult> = {};
        const initialSelectedIds = new Set<string>();
        tests.forEach(test => {
            initialResults[test.id] = { ...test, status: 'pending', details: 'Not yet run.' };
            initialSelectedIds.add(test.id);
        });
        setTestResults(initialResults);
        setSelectedTestIds(initialSelectedIds);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const tests = await fetchDiagnosticTests();
                setAllTests(tests);
                initializeTests(tests);
            } catch (error) {
                addNotification(error instanceof Error ? error.message : 'Failed to load diagnostic tests.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [initializeTests, addNotification]);

    const overallStatus = useMemo(() => {
        const results = Object.values(testResults).filter((r): r is DiagnosticResult => r.status !== 'pending' && r.status !== 'running');
        if (results.length === 0 && Object.values(testResults).some(r => r.status === 'pending')) return 'pending';
        if (results.some(r => r.status === 'error')) return 'critical';
        if (results.some(r => r.status === 'warning')) return 'warnings';
        if (results.every(r => r.status === 'success')) return 'healthy';
        return 'pending';
    }, [testResults]);

    const handleRunSelected = async () => {
        if (selectedTestIds.size === 0) {
            addNotification("Please select at least one test to run.", 'warning');
            return;
        }

        addJob({
            name: `Run ${selectedTestIds.size} Diagnostic(s)`,
            message: 'Triggering diagnostic job on backend...',
            trigger: () => runDiagnostics(Array.from(selectedTestIds)),
        });
        
        setLastRun(new Date());
        // In a real app, you might show a result modal once the job completes,
        // which could be handled by listening to job status updates from the JobsContext.
    };
    
    // This function is now for running single tests ad-hoc, separate from the main job runner
    const runSingleTest = (testId: string) => {
         addJob({
            name: `Run Diagnostic: ${allTests.find(t => t.id === testId)?.name || testId}`,
            message: 'Triggering single test run...',
            trigger: () => runDiagnostics([testId]),
        });
    };

    const testsByCategory = useMemo(() => {
        return allTests.reduce((acc, test) => {
            if (!acc[test.category]) {
                acc[test.category] = [];
            }
            acc[test.category].push(test);
            return acc;
        }, {} as Record<DiagnosticTest['category'], DiagnosticTest[]>);
    }, [allTests]);
    
    return (
        <div className="space-y-8">
            {isResultModalOpen && <DiagnosticsResultModal results={Object.values(testResults).filter((r: DiagnosticResult) => r.status !== 'pending' && r.status !== 'running')} onClose={() => setIsResultModalOpen(false)} />}
            {isSelectModalOpen && (
                <SelectTestsModal
                    onClose={() => setIsSelectModalOpen(false)}
                    allTests={allTests}
                    testsByCategory={testsByCategory}
                    selectedTestIds={selectedTestIds}
                    setSelectedTestIds={setSelectedTestIds}
                />
            )}
            
            <DiagnosticsHeader 
                onRunAll={handleRunSelected} 
                onSelectTests={() => setIsSelectModalOpen(true)}
                isTesting={isTesting}
                status={overallStatus}
                lastRun={lastRun}
                selectedCount={selectedTestIds.size}
                totalCount={allTests.length}
            />
            
            {loading ? <Spinner /> : (
                Object.entries(testsByCategory).map(([category, tests]: [any, DiagnosticTest[]]) => (
                    <TestCategory key={category} title={category} icon={categoryIcons[category as keyof typeof categoryIcons]}>
                        {tests.map(test => (
                            <DiagnosticsCard 
                                key={test.id} 
                                result={testResults[test.id]} 
                                onRun={() => runSingleTest(test.id)}
                                isTesting={isTesting}
                            />
                        ))}
                    </TestCategory>
                ))
            )}
        </div>
    );
};

export default Diagnostics;