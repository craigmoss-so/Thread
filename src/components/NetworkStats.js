import React, { useState, useEffect } from 'react';
import './NetworkStats.css';
import { reputationManager } from '../services/reputationService';
import { messageHistory } from '../services/messagingService';

const NetworkStats = ({ nodes }) => {
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const networkStats = reputationManager.getNetworkStats();
      const recentMessages = messageHistory.getRecentMessages(5);

      setStats({
        ...networkStats,
        nodeCount: nodes.length,
        recentMessages
      });
    }
  }, [nodes]);

  if (!stats) {
    return null;
  }

  const healthColor = stats.networkHealth >= 0.7 ? '#43e97b' :
                      stats.networkHealth >= 0.4 ? '#f093fb' : '#fa5252';

  return (
    <div className={`network-stats ${isExpanded ? 'expanded' : ''}`}>
      <div className="stats-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Network Health</h3>
        <button className="toggle-btn">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value" style={{ color: healthColor }}>
            {(stats.networkHealth * 100).toFixed(0)}%
          </div>
          <div className="stat-label">Health</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.totalCollaborations}</div>
          <div className="stat-label">Collaborations</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.totalRoleSwitches}</div>
          <div className="stat-label">Role Switches</div>
        </div>
      </div>

      {isExpanded && (
        <div className="stats-details">
          <div className="stats-section">
            <h4>Top Performers</h4>
            {stats.topPerformers && stats.topPerformers.length > 0 ? (
              <div className="performers-list">
                {stats.topPerformers.map((performer, index) => (
                  <div key={performer.nodeId} className="performer-item">
                    <span className="performer-rank">#{index + 1}</span>
                    <span className="performer-id">{performer.nodeId}</span>
                    <span className={`performer-tier tier-${performer.tier.toLowerCase()}`}>
                      {performer.tier}
                    </span>
                    <span className="performer-score">
                      {(performer.score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No performance data yet</p>
            )}
          </div>

          <div className="stats-section">
            <h4>Node Reputations</h4>
            <div className="reputation-list">
              {nodes.map(node => {
                const reputation = reputationManager.getReputation(node.id);
                const summary = reputation.getSummary();

                return (
                  <div key={node.id} className="reputation-item">
                    <div className="reputation-header">
                      <span className="node-id">{node.id}</span>
                      <span className={`node-tier tier-${summary.tier.toLowerCase()}`}>
                        {summary.tier}
                      </span>
                    </div>
                    <div className="reputation-bar">
                      <div
                        className="reputation-fill"
                        style={{
                          width: `${summary.score * 100}%`,
                          backgroundColor: summary.score >= 0.7 ? '#43e97b' :
                                         summary.score >= 0.4 ? '#f093fb' : '#fa5252'
                        }}
                      />
                    </div>
                    <div className="reputation-stats">
                      <span>{summary.totalTasks} tasks</span>
                      <span>{summary.helpProvided} helped</span>
                      <span>{(summary.successRate * 100).toFixed(0)}% success</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {stats.recentMessages && stats.recentMessages.length > 0 && (
            <div className="stats-section">
              <h4>Recent Messages</h4>
              <div className="messages-list">
                {stats.recentMessages.map((msg, index) => (
                  <div key={index} className="message-item">
                    <span className="message-type">{msg.type}</span>
                    <span className="message-route">{msg.from} → {msg.to}</span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkStats;
