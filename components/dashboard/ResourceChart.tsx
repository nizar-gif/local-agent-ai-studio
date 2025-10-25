import React from 'react';

interface ResourceChartProps {
    title: string;
    data1: number[];
    data2?: number[];
    onDoubleClick?: () => void;
}

const ResourceChart: React.FC<ResourceChartProps> = ({ title, data1, data2, onDoubleClick }) => {
    const latestValue1 = data1[data1.length - 1];
    const latestValue2 = data2 && data2[data2.length - 1];
    const maxVal = Math.max(...data1, ...(data2 || []), 1);
    const tooltipTitle = `${title}: ${latestValue1}% ${latestValue2 !== undefined ? `/ ${latestValue2}%` : ''} | Double-click to expand`;


    return (
        <div className="bg-card p-4 rounded-lg border border-border" onDoubleClick={onDoubleClick} title={tooltipTitle}>
            <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
            <div className="flex items-baseline gap-4 mt-1">
                <p className="text-2xl font-bold text-primary">{latestValue1}%</p>
                {latestValue2 !== undefined && <p className="text-lg font-semibold text-blue-400">{latestValue2}%</p>}
            </div>
            <div className="mt-3 h-20 flex items-end gap-px relative">
                {data1.map((d, i) => (
                    <div key={`d1-${i}`} className="w-full bg-primary" style={{ height: `${(d / 100) * 100}%`, position: 'absolute', left: `${(i / data1.length) * 100}%`, bottom: 0, width: `${100 / data1.length}%` }}></div>
                ))}
                 {data2 && data2.map((d, i) => (
                    <div key={`d2-${i}`} className="w-full bg-blue-400 opacity-70" style={{ height: `${(d / 100) * 100}%`, position: 'absolute', left: `${(i / data2.length) * 100}%`, bottom: 0, width: `${100 / data2.length}%` }}></div>
                ))}
            </div>
        </div>
    );
};

export default ResourceChart;