/**
 * Peer Discovery Service
 * Discovers and connects to other Thread instances for federated networking
 * Supports multiple discovery mechanisms:
 * - Local network (simulated for browser)
 * - Manual peer addition
 * - Bootstrap servers (future)
 * - DHT (future)
 */

import { getThreadIdentity } from './threadIdentityService';

/**
 * Represents a peer Thread instance
 */
export class PeerThread {
  constructor(manifest) {
    this.threadId = manifest.threadId;
    this.displayName = manifest.displayName;
    this.publicKey = manifest.publicKey;
    this.protocolVersion = manifest.protocolVersion;
    this.capabilities = manifest.capabilities || [];
    this.reputation = manifest.reputation || { score: 0.5, tier: 'Novice' };
    this.nodes = manifest.nodes || {};
    this.acceptsRemoteRequests = manifest.acceptsRemoteRequests !== false;
    this.maxConcurrentRequests = manifest.maxConcurrentRequests || 5;
    this.responseTimeAvg = manifest.responseTimeAvg || 0;

    // Connection state
    this.status = 'discovered'; // discovered, connecting, connected, disconnected, error
    this.lastSeen = new Date();
    this.connection = null;
    this.currentRequests = 0;

    // Trust and history
    this.localReputation = 0.5; // Our assessment of this peer
    this.tasksRequested = 0;
    this.tasksCompleted = 0;
    this.tasksHelped = 0;
    this.lastInteraction = null;
  }

  /**
   * Check if this peer can help with a specific skill
   */
  hasSkill(skill) {
    return this.capabilities.some(cap =>
      cap.skill.toLowerCase() === skill.toLowerCase()
    );
  }

  /**
   * Check if peer is available for requests
   */
  isAvailable() {
    return this.status === 'connected' &&
           this.acceptsRemoteRequests &&
           this.currentRequests < this.maxConcurrentRequests;
  }

  /**
   * Get combined reputation (their reported + our local assessment)
   */
  getCombinedReputation() {
    // Weight: 60% their reputation, 40% our local assessment
    return (this.reputation.score * 0.6) + (this.localReputation * 0.4);
  }

  /**
   * Update local reputation based on interaction outcome
   */
  updateLocalReputation(success, responseTime) {
    const oldRep = this.localReputation;

    if (success) {
      // Increase reputation for successful interactions
      this.localReputation = Math.min(1.0, oldRep + 0.05);
    } else {
      // Decrease for failures
      this.localReputation = Math.max(0.0, oldRep - 0.1);
    }

    // Factor in response time (faster is better)
    if (responseTime && responseTime < this.responseTimeAvg * 0.8) {
      this.localReputation = Math.min(1.0, this.localReputation + 0.02);
    }

    this.lastInteraction = new Date();
  }

  toJSON() {
    return {
      threadId: this.threadId,
      displayName: this.displayName,
      capabilities: this.capabilities,
      reputation: this.reputation,
      localReputation: this.localReputation,
      status: this.status,
      tasksCompleted: this.tasksCompleted,
      tasksHelped: this.tasksHelped
    };
  }
}

/**
 * Peer Discovery and Connection Manager
 */
export class PeerDiscoveryManager {
  constructor() {
    this.peers = new Map(); // threadId -> PeerThread
    this.discoveryEnabled = false;
    this.discoveryMethods = {
      local: false,
      manual: true,
      dht: false,
      bootstrap: false
    };

    // Event listeners
    this.listeners = {
      peerDiscovered: [],
      peerConnected: [],
      peerDisconnected: [],
      peerError: []
    };
  }

  /**
   * Start peer discovery
   */
  startDiscovery() {
    this.discoveryEnabled = true;
    console.log('[PeerDiscovery] Discovery started');

    // In browser context, we'll primarily use manual peer addition
    // Future: Implement WebRTC-based local discovery
    if (this.discoveryMethods.local) {
      this.startLocalDiscovery();
    }
  }

  /**
   * Stop peer discovery
   */
  stopDiscovery() {
    this.discoveryEnabled = false;
    console.log('[PeerDiscovery] Discovery stopped');
  }

  /**
   * Local network discovery (simulated for browser)
   * In production, this would use mDNS or WebRTC
   */
  startLocalDiscovery() {
    // Placeholder for local discovery
    // In a real implementation:
    // - Use WebRTC for peer-to-peer connections
    // - Broadcast presence on local network
    // - Listen for other Thread instances
    console.log('[PeerDiscovery] Local discovery not yet implemented');
  }

