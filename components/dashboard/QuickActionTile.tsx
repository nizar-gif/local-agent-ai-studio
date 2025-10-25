import React from 'react';

interface QuickActionTileProps {
    icon: React.FC<{className: string}>;
    title: string;
    description?: string;
    onClick?: () => void;
    small?: boolean;
}

const QuickActionTile: React.FC<QuickActionTileProps> = ({ icon: Icon, title, description, onClick, small = false }) => {
    if (small) {
        return (
             <button onClick={onClick} className="w-full flex items-center text-left p-2 rounded-lg hover:bg-secondary transition-colors">
                <div className="p-2 bg-background rounded-md mr-3">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-text-primary">{title}</h4>
                    <p className="text-xs text-text-secondary">{description}</p>
                </div>
            </button>
        );
    }
    
    return (
        <button 
            onClick={onClick}
            className="bg-card p-4 rounded-lg border border-border text-center transform hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center aspect-square"
        >
            <Icon className="h-8 w-8 text-primary mb-2" />
            <h4 className="font-bold text-text-primary">{title}</h4>
        </button>
    );
};

export default QuickActionTile;