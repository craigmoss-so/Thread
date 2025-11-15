import React from 'react';
import './NodeToolbar.css';

const NodeToolbar = ({ onAddNode }) => {
  const nodeTypes = [
    { type: 'architect', icon: '🏗️', label: 'Architect', description: 'Breaks down tasks and delegates' },
    { type: 'broker', icon: '🔀', label: 'Broker', description: 'Routes tasks to workers' },
    { type: 'worker', icon: '⚙️', label: 'Worker', description: 'Executes assigned tasks' },
    { type: 'validator', icon: '✓', label: 'Validator', description: 'Validates results' }
  ];

  return (
    <div className="node-toolbar">
      <div className="toolbar-header">
        <h3>Add Node</h3>
      </div>
      <div className="toolbar-content">
        {nodeTypes.map(({ type, icon, label, description }) => (
          <button
            key={type}
            className={`add-node-btn ${type}`}
            onClick={() => onAddNode(type)}
            title={description}
          >
            <span className="node-type-icon">{icon}</span>
            <span className="node-type-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodeToolbar;
