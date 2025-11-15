import React, { useState } from 'react';
import './Canvas.css';
import CanvasNode from './CanvasNode';
import Connection from './Connection';

const Canvas = ({
  nodes,
  connections,
  selectedNodeId,
  onNodeClick,
  onNodeDrag,
  onNodeDelete,
  onConnectionCreate,
  onConnectionDelete
}) => {
  const [connectingFrom, setConnectingFrom] = useState(null);

  const handleConnectionStart = (nodeId) => {
    if (connectingFrom === nodeId) {
      setConnectingFrom(null); // Cancel if clicking same node
    } else if (connectingFrom) {
      // Create connection
      onConnectionCreate(connectingFrom, nodeId);
      setConnectingFrom(null);
    } else {
      setConnectingFrom(nodeId);
    }
  };

  const handleCanvasClick = () => {
    if (connectingFrom) {
      setConnectingFrom(null); // Cancel connection
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h2>Canvas</h2>
        <div className="canvas-stats">
          <span className="stat-item">{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
          <span className="stat-item">{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
          {connectingFrom && (
            <span className="connecting-indicator">
              Connecting from {nodes.find(n => n.id === connectingFrom)?.id}... (click target node)
            </span>
          )}
        </div>
      </div>
      <div className="canvas" onClick={handleCanvasClick}>
        {/* SVG layer for connections */}
        <svg className="connections-layer">
          {connections.map(connection => (
            <Connection
              key={connection.id}
              connection={connection}
              fromNode={nodes.find(n => n.id === connection.from)}
              toNode={nodes.find(n => n.id === connection.to)}
              onDelete={onConnectionDelete}
            />
          ))}
        </svg>

        {/* Nodes layer */}
        {nodes.map(node => (
          <CanvasNode
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onClick={() => onNodeClick(node.id)}
            onDrag={onNodeDrag}
            onDelete={onNodeDelete}
            onConnectionStart={handleConnectionStart}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
