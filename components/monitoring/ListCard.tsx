import React from 'react';

interface ListCardProps {
    title: string;
    items: { name: string; value: string | number; status?: 'succeeded' | 'failed' }[];
}

const ListCard: React.FC<ListCardProps> = ({ title, items }) => (
    <div className="bg-card p-4 rounded-lg border border-border h-full">
        <p className="text-sm font-bold text-text-secondary mb-2">{title}</p>
        <ul className="space-y-1 text-sm">
            {items.map((item, i) => (
                <li key={i} className="flex justify-between p-1 rounded hover:bg-secondary">
                    <span className="text-text-primary truncate pr-4">{item.name}</span>
                    <span className={`font-mono font-semibold ${item.status === 'failed' ? 'text-red-400' : 'text-text-secondary'}`}>
                        {item.value}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default ListCard;
