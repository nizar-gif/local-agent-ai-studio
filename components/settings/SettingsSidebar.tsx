import React from 'react';
import { CubeTransparentIcon, CloudIcon, PuzzlePieceIcon, CircleStackIcon, LinkIcon, ClockIcon, CpuChipIcon, ShieldExclamationIcon, PaintBrushIcon, ArrowDownTrayIcon, WrenchScrewdriverIcon, ShareIcon } from '../shared/Icons';

interface SettingsSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const sections = [
    { name: 'Workspace', icon: CubeTransparentIcon },
    { name: 'Providers & Models', icon: CloudIcon },
    { name: 'Orchestration & Agents', icon: PuzzlePieceIcon },
    { name: 'Data & RAG', icon: CircleStackIcon },
    { name: 'Integrations', icon: LinkIcon },
    { name: 'Automation & Scheduler', icon: ClockIcon },
    { name: 'System & Performance', icon: CpuChipIcon },
    { name: 'MCP', icon: ShareIcon },
    { name: 'Security & Secrets', icon: ShieldExclamationIcon },
    { name: 'UI & Accessibility', icon: PaintBrushIcon },
    { name: 'Import/Export & Backups', icon: ArrowDownTrayIcon },
    { name: 'Diagnostics & Tools', icon: WrenchScrewdriverIcon },
];

const NavItem: React.FC<{
  name: string;
  icon: React.FC<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ name, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {name}
    </button>
);

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, setActiveSection }) => {
    return (
        <aside className="w-[280px] flex-shrink-0 bg-card p-4 rounded-lg border border-border flex flex-col space-y-1">
            <div className="p-2 mb-2">
                <h2 className="text-lg font-bold">Control Center</h2>
                <p className="text-xs text-text-secondary mt-1">Unified system configuration</p>
            </div>
            {sections.map(section => (
                <NavItem
                    key={section.name}
                    name={section.name}
                    icon={section.icon}
                    isActive={activeSection === section.name}
                    onClick={() => setActiveSection(section.name)}
                />
            ))}
        </aside>
    );
};

export default SettingsSidebar;
