
import React from 'react';
import { Job } from '../../../types';
import { SectionTitle, ActionButton } from '../fields';

interface Props {
  addJob: (job: { name: string; message: string; }) => void;
}

const StatusItem: React.FC<{label: string, status: 'OK' | 'Error' | 'Pending'}> = ({label, status}) => {
    const color = {
        'OK': 'text-green-400',
        'Error': 'text-red-400',
        'Pending': 'text-yellow-400'
    }[status];
    return (
        <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
            <span className="font-medium">{label}</span>
            <span className={`font-bold text-sm ${color}`}>{status}</span>
        </div>
    );
};

const DiagnosticsSettings: React.FC<Props> = ({ addJob }) => {
  const handleRunDiagnostics = () => {
    addJob({
        name: "Full System Diagnostics",
        message: "Starting diagnostics...",
    });
  };

  return (
    <div>
      <SectionTitle
        title="Diagnostics & Tools"
        subtitle="Run self-tests to check system health and connectivity."
      />
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="font-semibold text-lg mb-4">System Health</h4>
                <div className="space-y-2">
                    <StatusItem label="API Latency" status="OK" />
                    <StatusItem label="WebSocket Status" status="OK" />
                    <StatusItem label="Disk Free" status="OK" />
                    <StatusItem label="RAM Free" status="OK" />
                    <StatusItem label="GPU Memory" status="OK" />
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-4">Connectivity</h4>
                <div className="space-y-2">
                    <StatusItem label="Ollama Ping" status="OK" />
                    <StatusItem label="Model Load Test" status="OK" />
                    <StatusItem label="IMAP Ping" status="OK" />
                    <StatusItem label="Proxy Test" status="OK" />
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-lg mb-4">RAG Sanity Check</h4>
                <div className="space-y-2">
                    <StatusItem label="Nearest-neighbor Test" status="OK" />
                </div>
            </div>
        </div>
        
        <div>
            <h4 className="font-semibold text-lg mb-4">Actions</h4>
             <div className="flex flex-wrap gap-4 items-center">
                <ActionButton onClick={handleRunDiagnostics} variant="primary">Run Full Diagnostics</ActionButton>
                <ActionButton onClick={() => alert("Generating bundle...")}>Generate Support Bundle</ActionButton>
                <ActionButton onClick={() => alert("Killing long tasks...")} variant="danger">Kill Long Tasks</ActionButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsSettings;
