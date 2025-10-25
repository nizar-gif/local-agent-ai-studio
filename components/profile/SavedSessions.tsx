import React from 'react';
import ProfileCard from './ProfileCard';

const SavedSessions: React.FC = () => {
    return (
        <ProfileCard title="Saved Sessions">
            <p className="text-sm text-text-secondary text-center p-4">Saved chat and workflow sessions will be listed here for quick access.</p>
        </ProfileCard>
    );
};

export default SavedSessions;