  /**
   * Manually add a peer Thread
   */
  addPeer(manifest) {
    const peer = new PeerThread(manifest);

    // Don't add ourselves
    const myIdentity = getThreadIdentity();
    if (peer.threadId === myIdentity.threadId) {
      console.log('[PeerDiscovery] Ignoring self');
      return null;
    }

    // Check if already exists
    if (this.peers.has(peer.threadId)) {
      console.log(`[PeerDiscovery] Peer ${peer.displayName} already exists, updating`);
      const existing = this.peers.get(peer.threadId);
      // Update manifest
      existing.capabilities = peer.capabilities;
      existing.reputation = peer.reputation;
      existing.nodes = peer.nodes;
      existing.lastSeen = new Date();
      return existing;
    }

    this.peers.set(peer.threadId, peer);
    console.log(`[PeerDiscovery] Peer discovered: ${peer.displayName} (${peer.threadId})`);

    this.emit('peerDiscovered', peer);

    // Attempt connection
    this.connectToPeer(peer.threadId);

    return peer;
  }

  /**
   * Connect to a peer
   */
  async connectToPeer(threadId) {
    const peer = this.peers.get(threadId);
    if (!peer) {
      console.error(`[PeerDiscovery] Peer ${threadId} not found`);
      return false;
    }

    peer.status = 'connecting';
    console.log(`[PeerDiscovery] Connecting to ${peer.displayName}...`);

    try {
      // Simulated connection for now
      // In production: Establish WebRTC data channel or WebSocket

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      peer.status = 'connected';
      peer.lastSeen = new Date();

      console.log(`[PeerDiscovery] Connected to ${peer.displayName}`);
      this.emit('peerConnected', peer);

      return true;
    } catch (error) {
      peer.status = 'error';
      console.error(`[PeerDiscovery] Failed to connect to ${peer.displayName}:`, error);
      this.emit('peerError', { peer, error });
      return false;
    }
  }

  /**
   * Disconnect from a peer
   */
  disconnectPeer(threadId) {
    const peer = this.peers.get(threadId);
    if (!peer) return;

    peer.status = 'disconnected';
    peer.connection = null;

    console.log(`[PeerDiscovery] Disconnected from ${peer.displayName}`);
    this.emit('peerDisconnected', peer);
  }

  /**
   * Remove a peer completely
   */
  removePeer(threadId) {
    const peer = this.peers.get(threadId);
    if (!peer) return;

    this.disconnectPeer(threadId);
    this.peers.delete(threadId);

    console.log(`[PeerDiscovery] Removed peer ${peer.displayName}`);
  }

  /**
   * Get all connected peers
   */
  getConnectedPeers() {
    return Array.from(this.peers.values()).filter(p => p.status === 'connected');
  }

  /**
   * Get all peers
   */
  getAllPeers() {
    return Array.from(this.peers.values());
  }

  /**
   * Find peers with a specific skill
   */
  findPeersWithSkill(skill) {
    return this.getConnectedPeers()
      .filter(peer => peer.hasSkill(skill) && peer.isAvailable())
      .sort((a, b) => b.getCombinedReputation() - a.getCombinedReputation());
  }

  /**
   * Get best peer for a task based on skills and reputation
   */
  getBestPeerForTask(task, requiredSkills = []) {
    let candidates = this.getConnectedPeers().filter(p => p.isAvailable());

    if (requiredSkills.length > 0) {
      // Filter by skills
      candidates = candidates.filter(peer =>
        requiredSkills.some(skill => peer.hasSkill(skill))
      );
    }

    if (candidates.length === 0) {
      return null;
    }

    // Score candidates
    const scored = candidates.map(peer => {
      let score = peer.getCombinedReputation() * 10;

      // Bonus for matching skills
      requiredSkills.forEach(skill => {
        if (peer.hasSkill(skill)) {
          score += 2;
        }
      });

      // Bonus for fast response time
      if (peer.responseTimeAvg < 2.0) {
        score += 1;
      }

      // Bonus for low current load
      const loadFactor = peer.currentRequests / peer.maxConcurrentRequests;
      score += (1 - loadFactor) * 2;

      return { peer, score };
    });

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    return scored[0].peer;
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Get network statistics
   */
  getNetworkStats() {
    const all = this.getAllPeers();
    const connected = this.getConnectedPeers();

    return {
      totalPeers: all.length,
      connectedPeers: connected.length,
      disconnectedPeers: all.length - connected.length,
      totalCapabilities: new Set(
        connected.flatMap(p => p.capabilities.map(c => c.skill))
      ).size,
      averageReputation: connected.length > 0
        ? connected.reduce((sum, p) => sum + p.getCombinedReputation(), 0) / connected.length
        : 0,
      totalTasksCompleted: all.reduce((sum, p) => sum + p.tasksCompleted, 0),
      totalTasksHelped: all.reduce((sum, p) => sum + p.tasksHelped, 0)
    };
  }
}

// Singleton instance
let peerDiscoveryManager = null;

export const getPeerDiscoveryManager = () => {
  if (!peerDiscoveryManager) {
    peerDiscoveryManager = new PeerDiscoveryManager();
  }
  return peerDiscoveryManager;
};

/**
 * Create a Thread manifest for sharing with peers
 */
export const createThreadManifest = (nodes, reputationManager) => {
  const identity = getThreadIdentity();
  return identity.getManifest(nodes, reputationManager);
};
