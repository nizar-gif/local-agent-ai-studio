import React from 'react';
import { ChartBarIcon, ExclamationTriangleIcon, CpuChipIcon } from '../shared/Icons';

const ReportCard: React.FC<{ icon: React.FC<{ className: string }>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors">
        <div className="flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
        </div>
        <button className="mt-4 text-sm font-semibold text-primary hover:underline">Generate Report</button>
    </div>
);

const ReportsView: React.FC = () => {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold">Reports</h2>
                <p className="text-text-secondary mt-2 mb-8">
                    Generate structured, auto-generated summaries for system performance, errors, and agent activity. Reports can be scheduled via the Automation page.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReportCard 
                        icon={ChartBarIcon}
                        title="System Summary Report"
                        description="Aggregated metrics for CPU, Memory, Agent activity, and LLM latency over a selected period."
                    />
                    <ReportCard 
                        icon={ExclamationTriangleIcon}
                        title="Error Report"
                        description="A summary of top recurring errors, grouped by subsystem, with frequency counts."
                    />
                     <ReportCard 
                        icon={CpuChipIcon}
                        title="Performance Report"
                        description="Analysis of average task durations, LLM token throughput, and scheduler job completion times."
                    />
                     <ReportCard 
                        icon={ChartBarIcon}
                        title="Custom Report Builder"
                        description="Choose metrics, filters, and visualizations to create and export your own reports."
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportsView;