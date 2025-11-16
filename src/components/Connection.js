import React from 'react';
import './Connection.css';

const Connection = ({ connection, fromNode, toNode, onDelete }) => {
  if (!fromNode || !toNode) return null;

  // Calculate connection line coordinates
  const nodeWidth = 220;
  const fromX = fromNode.position.x + (nodeWidth / 2);
  const fromY = fromNode.position.y + 90; // Bottom of icon area
  const toX = toNode.position.x + (nodeWidth / 2);
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

  // Unique ID for gradients
  const gradientId = `gradient-${connection.id}`;
  const glowId = `glow-${connection.id}`;

  return (
    <g className="connection" data-connection-id={connection.id}>
      <defs>
        {/* Animated gradient for connection line */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.8">
            <animate
              attributeName="offset"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#f093fb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0.5;1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#43e97b" stopOpacity="0.8">
            <animate
              attributeName="offset"
              values="1;1;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Arrowhead marker */}
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="12"
          markerHeight="12"
          refX="11"
          refY="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 12 6 L 0 12 z"
            fill="url(#${gradientId})"
            opacity="0.9"
          />
        </marker>
      </defs>

      {/* Glow layer */}
      <path
        d={pathData}
        stroke="url(#${gradientId})"
        strokeWidth="3"
        fill="none"
        className="connection-glow"
        filter={`url(#${glowId})`}
        opacity="0.6"
      />

      {/* Main connection path */}
      <path
        d={pathData}
        stroke="url(#${gradientId})"
        strokeWidth="3"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="connection-path"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="20"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      {/* Animated particles flowing along the path */}
      <circle r="4" fill="#667eea" opacity="0.8" className="connection-particle">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={pathData}
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle r="3" fill="#f093fb" opacity="0.6" className="connection-particle">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={pathData}
          begin="0.5s"
        />
        <animate
          attributeName="opacity"
          values="0;0.6;0"
          dur="2.5s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>

      <circle r="3" fill="#43e97b" opacity="0.6" className="connection-particle">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={pathData}
          begin="1s"
        />
        <animate
          attributeName="opacity"
          values="0;0.6;0"
          dur="3s"
          repeatCount="indefinite"
          begin="1s"
        />
      </circle>

      {/* Invisible wider path for easier clicking */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="24"
        fill="none"
        className="connection-hitbox"
        onClick={handleDelete}
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
};

export default Connection;
