import React from 'react';
import { Page } from '../../types';
import { ChartBarIcon, BeakerIcon, ChatBubbleLeftRightIcon, CommandLineIcon, CpuChipIcon, DocumentTextIcon, Cog6ToothIcon, ClockIcon, UsersIcon, CodeBracketSquareIcon, EnvelopeIcon, DocumentMagnifyingGlassIcon, FolderOpenIcon, WrenchScrewdriverIcon, QuestionMarkCircleIcon, LinkIcon } from '../shared/Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, activePage, setActivePage, children }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-secondary p-4 flex flex-col space-y-2 border-r border-border">
      <div className="flex items-center space-x-2 p-2 mb-4">
        <BeakerIcon className="h-8 w-8 text-primary"/>
        <h1 className="text-xl font-bold text-text-primary">AI Agent Platform</h1>
      </div>

      <NavItem page={Page.Dashboard} activePage={activePage} setActivePage={setActivePage}>
        <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
      </NavItem>
      <NavItem page={Page.Chat} activePage={activePage} setActivePage={setActivePage}>
        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" /> Chat
      </NavItem>
       <NavItem page={Page.RAG} activePage={activePage} setActivePage={setActivePage}>
        <DocumentTextIcon className="h-5 w-5 mr-3" /> RAG Center
      </NavItem>
      <NavItem page={Page.Files} activePage={activePage} setActivePage={setActivePage}>
        <FolderOpenIcon className="h-5 w-5 mr-3" /> Files
      </NavItem>
      <NavItem page={Page.Mail} activePage={activePage} setActivePage={setActivePage}>
        <EnvelopeIcon className="h-5 w-5 mr-3" /> Mail
      </NavItem>
      
      <p className="px-4 pt-4 pb-2 text-xs font-semibold text-text-secondary uppercase">Automation</p>
      
      <NavItem page={Page.Tasks} activePage={activePage} setActivePage={setActivePage}>
        <CpuChipIcon className="h-5 w-5 mr-3" /> Tasks
      </NavItem>
      <NavItem page={Page.Agents} activePage={activePage} setActivePage={setActivePage}>
        <UsersIcon className="h-5 w-5 mr-3" /> Agents
      </NavItem>
      <NavItem page={Page.Workflows} activePage={activePage} setActivePage={setActivePage}>
        <CodeBracketSquareIcon className="h-5 w-5 mr-3" /> Workflows
      </NavItem>
      <NavItem page={Page.Automation} activePage={activePage} setActivePage={setActivePage}>
        <ClockIcon className="h-5 w-5 mr-3" /> Schedules
      </NavItem>
      <NavItem page={Page.Connectors} activePage={activePage} setActivePage={setActivePage}>
        <LinkIcon className="h-5 w-5 mr-3" /> Connectors
      </NavItem>
      
      <div className="flex-grow"></div>
      
       <p className="px-4 pt-4 pb-2 text-xs font-semibold text-text-secondary uppercase">System</p>
      
      <NavItem page={Page.Monitoring} activePage={activePage} setActivePage={setActivePage}>
        <ChartBarIcon className="h-5 w-5 mr-3" /> Monitoring
      </NavItem>
      <NavItem page={Page.Logs} activePage={activePage} setActivePage={setActivePage}>
        <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-3" /> Logs & Reports
      </NavItem>
      <NavItem page={Page.Diagnostics} activePage={activePage} setActivePage={setActivePage}>
        <WrenchScrewdriverIcon className="h-5 w-5 mr-3" /> Diagnostics
      </NavItem>
      <NavItem page={Page.Settings} activePage={activePage} setActivePage={setActivePage}>
        <Cog6ToothIcon className="h-5 w-5 mr-3" /> Settings
      </NavItem>
      <NavItem page={Page.Help} activePage={activePage} setActivePage={setActivePage}>
        <QuestionMarkCircleIcon className="h-5 w-5 mr-3" /> Help & Support
      </NavItem>
    </aside>
  );
};

export default Sidebar;