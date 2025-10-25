import React from 'react';

interface ProfileCardProps {
    title: string;
    children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, children }) => {
    return (
        <div className="bg-card border border-border rounded-lg shadow">
            <h3 className="text-lg font-bold p-4 border-b border-border">{title}</h3>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default ProfileCard;
