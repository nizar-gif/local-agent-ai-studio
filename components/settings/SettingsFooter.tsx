import React from 'react';

interface SettingsFooterProps {
    isDirty: boolean;
    onApply: () => void;
    onReset: () => void;
    applyStatus: 'idle' | 'saving' | 'saved';
    isRestartRequired: boolean;
}

const SettingsFooter: React.FC<SettingsFooterProps> = ({ isDirty, onApply, onReset, applyStatus, isRestartRequired }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 pr-8 bg-secondary/80 backdrop-blur-sm border-t border-border rounded-b-lg">
            <div className="flex justify-end items-center gap-4">
                {isRestartRequired && (
                    <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md">
                        Restart Required
                    </span>
                )}
                 <button
                    onClick={onReset}
                    disabled={!isDirty || applyStatus === 'saving'}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Reset unsaved changes
                </button>
                <button
                    onClick={onApply}
                    disabled={!isDirty || applyStatus === 'saving'}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {applyStatus === 'saving' ? 'Applying...' : applyStatus === 'saved' ? 'Applied!' : 'Apply'}
                </button>
            </div>
        </div>
    );
};

export default SettingsFooter;
