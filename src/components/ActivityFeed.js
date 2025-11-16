import React, { useState, useEffect, useRef } from 'react';
import './ActivityFeed.css';

/**
 * ActivityFeed - Real-time visualization of network activity
 * Shows tasks, collaborations, federated requests, etc.
 */
const ActivityFeed = ({ output, isProcessing }) => {
  const [activities, setActivities] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const feedRef = useRef(null);
  const maxActivities = 20;

  useEffect(() => {
    if (!output) return;

    // Create activity from output
    const activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: output.error ? 'error' : 'success',
      message: getActivityMessage(output),
      node: output.node,
      executedBy: output.executedBy,
      assistedBy: output.assistedBy,
      federatedCollaboration: output.federatedCollaboration,
      roleSwitch: output.roleSwitch,
      validated: output.validated
    };

    setActivities(prev => [activity, ...prev].slice(0, maxActivities));

    // Auto-scroll to top
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [output]);

  const getActivityMessage = (output) => {
    if (output.error) {
      return `Task failed: ${output.message?.substring(0, 100)}...`;
    }

    if (output.federatedCollaboration) {
      return `Federated collaboration: ${output.assistedBy} helped ${output.originalWorker}`;
    }

    if (output.assistedBy && !output.federatedCollaboration) {
      return `Local collaboration: ${output.assistedBy} assisted ${output.originalWorker}`;
    }

    if (output.roleSwitch) {
      return `Role switch: ${output.originalRole} → ${output.newRole}`;
    }

    if (output.validated) {
      return `Task validated successfully`;
    }

    return `Task completed by ${output.executedBy || output.node}`;
  };

  const getActivityIcon = (activity) => {
    if (activity.type === 'error') return '⚠️';
    if (activity.federatedCollaboration) return '🌐';
    if (activity.assistedBy) return '🤝';
    if (activity.roleSwitch) return '🔄';
    if (activity.validated) return '✓';
    return '⚡';
  };

  const getActivityColor = (activity) => {
    if (activity.type === 'error') return 'error';
    if (activity.federatedCollaboration) return 'federated';
    if (activity.assistedBy) return 'collaboration';
    if (activity.roleSwitch) return 'role-switch';
    if (activity.validated) return 'validated';
    return 'success';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={`activity-feed ${isExpanded ? 'expanded' : ''}`}>
      <div className="feed-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>📊 Activity Feed</h3>
        <div className="feed-status">
          {isProcessing && (
            <span className="processing-indicator">
              <span className="pulse-dot"></span>
              Processing
            </span>
          )}
          <button className="toggle-btn">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="feed-content" ref={feedRef}>
          {activities.length === 0 ? (
            <div className="feed-empty">
              <div className="empty-icon">🌟</div>
              <p>No activity yet</p>
              <p className="empty-hint">Execute a task to see activity here</p>
            </div>
          ) : (
            <div className="feed-items">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`feed-item ${getActivityColor(activity)} ${index === 0 ? 'new' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="activity-icon">
                    {getActivityIcon(activity)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-meta">
                      <span className="activity-time">{formatTime(activity.timestamp)}</span>
                      {activity.node && (
                        <span className="activity-node">from {activity.node}</span>
                      )}
                    </div>
                  </div>
                  <div className="activity-indicator"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
