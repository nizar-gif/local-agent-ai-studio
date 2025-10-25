import React from 'react';
import { UserActivitySummary } from '../../types';
import ProfileCard from './ProfileCard';

interface ActivitySummaryProps {
    summary: UserActivitySummary;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-secondary p-3 rounded-md text-center">
        <p className="text-xs text-text-secondary uppercase font-semibold">{label}</p>
        <p className="text-xl font-bold text-primary">{value}</p>
    </div>
);

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ summary }) => {
    return (
        <ProfileCard title="Activity Summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label="Total Tasks" value={summary.totalTasks} />
                <StatItem label="Token Usage" value={`${(summary.tokenUsage / 1000).toFixed(1)}k`} />
                <StatItem label="RAG Hits" value={summary.ragHits} />
                <StatItem label="Favorite Agent" value={summary.favoriteAgent} />
            </div>
        </ProfileCard>
    );
};

export default ActivitySummary;
