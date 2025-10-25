import React from 'react';

interface ResourceChartProps {
    title: string;
    data: number[];
    label: string;
    alertThreshold?: number;
}

const ResourceChart: React.FC<ResourceChartProps> = ({ title, data, label, alertThreshold }) => {
    const latestValue = data[data.length - 1];
    const isAlert = alertThreshold && latestValue > alertThreshold;
    return (
        <div className={`bg-card p-4 rounded-lg border ${isAlert ? 'border-red-500/50' : 'border-border'}`}>
            <div className="flex justify-between items-baseline">
                <h4 className="text-md font-semibold text-text-primary">{title}</h4>
                <p className={`text-lg font-bold ${isAlert ? 'text-red-400' : 'text-primary'}`}>{latestValue}{label}</p>
            </div>
            <div className="mt-3 h-24 flex items-end gap-px relative">
                <div className="absolute bottom-0 left-0 w-full h-full opacity-10">
                    {data.map((_, i) => (
                        <div key={i} className={`absolute bottom-0 h-full border-r border-border/50`} style={{ left: `${(i / (data.length - 1)) * 100}%`}}></div>
                    ))}
                </div>
                 {alertThreshold && <div className="absolute left-0 w-full border-t border-dashed border-red-500/50" style={{bottom: `${alertThreshold}%`}}></div>}
                {data.map((d, i) => (
                    <div key={i} className={`absolute bottom-0 transition-all duration-300 ${isAlert ? 'bg-red-500/80' : 'bg-primary/70'}`} style={{ height: `${d}%`, left: `${(i / data.length) * 100}%`, width: `${100 / data.length}%` }}></div>
                ))}
            </div>
        </div>
    );
};

export default ResourceChart;
