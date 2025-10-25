import React, { useState, useEffect, useRef } from 'react';
import { fetchHealthStatus, fetchMasterSettings } from '../../services/api';
import { HealthComponent, Page, Profile, Job } from '../../types';
import { MagnifyingGlassIcon, ChevronDownIcon, BellIcon, UserCircleIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, CpuChipIcon } from '../shared/Icons';
import { useJobs, useNotifier } from '../../App';

interface TopbarProps {
  breadcrumb: { title: string; page: Page | null }[];
  setActivePage: (page: Page) => void;
}

const DropdownItem: React.FC<{icon: React.FC<any>, text: string, onClick: () => void}> = ({ icon: Icon, text, onClick }) => (
    <button onClick={onClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-secondary">
        <Icon className="h-5 w-5 text-text-secondary" />
        <span>{text}</span>
    </button>
);

const JobItem: React.FC<{ job: Job }> = ({ job }) => {
    const statusColor = {
        running: 'bg-blue-500',
        succeeded: 'bg-green-500',
        failed: 'bg-red-500',
        cancelled: 'bg-gray-500',
    }[job.status];

    return (
        <div className="p-3 border-b border-border last:border-b-0">
            <div className="flex justify-between items-center text-sm">
                <p className="font-bold truncate pr-2">{job.name}</p>
                <p className="text-xs text-text-secondary capitalize flex-shrink-0">{job.status}</p>
            </div>
            <div className="w-full bg-background rounded-full h-1.5 mt-2">
                <div className={`${statusColor} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${job.progress}%` }}></div>
            </div>
        </div>
    );
};


