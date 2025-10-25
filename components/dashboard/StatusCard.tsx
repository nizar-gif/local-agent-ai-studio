import React from 'react';

interface Metric {
    label: string;
    value: string;
    color?: string;
}

interface StatusCardProps {
    title: string;
    status: 'ok' | 'warning' | 'error';
    metrics: Metric[];
    chartData?: number[];
    chartLabel?: string;
    onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, status, metrics, chartData, chartLabel, onClick }) => {
    const borderColor = {
        ok: 'border-green-500/30',
        warning: 'border-yellow-500/30',
        error: 'border-red-500/30',
    }[status];

    const latestChartValue = chartData && chartData[chartData.length - 1];

    return (
        <div 
            onClick={onClick} 
            title={`Last updated: ${new Date().toLocaleTimeString()}. Click to navigate.`}
            className={`bg-card p-4 rounded-lg border ${borderColor} transition-all duration-300 hover:bg-secondary cursor-pointer`}
        >
            <h3 className="font-bold text-text-secondary mb-3">{title}</h3>
            <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {metrics.map(metric => (
                        <div key={metric.label}>
                            <p className="text-xs text-text-secondary">{metric.label}</p>
                            <p className={`text-lg font-semibold ${metric.color || 'text-text-primary'}`}>{metric.value}</p>
                        </div>
                    ))}
                </div>
                {chartData && (
                     <div className="w-28 text-right flex-shrink-0 ml-4">
                        <p className="text-lg font-semibold text-text-primary">{latestChartValue}<span className="text-xs text-text-secondary ml-1">{chartLabel?.split(' ')[1]}</span></p>
                        <div className="mt-1 h-8 flex items-end gap-px">
                            {chartData.slice(-10).map((d, i) => (
                                <div key={i} className="w-full bg-primary/50" style={{height: `${(d / Math.max(...chartData, 1)) * 100}%`}}></div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default StatusCard;