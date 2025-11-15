import React from 'react';
import './Canvas.css';
import CanvasNode from './CanvasNode';

const Canvas = ({ nodes, selectedNodeId, onNodeClick }) => {
  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h2>Canvas</h2>
        <span className="node-count">{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="canvas">
        {nodes.map(node => (
          <CanvasNode
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onClick={() => onNodeClick(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