const Topbar: React.FC<TopbarProps> = ({ breadcrumb, setActivePage }) => {
    const { jobs } = useJobs();
    const { addNotification } = useNotifier();
    const [health, setHealth] = useState<HealthComponent[]>([]);
    const [systemMode, setSystemMode] = useState<'LOCAL' | 'CLOUD' | 'HYBRID'>('LOCAL');
    const [modeStatus, setModeStatus] = useState<'healthy' | 'warnings' | 'errors'>('healthy');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
    const [modeMenuOpen, setModeMenuOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const jobsMenuRef = useRef<HTMLDivElement>(null);
    const modeMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const runningJobsCount = jobs.filter(j => j.status === 'running').length;

    useEffect(() => {
        fetchHealthStatus().then(data => {
            setHealth(data);
            if (data.some(c => c.status === 'Error')) setModeStatus('errors');
            else if (data.some(c => c.status === 'Warning')) setModeStatus('warnings');
            else setModeStatus('healthy');
        }).catch(err => {
            console.error("Failed to fetch health status:", err);
            setModeStatus('errors');
        });

        fetchMasterSettings().then(settings => {
            setProfiles(settings.workspace.profiles);
            const currentProfile = settings.workspace.profiles.find(p => p.id === settings.workspace.profile);
            setActiveProfile(currentProfile || null);
        }).catch(err => {
             console.error("Failed to fetch master settings for topbar:", err);
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
            if (jobsMenuRef.current && !jobsMenuRef.current.contains(event.target as Node)) {
                setJobsMenuOpen(false);
            }
            if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
                setModeMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const modeColor = {
        healthy: 'bg-green-500/20 text-green-300 border-green-500/30',
        warnings: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        errors: 'bg-red-500/20 text-red-300 border-red-500/30',
    }[modeStatus];
    

  return (
    <header className="flex-shrink-0 bg-secondary px-6 py-3 flex justify-between items-center border-b border-border">
      {/* Left side: Breadcrumb */}
      <div className="flex items-center gap-2 text-2xl font-semibold">
          {breadcrumb.map((item, index) => (
              <React.Fragment key={item.title}>
                  {index > 0 && <span className="text-text-secondary">/</span>}
                  {index < breadcrumb.length - 1 && item.page ? (
                      <button
                          onClick={() => setActivePage(item.page!)}
                          className="text-text-secondary hover:text-primary transition-colors"
                      >
                          {item.title}
                      </button>
                  ) : (
                      <span className={index === breadcrumb.length - 1 ? "text-text-primary" : "text-text-secondary"}>
                          {item.title}
                      </span>
                  )}
              </React.Fragment>
          ))}
      </div>
      
      {/* Right side: Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <div ref={profileMenuRef} className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-2 p-1 rounded-md hover:bg-background">
                    <span className="text-sm">Profile: <span className="font-semibold">{activeProfile?.name}</span></span>
                    <ChevronDownIcon className="h-4 w-4 text-text-secondary"/>
                </button>
                {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-10">
                        {profiles.map(profile => (
                            <button 
                                key={profile.id} 
                                onClick={() => { setActiveProfile(profile); setProfileMenuOpen(false); }} 
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                    profile.id === activeProfile?.id 
                                    ? 'bg-primary text-white' 
                                    : 'text-text-primary hover:bg-secondary'
                                }`}
                            >
                                {profile.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div ref={modeMenuRef} className="relative">
                <button onClick={() => setModeMenuOpen(!modeMenuOpen)} className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border transition-colors hover:bg-opacity-40 ${modeColor}`}>
                    <span>{systemMode}</span>
                    <ChevronDownIcon className="h-3 w-3" />
                </button>
                {modeMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-lg z-10">
                        {(['LOCAL', 'CLOUD', 'HYBRID'] as const).map(mode => (
                            <button 
                                key={mode} 
                                onClick={() => {
                                    setSystemMode(mode);
                                    setModeMenuOpen(false);
                                    addNotification(`System mode switched to ${mode}`, 'success');
                                }} 
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                    mode === systemMode
                                    ? 'bg-primary text-white' 
                                    : 'text-text-primary hover:bg-secondary'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Quick Search (Ctrl+K)"
                className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 text-sm focus:ring-primary focus:border-primary transition"
            />
        </div>

        <div ref={jobsMenuRef} className="relative">
            <button onClick={() => setJobsMenuOpen(!jobsMenuOpen)} className="p-2 rounded-full hover:bg-background relative" title="Active Jobs">
                <CpuChipIcon className="h-6 w-6 text-text-secondary"/>
                {runningJobsCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-primary rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                        {runningJobsCount}
                    </span>
                )}
            </button>
            {jobsMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-10">
                     <div className="px-3 py-2 font-semibold text-sm border-b border-border">Active Jobs</div>
                        <div className="max-h-80 overflow-y-auto">
                            {jobs.length === 0 ? (
                                <p className="text-sm text-text-secondary text-center p-4">No active jobs.</p>
                            ) : (
                                jobs.map(job => <JobItem key={job.id} job={job} />)
                            )}
                        </div>
                        <div className="p-2 border-t border-border">
                            <button
                                onClick={() => { setActivePage(Page.Tasks); setJobsMenuOpen(false); }}
                                className="w-full text-center text-sm font-semibold text-primary hover:bg-secondary rounded-md py-1.5"
                            >
                                View All Tasks
                            </button>
                        </div>
                </div>
            )}
        </div>

        <div ref={userMenuRef} className="relative flex items-center gap-2">
             <button className="p-2 rounded-full hover:bg-background">
                <BellIcon className="h-6 w-6 text-text-secondary"/>
            </button>
             <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-full hover:bg-background"
                title="User Menu"
             >
                <UserCircleIcon className="h-6 w-6 text-text-secondary"/>
            </button>
            {userMenuOpen && (
                 <div className="absolute right-0 mt-10 w-48 bg-card border border-border rounded-md shadow-lg z-10 py-1">
                    <DropdownItem icon={UserCircleIcon} text="User Profile" onClick={() => { setActivePage(Page.UserProfile); setUserMenuOpen(false); }} />
                    <DropdownItem icon={QuestionMarkCircleIcon} text="Help" onClick={() => { setActivePage(Page.Help); setUserMenuOpen(false); }} />
                    <div className="border-t border-border my-1"></div>
                    <DropdownItem icon={ArrowLeftOnRectangleIcon} text="Logout" onClick={() => { /* Logout action */ setUserMenuOpen(false); }} />
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;