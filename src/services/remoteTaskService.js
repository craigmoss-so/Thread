/**
 * Remote Task Service
 * Handles delegation of tasks to peer Thread instances
 * Enables cross-Thread worker collaboration
 */

import { getPeerDiscoveryManager } from './peerDiscoveryService';
import { createMessage, MessageType, MessagePriority } from './messagingService';

/**
 * Remote task request message types
 */
export const RemoteMessageType = {
  REMOTE_TASK_REQUEST: 'remote_task_request',
  REMOTE_TASK_OFFER: 'remote_task_offer',
  REMOTE_TASK_DECLINE: 'remote_task_decline',
  REMOTE_TASK_RESULT: 'remote_task_result',
  REMOTE_TASK_ERROR: 'remote_task_error',
  CAPABILITY_QUERY: 'capability_query',
  CAPABILITY_RESPONSE: 'capability_response'
};

/**
 * Create a remote task request
 */
export const createRemoteTaskRequest = (fromThread, toThread, task, context = {}) => {
  return {
    id: `remote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: RemoteMessageType.REMOTE_TASK_REQUEST,
    from: fromThread.threadId,
    fromDisplayName: fromThread.displayName,
    to: toThread.threadId,
    toDisplayName: toThread.displayName,
    task,
    context: {
      originalNode: context.originalNode || null,
      requiredSkills: context.requiredSkills || [],
      timeout: context.timeout || 30000,
      priority: context.priority || MessagePriority.NORMAL,
      ...context
    },
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
};

/**
 * Create a remote task response
 */
export const createRemoteTaskResponse = (request, accepted, reason = '') => {
  return {
    id: `response-${request.id}`,
    type: accepted ? RemoteMessageType.REMOTE_TASK_OFFER : RemoteMessageType.REMOTE_TASK_DECLINE,
    requestId: request.id,
    from: request.to,
    to: request.from,
    accepted,
    reason,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a remote task result message
 */
export const createRemoteTaskResult = (request, success, data, error = null) => {
  return {
    id: `result-${request.id}`,
    type: success ? RemoteMessageType.REMOTE_TASK_RESULT : RemoteMessageType.REMOTE_TASK_ERROR,
    requestId: request.id,
    from: request.to,
    to: request.from,
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
};

/**
 * Remote Task Manager
 * Coordinates task delegation to remote Thread instances
 */
export class RemoteTaskManager {
  constructor() {
    this.pendingRequests = new Map(); // requestId -> request
    this.requestHistory = [];
    this.maxHistorySize = 1000;
    this.timeoutDuration = 30000; // 30 seconds default
  }

  /**
   * Request help from a peer Thread
   * @param {PeerThread} peer - The peer to request help from
   * @param {string} task - The task description
   * @param {Object} context - Additional context (skills, priority, etc.)
   * @returns {Promise<Object>} - Task result
   */
  async requestRemoteHelp(peer, task, context = {}) {
    const peerManager = getPeerDiscoveryManager();
    const myIdentity = require('./threadIdentityService').getThreadIdentity();

    // Check if peer is available
    if (!peer.isAvailable()) {
      throw new Error(`Peer ${peer.displayName} is not available`);
    }

    // Create request
    const request = createRemoteTaskRequest(myIdentity, peer, task, context);

    // Store request
    this.pendingRequests.set(request.id, request);
    this.requestHistory.push({
      ...request,
      outcome: 'pending'
    });

    // Trim history if needed
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory.shift();
    }

    console.log(`[RemoteTask] Requesting help from ${peer.displayName} for: ${task.substring(0, 50)}...`);

    // Increment peer's current requests
    peer.currentRequests++;

    try {
      // Simulate sending request and waiting for response
      // In production: Send via WebRTC data channel or WebSocket
      const result = await this.sendRequestToPeer(peer, request);

      // Update peer reputation based on outcome
      const responseTime = Date.now() - new Date(request.timestamp).getTime();
      peer.updateLocalReputation(result.success, responseTime);

      // Update stats
      peer.tasksRequested++;
      if (result.success) {
        peer.tasksCompleted++;
      }

      // Update history
      const historyEntry = this.requestHistory.find(r => r.id === request.id);
      if (historyEntry) {
        historyEntry.outcome = result.success ? 'success' : 'failure';
        historyEntry.duration = responseTime;
      }

      return result;
    } catch (error) {
      // Update peer reputation for failure
      peer.updateLocalReputation(false);

      // Update history
      const historyEntry = this.requestHistory.find(r => r.id === request.id);
      if (historyEntry) {
        historyEntry.outcome = 'error';
        historyEntry.error = error.message;
      }

      throw error;
    } finally {
      // Cleanup
      this.pendingRequests.delete(request.id);
      peer.currentRequests = Math.max(0, peer.currentRequests - 1);
    }
  }

  /**
   * Send request to peer (simulated for now)
   * In production: Use WebRTC or WebSocket
   */
  async sendRequestToPeer(peer, request) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.timeoutDuration);

      // Simulate network delay and processing
      setTimeout(() => {
        clearTimeout(timeout);

        // Simulate peer processing
        // In production: Peer would actually execute the task
        const simulatedSuccess = Math.random() > 0.2; // 80% success rate

        if (simulatedSuccess) {
          resolve({
            success: true,
            data: `[Simulated response from ${peer.displayName}] Task completed: ${request.task}`,
            executedBy: `${peer.threadId}/worker-remote`,
            remote: true,
            peerThread: peer.displayName
          });
        } else {
          resolve({
            success: false,
            error: 'Simulated task failure',
            remote: true,
            peerThread: peer.displayName
          });
        }
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  /**
   * Find best peer for a task and request help
   * @param {string} task - Task description
   * @param {Array} requiredSkills - Skills needed
   * @returns {Promise<Object>} - Task result
   */
  async findAndRequestHelp(task, requiredSkills = []) {
    const peerManager = getPeerDiscoveryManager();

    // Find best peer
    const peer = peerManager.getBestPeerForTask(task, requiredSkills);

    if (!peer) {
      throw new Error('No suitable peer Thread found for this task');
    }

    console.log(`[RemoteTask] Selected ${peer.displayName} (reputation: ${peer.getCombinedReputation().toFixed(2)})`);

    // Request help
    return await this.requestRemoteHelp(peer, task, {
      requiredSkills,
      originalNode: 'local-worker'
    });
  }

  /**
   * Try multiple peers until one succeeds
   * @param {string} task - Task description
   * @param {Array} requiredSkills - Skills needed
   * @param {number} maxAttempts - Maximum peers to try
   * @returns {Promise<Object>} - Task result
   */
  async findAndRequestHelpWithFallback(task, requiredSkills = [], maxAttempts = 3) {
    const peerManager = getPeerDiscoveryManager();
    const candidates = peerManager.findPeersWithSkill(requiredSkills[0]);

    if (candidates.length === 0) {
      throw new Error('No peer Threads available with required skills');
    }

    const errors = [];

    for (let i = 0; i < Math.min(maxAttempts, candidates.length); i++) {
      const peer = candidates[i];

      try {
        console.log(`[RemoteTask] Attempt ${i + 1}: Trying ${peer.displayName}...`);
        const result = await this.requestRemoteHelp(peer, task, {
          requiredSkills,
          originalNode: 'local-worker'
        });

        if (result.success) {
          return result;
        }

        errors.push(`${peer.displayName}: ${result.error}`);
      } catch (error) {
        errors.push(`${peer.displayName}: ${error.message}`);
        console.error(`[RemoteTask] ${peer.displayName} failed:`, error.message);
      }
    }

    // All attempts failed
    throw new Error(`All peer attempts failed:\n${errors.join('\n')}`);
  }

  /**
   * Get recent request history
   */
  getRecentRequests(count = 10) {
    return this.requestHistory.slice(-count).reverse();
  }

  /**
   * Get request statistics
   */
  getStats() {
    const total = this.requestHistory.length;
    const successful = this.requestHistory.filter(r => r.outcome === 'success').length;
    const failed = this.requestHistory.filter(r => r.outcome === 'failure').length;
    const errors = this.requestHistory.filter(r => r.outcome === 'error').length;

    const durations = this.requestHistory
      .filter(r => r.duration)
      .map(r => r.duration);

    const avgDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    return {
      totalRequests: total,
      successful,
      failed,
      errors,
      successRate: total > 0 ? successful / total : 0,
      averageDuration: avgDuration,
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Singleton instance
let remoteTaskManager = null;

export const getRemoteTaskManager = () => {
  if (!remoteTaskManager) {
    remoteTaskManager = new RemoteTaskManager();
  }
  return remoteTaskManager;
};

/**
 * Helper function to check if remote help is available
 */
export const isRemoteHelpAvailable = (requiredSkills = []) => {
  const peerManager = getPeerDiscoveryManager();
  const connectedPeers = peerManager.getConnectedPeers();

  if (connectedPeers.length === 0) {
    return false;
  }

  if (requiredSkills.length === 0) {
    return connectedPeers.some(p => p.isAvailable());
  }

  return requiredSkills.some(skill =>
    peerManager.findPeersWithSkill(skill).length > 0
  );
};
