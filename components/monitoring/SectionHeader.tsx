import React from 'react';

interface SectionHeaderProps {
    title: string;
    icon: React.FC<{className: string}>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => (
    <div className="border-b-2 border-primary/30 pb-2 mb-4 flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
    </div>
);

export default SectionHeader;
