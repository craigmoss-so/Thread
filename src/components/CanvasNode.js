import React from 'react';
import './CanvasNode.css';

const CanvasNode = ({ node, isSelected, onClick }) => {
  const getNodeColor = (type) => {
    const colors = {
      architect: '#667eea',
      broker: '#f093fb',
      worker: '#4facfe',
      validator: '#43e97b'
    };
    return colors[type] || '#999';
  };

  const getNodeIcon = (type) => {
    const icons = {
      architect: '🏗️',
      broker: '🔀',
      worker: '⚙️',
      validator: '✓'
    };
    return icons[type] || '●';
  };

  return (
    <div
      className={`canvas-node ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        borderColor: getNodeColor(node.type)
      }}
      onClick={onClick}
    >
      <div className="node-icon" style={{ backgroundColor: getNodeColor(node.type) }}>
        {getNodeIcon(node.type)}
      </div>
      <div className="node-content">
        <div className="node-title">{node.id}</div>
        <div className="node-type">{node.type}</div>
        <div className="node-model">
          {node.config.primaryModel.provider}: {node.config.primaryModel.model}
        </div>
      </div>
    </div>
  );
};

export default CanvasNode;
