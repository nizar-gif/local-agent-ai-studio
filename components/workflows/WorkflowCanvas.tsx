
import React, { useState } from 'react';
import { Workflow, WorkflowNode, WorkflowNodeType } from '../../types';
import { UsersIcon, DocumentTextIcon, CommandLineIcon, ClockIcon, EnvelopeIcon, CheckCircleIcon, CubeIcon } from '../shared/Icons';

interface WorkflowCanvasProps {
    workflow: Workflow | null;
}

const nodeIcons: Record<WorkflowNodeType, React.FC<{className: string}>> = {
    'Agent': UsersIcon,
    'Document': DocumentTextIcon,
    'Function': CommandLineIcon,
    'Loop': CubeIcon,
    'Timer': ClockIcon,
    'Email': EnvelopeIcon,
    'End': CheckCircleIcon,
};
const nodeColors: Record<WorkflowNodeType, string> = {
    'Agent': 'bg-purple-600', 'Document': 'bg-blue-600', 'Function': 'bg-gray-600',
    'Loop': 'bg-yellow-600', 'Timer': 'bg-orange-600', 'Email': 'bg-sky-600', 'End': 'bg-green-600',
};

const PropertyItem: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div>
        <p className="text-xs text-text-secondary uppercase font-bold">{label}</p>
        <p className="text-sm font-mono bg-background p-1.5 rounded-md mt-1">{value}</p>
    </div>
);


const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ workflow }) => {
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

    if (!workflow) {
        return (
            <div className="flex items-center justify-center h-full bg-background text-text-secondary">
                Select a workflow to view its graph.
            </div>
        );
    }
    
    return (
        <div className="flex h-full">
            {/* Node Palette */}
            <div className="w-48 bg-secondary p-3 border-r border-border">
                <h3 className="font-bold mb-4">Nodes</h3>
                <div className="space-y-2">
                    {Object.entries(nodeIcons).map(([type, Icon]) => (
                        <div key={type} draggable className="flex items-center p-2 bg-card rounded-md border border-border cursor-grab">
                            <Icon className={`h-5 w-5 mr-2 ${nodeColors[type as WorkflowNodeType].replace('bg-','text-')}`} />
                            <span className="text-sm">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-background relative overflow-hidden" onClick={() => setSelectedNode(null)}>
                 {/* Edges */}
                <svg className="absolute inset-0 w-full h-full">
                    {workflow.edges.map(edge => {
                        const sourceNode = workflow.nodes.find(n => n.id === edge.source);
                        const targetNode = workflow.nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;
                        const startX = sourceNode.position.x + 150;
                        const startY = sourceNode.position.y + 30;
                        const endX = targetNode.position.x;
                        const endY = targetNode.position.y + 30;
                        return <path key={edge.id} d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`} stroke="#4B5563" strokeWidth="2" fill="none" />;
                    })}
                </svg>

                {/* Nodes */}
                {workflow.nodes.map(node => {
                    const Icon = nodeIcons[node.type];
                    const isSelected = selectedNode?.id === node.id;
                    return (
                        <div 
                            key={node.id} 
                            onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                            className={`absolute p-3 rounded-lg border-2 flex items-center shadow-lg cursor-pointer transition-all ${nodeColors[node.type]} ${isSelected ? 'border-primary scale-105' : 'border-border'}`}
                            style={{ top: node.position.y, left: node.position.x, width: 150, height: 60 }}
                        >
                            <Icon className="h-5 w-5 mr-2 text-white" />
                            <span className="text-sm font-bold text-white">{node.label}</span>
                        </div>
                    );
                })}
            </div>
            
             {/* Properties Panel */}
            <div className="w-72 bg-secondary p-4 border-l border-border overflow-y-auto">
                <h3 className="font-bold mb-4 text-lg">{selectedNode ? 'Node Properties' : 'Workflow Properties'}</h3>
                {selectedNode ? (
                    <div className="space-y-4">
                        <PropertyItem label="ID" value={selectedNode.id} />
                        <PropertyItem label="Type" value={selectedNode.type} />
                        <PropertyItem label="Label" value={selectedNode.label} />
                        {/* More complex properties would go here */}
                    </div>
                ) : (
                     <div className="space-y-4">
                        <PropertyItem label="Name" value={workflow.name} />
                        <PropertyItem label="ID" value={workflow.id} />
                        <PropertyItem label="Status" value={workflow.status} />
                        <PropertyItem label="Trigger" value={workflow.type} />
                        <PropertyItem label="Steps" value={workflow.steps.toString()} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowCanvas;
