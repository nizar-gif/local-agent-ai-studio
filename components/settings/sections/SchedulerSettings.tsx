import React, { useState, useEffect } from 'react';
import { SchedulerSettings, SchedulerJob } from '../../../types';
import { SectionTitle, Toggle, InputField } from '../fields';
import { fetchSchedulerJobs } from '../../../services/api';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: SchedulerSettings;
}

const SchedulerSettings: React.FC<Props> = ({ settings, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
  const [jobs, setJobs] = useState<SchedulerJob[]>([]);

  useEffect(() => {
    fetchSchedulerJobs().then(setJobs);
  }, []);

  const handleGlobalToggle = (name: keyof SchedulerSettings, checked: boolean) => {
    handleFieldChange(`scheduler.${name}`, checked);
  };
  
  const handleJobToggle = (jobId: string) => {
    // This is local state for demonstration, in a real app this would call an API
    setJobs(prev => prev.map(j => j.id === jobId ? {...j, enabled: !j.enabled} : j));
  };

  return (
    <div>
      <SectionTitle
        title="Automation & Scheduler"
        subtitle="Control the scheduler, health checks, and auto-recovery settings."
        searchTerm={searchTerm}
      />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Toggle
                path="scheduler.schedulerEnabled"
                label="Scheduler Enabled" 
                checked={settings.schedulerEnabled} 
                onChange={(c) => handleGlobalToggle('schedulerEnabled', c)} 
                name="schedulerEnabled" 
                isDirty={dirtyFields.has('scheduler.schedulerEnabled')} 
                isOverride={overrideFields.has('scheduler.schedulerEnabled')}
                onReset={() => handleResetField('scheduler.schedulerEnabled')} 
                searchTerm={searchTerm}
            />
            <InputField
              path="scheduler.maxConcurrentJobs"
              label="Max Concurrent Jobs"
              type="number"
              value={settings.maxConcurrentJobs}
              onChange={(e) => handleFieldChange('scheduler.maxConcurrentJobs', parseInt(e.target.value, 10) || 0)}
              isDirty={dirtyFields.has('scheduler.maxConcurrentJobs')}
              isOverride={overrideFields.has('scheduler.maxConcurrentJobs')}
              onReset={() => handleResetField('scheduler.maxConcurrentJobs')}
              searchTerm={searchTerm}
            />
        </div>
        
        <div>
            <h4 className="font-semibold text-lg mb-4">Scheduled Jobs</h4>
            <div className="overflow-x-auto bg-secondary/50 border border-border rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-border">
                        <tr>
                            <th className="p-3 text-sm">Job Type</th>
                            <th className="p-3 text-sm">Trigger</th>
                            <th className="p-3 text-sm">Enabled</th>
                            <th className="p-3 text-sm">Next Run</th>
                            <th className="p-3 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="border-t border-border">
                                <td className="p-3 font-semibold">{job.jobType}</td>
                                <td className="p-3 font-mono text-xs">{job.triggerValue}</td>
                                <td className="p-3"><Toggle name={`job-${job.id}`} path="" label="" checked={job.enabled} onChange={() => handleJobToggle(job.id)} /></td>
                                <td className="p-3 text-xs text-text-secondary">{job.nextRun ? new Date(job.nextRun).toLocaleString() : 'N/A'}</td>
                                <td className="p-3 space-x-3">
                                    <button className="text-xs font-semibold text-primary hover:text-primary-hover">Run Now</button>
                                    <button className="text-xs font-semibold text-text-secondary hover:text-text-primary">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerSettings;