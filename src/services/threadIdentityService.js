/**
 * Thread Identity Service
 * Generates and manages Thread instance identity for federated networking
 * Each Thread has a unique cryptographic identity for peer-to-peer trust
 */

/**
 * Generate a unique Thread ID
 * In production, this would use proper cryptographic key generation
 * For now, using a simplified version
 */
export const generateThreadId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `thread-${timestamp}-${random}`;
};

/**
 * Thread Identity
 * Represents the identity of this Thread instance in the network
 */
export class ThreadIdentity {
  constructor(displayName = 'My Thread') {
    this.threadId = this.loadOrGenerateId();
    this.displayName = displayName;
    this.publicKey = null; // TODO: Implement proper PKI
    this.privateKey = null;
    this.createdAt = new Date().toISOString();
    this.protocolVersion = '1.0.0';
  }

  loadOrGenerateId() {
    // Try to load from localStorage
    const stored = localStorage.getItem('threadIdentity');
    if (stored) {
      try {
        const identity = JSON.parse(stored);
        return identity.threadId;
      } catch (e) {
        console.error('Failed to load stored identity:', e);
      }
    }

    // Generate new ID
    return generateThreadId();
  }

  save() {
    const identity = {
      threadId: this.threadId,
      displayName: this.displayName,
      createdAt: this.createdAt,
      publicKey: this.publicKey
    };
    localStorage.setItem('threadIdentity', JSON.stringify(identity));
  }

  load() {
    const stored = localStorage.getItem('threadIdentity');
    if (stored) {
      try {
        const identity = JSON.parse(stored);
        this.threadId = identity.threadId;
        this.displayName = identity.displayName;
        this.createdAt = identity.createdAt;
        this.publicKey = identity.publicKey;
      } catch (e) {
        console.error('Failed to load identity:', e);
      }
    }
  }

  /**
   * Get Thread manifest - information about this Thread's capabilities
   * @param {Array} nodes - Local nodes in this Thread
   * @param {Object} reputationManager - Reputation manager instance
   */
  getManifest(nodes, reputationManager) {
    // Aggregate capabilities from all nodes
    const workers = nodes.filter(n => n.type === 'worker');
    const skillMap = {};

    workers.forEach(worker => {
      const skills = worker.config.skills || [];
      skills.forEach(skill => {
        if (!skillMap[skill]) {
          skillMap[skill] = { count: 0, nodes: [] };
        }
        skillMap[skill].count++;
        skillMap[skill].nodes.push(worker.id);
      });
    });

    const capabilities = Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      workerCount: data.count,
      availability: 'high' // TODO: Calculate based on load
    }));

    // Get network stats from reputation manager
    const stats = reputationManager.getNetworkStats();

    return {
      threadId: this.threadId,
      displayName: this.displayName,
      publicKey: this.publicKey,
      protocolVersion: this.protocolVersion,
      capabilities,
      reputation: {
        score: stats.networkHealth,
        tasksCompleted: stats.successfulTasks,
        tier: stats.networkHealth >= 0.9 ? 'Expert' :
              stats.networkHealth >= 0.75 ? 'Advanced' :
              stats.networkHealth >= 0.6 ? 'Proficient' :
              stats.networkHealth >= 0.4 ? 'Developing' : 'Novice'
      },
      nodes: {
        total: nodes.length,
        workers: workers.length,
        architects: nodes.filter(n => n.type === 'architect').length,
        brokers: nodes.filter(n => n.type === 'broker').length,
        validators: nodes.filter(n => n.type === 'validator').length
      },
      acceptsRemoteRequests: true, // TODO: Make configurable
      maxConcurrentRequests: 5,
      responseTimeAvg: 2.5, // TODO: Calculate from actual metrics
      timestamp: new Date().toISOString()
    };
  }

  toString() {
    return `Thread[${this.displayName}:${this.threadId}]`;
  }
}

// Singleton instance
let threadIdentityInstance = null;

export const getThreadIdentity = () => {
  if (!threadIdentityInstance) {
    threadIdentityInstance = new ThreadIdentity();
    threadIdentityInstance.load();
  }
  return threadIdentityInstance;
};

export const setThreadDisplayName = (displayName) => {
  const identity = getThreadIdentity();
  identity.displayName = displayName;
  identity.save();
  return identity;
};
