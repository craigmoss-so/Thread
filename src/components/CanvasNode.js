import React, { useState } from 'react';
import './CanvasNode.css';

const CanvasNode = ({ node, isSelected, onClick, onDrag, onDelete, onConnectionStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e) => {
    if (e.target.closest('.node-delete') || e.target.closest('.connection-handle')) {
      return;
    }

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = e.currentTarget.parentElement;
    const canvasRect = canvas.getBoundingClientRect();

    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    onDrag(node.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete node ${node.id}?`)) {
      onDelete(node.id);
    }
  };

  const handleConnectionHandleClick = (e) => {
    e.stopPropagation();
    onConnectionStart(node.id);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className={`canvas-node ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      data-type={node.type}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      <button className="node-delete" onClick={handleDelete} title="Delete node">
        ×
      </button>

      <div className="connection-handle" onClick={handleConnectionHandleClick} title="Create connection">
        ⚡
      </div>

      <div className="node-icon">
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
