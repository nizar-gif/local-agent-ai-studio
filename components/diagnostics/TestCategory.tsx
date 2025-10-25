import React from 'react';

interface TestCategoryProps {
    title: string;
    icon: React.FC<{ className: string }>;
    children: React.ReactNode;
}

const TestCategory: React.FC<TestCategoryProps> = ({ title, icon: Icon, children }) => {
    return (
        <section>
            <div className="border-b-2 border-primary/30 pb-2 mb-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {children}
            </div>
        </section>
    );
};

export default TestCategory;