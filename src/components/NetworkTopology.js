import React, { useState, useEffect, useRef } from 'react';
import './NetworkTopology.css';
import { getPeerDiscoveryManager } from '../services/peerDiscoveryService';
import { getThreadIdentity } from '../services/threadIdentityService';

const NetworkTopology = ({ nodes }) => {
  const [peers, setPeers] = useState([]);
  const [identity, setIdentity] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const peerManager = getPeerDiscoveryManager();
    const threadIdentity = getThreadIdentity();

    setIdentity(threadIdentity);
    setPeers(peerManager.getAllPeers());

    const interval = setInterval(() => {
      setPeers(peerManager.getAllPeers());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isExpanded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Animation state
    let time = 0;

    // Center node (this Thread)
    const centerNode = {
      x: width / 2,
      y: height / 2,
      radius: 60,
      label: identity?.displayName || 'My Thread',
      color: '#667eea',
      isCenter: true,
      pulsePhase: 0
    };

    // Position peer nodes in a circle
    const peerNodes = peers.map((peer, index) => {
      const angle = (index / peers.length) * Math.PI * 2;
      const distance = 180;
      return {
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        radius: 40,
        label: peer.displayName,
        color: peer.status === 'connected' ? '#43e97b' : '#666',
        isCenter: false,
        pulsePhase: index * 0.5,
        status: peer.status,
        reputation: peer.getCombinedReputation()
      };
    });

    // Position local nodes in inner circle
    const localNodes = nodes.slice(0, 8).map((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const distance = 90;
      return {
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        radius: 15,
        label: node.id,
        color: getNodeColor(node.type),
        isLocal: true,
        pulsePhase: index * 0.3,
        type: node.type
      };
    });

    const allNodes = [centerNode, ...peerNodes, ...localNodes];

    // Animation loop
    const animate = () => {
      time += 0.016;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      drawGrid(ctx, width, height, time);

      // Draw connections
      drawConnections(ctx, centerNode, peerNodes, localNodes, time);

      // Draw nodes
      allNodes.forEach(node => {
        drawNode(ctx, node, time);
      });

      // Draw labels
      allNodes.forEach(node => {
        drawLabel(ctx, node);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isExpanded, peers, nodes, identity]);

  const getNodeColor = (type) => {
    const colors = {
      architect: '#667eea',
      broker: '#f093fb',
      worker: '#4facfe',
      validator: '#43e97b'
    };
    return colors[type] || '#999';
  };

  const drawGrid = (ctx, width, height, time) => {
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 30;
    const offset = (time * 10) % gridSize;

    for (let x = -offset; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = -offset; y < height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawConnections = (ctx, centerNode, peerNodes, localNodes, time) => {
    // Draw connections from center to peers
    peerNodes.forEach((peer, index) => {
      if (peer.status === 'connected') {
        const gradient = ctx.createLinearGradient(
          centerNode.x, centerNode.y,
          peer.x, peer.y
        );
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.6)');
        gradient.addColorStop(0.5, 'rgba(240, 147, 251, 0.8)');
        gradient.addColorStop(1, 'rgba(67, 233, 123, 0.6)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#667eea';

        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(peer.x, peer.y);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Animated particle
        const progress = (time + index * 0.5) % 1;
        const particleX = centerNode.x + (peer.x - centerNode.x) * progress;
        const particleY = centerNode.y + (peer.y - centerNode.y) * progress;

        ctx.fillStyle = '#f093fb';
        ctx.beginPath();
        ctx.arc(particleX, particleY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw connections from center to local nodes
    localNodes.forEach((localNode, index) => {
      ctx.strokeStyle = `${localNode.color}40`;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(centerNode.x, centerNode.y);
      ctx.lineTo(localNode.x, localNode.y);
      ctx.stroke();
    });
  };

  const drawNode = (ctx, node, time) => {
    const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.1 + 1;

    // Glow
    ctx.shadowBlur = 20 * pulse;
    ctx.shadowColor = node.color;

    // Outer ring
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Fill
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, node.radius
    );
    gradient.addColorStop(0, `${node.color}80`);
    gradient.addColorStop(1, `${node.color}20`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    if (node.isCenter) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Reputation ring for peers
    if (!node.isCenter && !node.isLocal && node.reputation) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (node.reputation * Math.PI * 2);

      ctx.strokeStyle = '#43e97b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 8, startAngle, endAngle);
      ctx.stroke();
    }
  };

  const drawLabel = (ctx, node) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = node.isCenter ? 'bold 14px sans-serif' : '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labelY = node.y + node.radius + 20;
    ctx.fillText(node.label, node.x, labelY);

    // Status indicator for peers
    if (!node.isCenter && !node.isLocal) {
      const statusText = node.status === 'connected' ? '●' : '○';
      ctx.fillStyle = node.status === 'connected' ? '#43e97b' : '#666';
      ctx.font = '10px sans-serif';
      ctx.fillText(statusText, node.x, labelY + 15);
    }
  };

  const connectedCount = peers.filter(p => p.status === 'connected').length;
  const totalNodes = nodes.length + peers.length + 1; // local + peers + self

  return (
    <div className={`network-topology ${isExpanded ? 'expanded' : ''}`}>
      <div className="topology-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🌐 Network Topology</h3>
        <button className="toggle-btn">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div className="topology-summary">
        <div className="topo-stat">
          <span className="topo-value">{totalNodes}</span>
          <span className="topo-label">Total Nodes</span>
        </div>
        <div className="topo-stat">
          <span className="topo-value">{nodes.length}</span>
          <span className="topo-label">Local</span>
        </div>
        <div className="topo-stat">
          <span className="topo-value">{connectedCount}</span>
          <span className="topo-label">Federated</span>
        </div>
      </div>

      {isExpanded && (
        <div className="topology-canvas-container">
          <canvas ref={canvasRef} className="topology-canvas" />
          <div className="topology-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#667eea' }}></div>
              <span>This Thread (Center)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#43e97b' }}></div>
              <span>Connected Peers</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#4facfe' }}></div>
              <span>Local Workers</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#666' }}></div>
              <span>Disconnected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopology;
