import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    unit?: string;
    children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, children }) => (
    <div className="bg-card p-4 rounded-lg border border-border transition-all hover:border-primary/50">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-primary mt-1">
            {value} <span className="text-lg text-text-secondary">{unit}</span>
        </p>
        {children}
    </div>
);

export default MetricCard;
