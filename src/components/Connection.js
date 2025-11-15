import React from 'react';
import './Connection.css';

const Connection = ({ connection, fromNode, toNode, onDelete }) => {
  if (!fromNode || !toNode) return null;

  // Calculate connection line coordinates
  const fromX = fromNode.position.x + 100; // Center of node (200px width / 2)
  const fromY = fromNode.position.y + 90; // Bottom of icon area
  const toX = toNode.position.x + 100;
  const toY = toNode.position.y + 40; // Top of node

  // Calculate control points for curved line
  const midY = (fromY + toY) / 2;

  const pathData = `M ${fromX} ${fromY}
                    C ${fromX} ${midY},
                      ${toX} ${midY},
                      ${toX} ${toY}`;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete connection from ${fromNode.id} to ${toNode.id}?`)) {
      onDelete(connection.id);
    }
  };

  return (
    <g className="connection" data-connection-id={connection.id}>
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
        </marker>
      </defs>

      <path
        d={pathData}
        stroke="#667eea"
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="connection-path"
      />

      {/* Invisible wider path for easier clicking */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        className="connection-hitbox"
        onClick={handleDelete}
        style={{ cursor: 'pointer' }}
      />

      {/* Connection label */}
      <text
        x={(fromX + toX) / 2}
        y={(fromY + toY) / 2}
        className="connection-label"
        onClick={handleDelete}
      >
        {connection.label || ''}
      </text>
    </g>
  );
};

export default Connection;
