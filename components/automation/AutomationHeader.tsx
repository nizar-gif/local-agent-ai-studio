

import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, PauseIcon, PlayIcon, ArrowUpOnSquareIcon, ArrowDownTrayIcon, ArrowPathIcon, Cog6ToothIcon, ChevronDownIcon } from '../shared/Icons';
import { Job, Page, SchedulerJob } from '../../types';
import { useJobs } from '../../App';

interface AutomationHeaderProps {
    onNewAutomation: () => void;
    jobs: SchedulerJob[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onRunJob: (jobId: string) => void;
    schedulerStatus: 'running' | 'paused' | 'error';
    setActivePage: (page: Page) => void;
}

const AutomationHeader: React.FC<AutomationHeaderProps> = ({ 
    onNewAutomation, jobs, searchTerm, onSearchChange, onRunJob, schedulerStatus, setActivePage
}) => {
    const { addJob } = useJobs();
    const [runDropdownOpen, setRunDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const nextJobIn = '48s'; // This would come from a live API endpoint

    const statusClasses = {
        running: { text: 'text-green-300', bg: 'bg-green-500/20', indicator: '🟢' },
        paused: { text: 'text-yellow-300', bg: 'bg-yellow-500/20', indicator: '🟡' },
        error: { text: 'text-red-300', bg: 'bg-red-500/20', indicator: '🔴' },
    }[schedulerStatus];
    
    const handleAction = (name: string, message: string) => {
        addJob({
            name,
            message,
        });
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setRunDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 bg-secondary px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">Automation Hub</h2>
                <div className="flex items-center gap-4 text-sm mt-1 text-text-secondary flex-wrap">
                    <div className={`px-2 py-0.5 text-xs font-bold rounded-md ${statusClasses.bg} ${statusClasses.text}`}>
                        {statusClasses.indicator} Scheduler {schedulerStatus.charAt(0).toUpperCase() + schedulerStatus.slice(1)}
                    </div>
                    <span>Next job in: <span className="font-mono text-text-primary">{nextJobIn}</span></span>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                 <input
                    type="text"
                    placeholder="Filter jobs..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-background border border-border rounded-lg px-4 py-2 w-56 text-sm focus:ring-primary focus:border-primary transition"
                />
                <ActionButton icon={PlusIcon} text="New Automation" onClick={onNewAutomation} primary />
                
                <div ref={dropdownRef} className="relative">
                     <button onClick={() => setRunDropdownOpen(!runDropdownOpen)} className="flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors bg-card border border-border text-text-secondary hover:bg-background hover:text-text-primary">
                        <ArrowPathIcon className="h-5 w-5" />
                        <span>Run Job Now</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {runDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                            {jobs.map(job => (
                                <button key={job.id} onClick={() => { onRunJob(job.id); setRunDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                                    {job.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <ActionButton icon={Cog6ToothIcon} text="Configure" onClick={() => setActivePage(Page.Settings)} />
            </div>
        </header>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{className: string}>; text: string; onClick: () => void; primary?: boolean }> = ({ icon: Icon, text, onClick, primary = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors
            ${primary 
                ? 'bg-primary hover:bg-primary-hover text-white' 
                : 'bg-card border border-border text-text-secondary hover:bg-background hover:text-text-primary'}
        `}>
        <Icon className="h-5 w-5" />
        {text && <span>{text}</span>}
    </button>
);

export default AutomationHeader;