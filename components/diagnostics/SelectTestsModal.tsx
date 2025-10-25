
import React from 'react';
import { DiagnosticTest } from '../../types';
import { XCircleIcon } from '../shared/Icons';

interface SelectTestsModalProps {
    onClose: () => void;
    allTests: DiagnosticTest[];
    testsByCategory: Record<string, DiagnosticTest[]>;
    selectedTestIds: Set<string>;
    setSelectedTestIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const SelectTestsModal: React.FC<SelectTestsModalProps> = ({ onClose, allTests, testsByCategory, selectedTestIds, setSelectedTestIds }) => {

    const handleCategoryToggle = (categoryTests: DiagnosticTest[], isChecked: boolean) => {
        setSelectedTestIds(prev => {
            const newSet = new Set(prev);
            categoryTests.forEach(test => {
                if (isChecked) {
                    newSet.add(test.id);
                } else {
                    newSet.delete(test.id);
                }
            });
            return newSet;
        });
    };

    const handleTestToggle = (testId: string, isChecked: boolean) => {
        setSelectedTestIds(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(testId);
            } else {
                newSet.delete(testId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        setSelectedTestIds(new Set(allTests.map(t => t.id)));
    };

    const handleDeselectAll = () => {
        setSelectedTestIds(new Set());
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl flex flex-col max-h-full">
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Select Diagnostic Tests</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                        <XCircleIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {Object.entries(testsByCategory).map(([category, tests]: [string, DiagnosticTest[]]) => {
                        const allInCategorySelected = tests.every(t => selectedTestIds.has(t.id));
                        return (
                            <div key={category}>
                                <div className="flex items-center p-2 bg-secondary rounded-t-md">
                                    <input
                                        type="checkbox"
                                        checked={allInCategorySelected}
                                        onChange={(e) => handleCategoryToggle(tests, e.target.checked)}
                                        className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"
                                    />
                                    <label className="ml-3 font-semibold">{category}</label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 p-2 bg-secondary/50 rounded-b-md">
                                    {tests.map(test => (
                                        <label key={test.id} className="flex items-center p-2 rounded hover:bg-background space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedTestIds.has(test.id)}
                                                onChange={e => handleTestToggle(test.id, e.target.checked)}
                                                className="h-4 w-4 rounded bg-background border-border text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{test.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <footer className="p-4 border-t border-border flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={handleSelectAll} className="bg-secondary hover:bg-background px-3 py-1.5 text-sm rounded-md font-semibold">Select All</button>
                        <button onClick={handleDeselectAll} className="bg-secondary hover:bg-background px-3 py-1.5 text-sm rounded-md font-semibold">Deselect All</button>
                    </div>
                    <button onClick={onClose} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-semibold">Done</button>
                </footer>
            </div>
        </div>
    );
};

export default SelectTestsModal;
