import React, { useState, useEffect } from 'react';
import './FederatedPanel.css';
import { getThreadIdentity, setThreadDisplayName } from '../services/threadIdentityService';
import { getPeerDiscoveryManager, createThreadManifest } from '../services/peerDiscoveryService';
import { getRemoteTaskManager } from '../services/remoteTaskService';
import { reputationManager } from '../services/reputationService';

const FederatedPanel = ({ nodes }) => {
  const [identity, setIdentity] = useState(null);
  const [peers, setPeers] = useState([]);
  const [networkStats, setNetworkStats] = useState(null);
  const [remoteStats, setRemoteStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingPeer, setIsAddingPeer] = useState(false);
  const [newPeerJson, setNewPeerJson] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const peerManager = getPeerDiscoveryManager();
  const remoteManager = getRemoteTaskManager();

  useEffect(() => {
    // Load identity
    const threadIdentity = getThreadIdentity();
    setIdentity(threadIdentity);
    setDisplayName(threadIdentity.displayName);

    // Start discovery
    peerManager.startDiscovery();

    // Listen for peer events
    peerManager.on('peerDiscovered', updatePeers);
    peerManager.on('peerConnected', updatePeers);
    peerManager.on('peerDisconnected', updatePeers);

    // Initial update
    updatePeers();
    updateStats();

    // Periodic updates
    const interval = setInterval(() => {
      updatePeers();
      updateStats();
    }, 2000);

    return () => {
      clearInterval(interval);
      peerManager.stopDiscovery();
    };
  }, []);

  const updatePeers = () => {
    setPeers(peerManager.getAllPeers());
  };

  const updateStats = () => {
    setNetworkStats(peerManager.getNetworkStats());
    setRemoteStats(remoteManager.getStats());
  };

  const handleSaveDisplayName = () => {
    const updated = setThreadDisplayName(displayName);
    setIdentity(updated);
    setEditingName(false);
  };

  const handleAddPeer = () => {
    try {
      const manifest = JSON.parse(newPeerJson);
      peerManager.addPeer(manifest);
      setNewPeerJson('');
      setIsAddingPeer(false);
      updatePeers();
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  };

  const handleRemovePeer = (threadId) => {
    if (window.confirm('Remove this peer?')) {
      peerManager.removePeer(threadId);
      updatePeers();
    }
  };

  const handleCopyManifest = () => {
    const manifest = createThreadManifest(nodes, reputationManager);
    const json = JSON.stringify(manifest, null, 2);
    navigator.clipboard.writeText(json);
    alert('Thread manifest copied to clipboard! Share this with others to connect.');
  };

  const handleTestRemoteTask = async (peer) => {
    try {
      const result = await remoteManager.requestRemoteHelp(
        peer,
        'Test task: What is 2+2?',
        { requiredSkills: ['math'], priority: 1 }
      );
      alert(`Remote task result: ${result.success ? result.data : result.error}`);
      updateStats();
    } catch (error) {
      alert(`Remote task failed: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#43e97b';
      case 'connecting': return '#f093fb';
      case 'disconnected': return '#666';
      case 'error': return '#fa5252';
      default: return '#999';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Expert': return '#43e97b';
      case 'Advanced': return '#4facfe';
      case 'Proficient': return '#f093fb';
      case 'Developing': return '#fad052';
      case 'Novice': return '#fa5252';
      default: return '#999';
    }
  };

  if (!identity) {
    return <div className="federated-panel">Loading...</div>;
  }

  return (
    <div className={`federated-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🌐 Federated Network</h3>
        <button className="toggle-btn">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div className="panel-summary">
        <div className="stat-card">
          <div className="stat-value">{peers.filter(p => p.status === 'connected').length}</div>
          <div className="stat-label">Connected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{remoteStats?.totalRequests || 0}</div>
          <div className="stat-label">Remote Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {networkStats?.totalCapabilities || 0}
          </div>
          <div className="stat-label">Skills Available</div>
        </div>
      </div>

      {isExpanded && (
        <div className="panel-content">
          {/* Thread Identity */}
          <div className="section">
            <h4>Your Thread Identity</h4>
            <div className="identity-card">
              <div className="identity-row">
                <span className="identity-label">Display Name:</span>
                {editingName ? (
                  <div className="edit-name">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Thread name"
                    />
                    <button onClick={handleSaveDisplayName}>Save</button>
                    <button onClick={() => setEditingName(false)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="identity-value">{identity.displayName}</span>
                    <button onClick={() => setEditingName(true)} className="edit-btn">
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="identity-row">
                <span className="identity-label">Thread ID:</span>
                <span className="identity-value thread-id">{identity.threadId}</span>
              </div>
              <div className="identity-row">
                <span className="identity-label">Protocol:</span>
                <span className="identity-value">{identity.protocolVersion}</span>
              </div>
              <button onClick={handleCopyManifest} className="copy-manifest-btn">
                📋 Copy My Manifest (Share with Others)
              </button>
            </div>
          </div>

          {/* Add Peer */}
          <div className="section">
            <h4>Connect to Peers</h4>
            {!isAddingPeer ? (
              <button onClick={() => setIsAddingPeer(true)} className="add-peer-btn">
                + Add Peer Thread
              </button>
            ) : (
              <div className="add-peer-form">
                <textarea
                  value={newPeerJson}
                  onChange={(e) => setNewPeerJson(e.target.value)}
                  placeholder="Paste peer's Thread manifest JSON here..."
                  rows={8}
                />
                <div className="form-actions">
                  <button onClick={handleAddPeer}>Add Peer</button>
                  <button onClick={() => setIsAddingPeer(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Connected Peers */}
          <div className="section">
            <h4>Connected Peers ({peers.length})</h4>
            {peers.length === 0 ? (
              <p className="no-peers">
                No peers connected yet. Add a peer to enable federated collaboration!
              </p>
            ) : (
              <div className="peers-list">
                {peers.map(peer => (
                  <div key={peer.threadId} className="peer-card">
                    <div className="peer-header">
                      <div>
                        <div className="peer-name">{peer.displayName}</div>
                        <div className="peer-id">{peer.threadId}</div>
                      </div>
                      <div className="peer-status">
                        <span
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(peer.status) }}
                        />
                        <span className="status-text">{peer.status}</span>
                      </div>
                    </div>

                    <div className="peer-info">
                      <div className="info-row">
                        <span className="info-label">Reputation:</span>
                        <span
                          className="info-value"
                          style={{ color: getTierColor(peer.reputation.tier) }}
                        >
                          {peer.reputation.tier} ({(peer.getCombinedReputation() * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Workers:</span>
                        <span className="info-value">{peer.nodes.workers || 0}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tasks Completed:</span>
                        <span className="info-value">{peer.tasksCompleted}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Times Helped:</span>
                        <span className="info-value">{peer.tasksHelped}</span>
                      </div>
                    </div>

                    <div className="peer-capabilities">
                      <div className="capabilities-label">Skills:</div>
                      <div className="capabilities-tags">
                        {peer.capabilities.length > 0 ? (
                          peer.capabilities.map((cap, idx) => (
                            <span key={idx} className="capability-tag">
                              {cap.skill}
                            </span>
                          ))
                        ) : (
                          <span className="no-skills">No skills advertised</span>
                        )}
                      </div>
                    </div>

                    <div className="peer-actions">
                      <button
                        onClick={() => handleTestRemoteTask(peer)}
                        disabled={peer.status !== 'connected'}
                        className="test-btn"
                      >
                        Test Task
                      </button>
                      <button
                        onClick={() => handleRemovePeer(peer.threadId)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Network Stats */}
          {networkStats && (
            <div className="section">
              <h4>Network Statistics</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Peers:</span>
                  <span className="stat-value">{networkStats.totalPeers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Connected:</span>
                  <span className="stat-value">{networkStats.connectedPeers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Reputation:</span>
                  <span className="stat-value">
                    {(networkStats.averageReputation * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Remote Tasks:</span>
                  <span className="stat-value">{networkStats.totalTasksCompleted}</span>
                </div>
              </div>
            </div>
          )}

          {/* Remote Task Stats */}
          {remoteStats && remoteStats.totalRequests > 0 && (
            <div className="section">
              <h4>Remote Task Performance</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Success Rate:</span>
                  <span className="stat-value">
                    {(remoteStats.successRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Duration:</span>
                  <span className="stat-value">
                    {(remoteStats.averageDuration / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Successful:</span>
                  <span className="stat-value">{remoteStats.successful}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Failed:</span>
                  <span className="stat-value">{remoteStats.failed + remoteStats.errors}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FederatedPanel;
