/**
 * Reputation System - Tracks and manages node performance
 * Implements learning from successes and failures
 */

/**
 * Reputation metrics for a node
 */
class NodeReputation {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.totalTasks = 0;
    this.successfulTasks = 0;
    this.failedTasks = 0;
    this.collaborations = 0;
    this.successfulCollaborations = 0;
    this.roleSwitches = 0;
    this.successfulRoleSwitches = 0;
    this.helpProvided = 0;
    this.helpReceived = 0;
    this.validationsPassed = 0;
    this.validationsFailed = 0;
    this.averageResponseTime = 0;
    this.skillSuccessRate = {}; // Track success per skill
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Calculate overall reputation score (0-1)
   */
  getScore() {
    if (this.totalTasks === 0) return 0.5; // Neutral for new nodes

    const successRate = this.successfulTasks / this.totalTasks;
    const collaborationBonus = this.collaborations > 0
      ? (this.successfulCollaborations / this.collaborations) * 0.1
      : 0;
    const helpBonus = this.helpProvided > 0 ? 0.05 : 0;
    const validationPenalty = this.validationsFailed > 0
      ? (this.validationsFailed / (this.validationsPassed + this.validationsFailed)) * 0.1
      : 0;

    const score = Math.min(1, Math.max(0,
      successRate + collaborationBonus + helpBonus - validationPenalty
    ));

    return score;
  }

  /**
   * Get reputation tier
   */
  getTier() {
    const score = this.getScore();
    if (score >= 0.9) return 'Expert';
    if (score >= 0.75) return 'Advanced';
    if (score >= 0.6) return 'Proficient';
    if (score >= 0.4) return 'Developing';
    return 'Novice';
  }

  /**
   * Update after task completion
   */
  recordTask(success, duration = 0) {
    this.totalTasks++;
    if (success) {
      this.successfulTasks++;
    } else {
      this.failedTasks++;
    }

    // Update average response time
    if (duration > 0) {
      this.averageResponseTime = this.averageResponseTime === 0
        ? duration
        : (this.averageResponseTime + duration) / 2;
    }

    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Record collaboration event
   */
  recordCollaboration(success, provided = false) {
    this.collaborations++;
    if (success) {
      this.successfulCollaborations++;
    }
    if (provided) {
      this.helpProvided++;
    } else {
      this.helpReceived++;
    }
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Record role switch
   */
  recordRoleSwitch(success) {
    this.roleSwitches++;
    if (success) {
      this.successfulRoleSwitches++;
    }
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Record validation result
   */
  recordValidation(passed) {
    if (passed) {
      this.validationsPassed++;
    } else {
      this.validationsFailed++;
    }
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Record skill-specific success
   */
  recordSkillSuccess(skill, success) {
    if (!this.skillSuccessRate[skill]) {
      this.skillSuccessRate[skill] = { total: 0, successful: 0 };
    }
    this.skillSuccessRate[skill].total++;
    if (success) {
      this.skillSuccessRate[skill].successful++;
    }
  }

  /**
   * Get success rate for a specific skill
   */
  getSkillSuccessRate(skill) {
    if (!this.skillSuccessRate[skill] || this.skillSuccessRate[skill].total === 0) {
      return 0.5; // Neutral for unknown skills
    }
    return this.skillSuccessRate[skill].successful / this.skillSuccessRate[skill].total;
  }

  /**
   * Get performance summary
   */
  getSummary() {
    return {
      nodeId: this.nodeId,
      score: this.getScore(),
      tier: this.getTier(),
      totalTasks: this.totalTasks,
      successRate: this.totalTasks > 0 ? (this.successfulTasks / this.totalTasks) : 0,
      collaborationRate: this.collaborations > 0
        ? (this.successfulCollaborations / this.collaborations)
        : 0,
      helpProvided: this.helpProvided,
      helpReceived: this.helpReceived,
      roleSwitches: this.roleSwitches,
      averageResponseTime: this.averageResponseTime,
      lastUpdated: this.lastUpdated
    };
  }
}

/**
 * Reputation Manager - Manages all node reputations
 */
class ReputationManager {
  constructor() {
    this.reputations = new Map();
  }

  /**
   * Get or create reputation for a node
   */
  getReputation(nodeId) {
    if (!this.reputations.has(nodeId)) {
      this.reputations.set(nodeId, new NodeReputation(nodeId));
    }
    return this.reputations.get(nodeId);
  }

  /**
   * Record task result
   */
  recordTaskResult(nodeId, success, duration = 0, skills = []) {
    const reputation = this.getReputation(nodeId);
    reputation.recordTask(success, duration);

    // Record skill-specific success
    skills.forEach(skill => {
      reputation.recordSkillSuccess(skill, success);
    });
  }

  /**
   * Record collaboration
   */
  recordCollaboration(nodeId, success, provided = false) {
    const reputation = this.getReputation(nodeId);
    reputation.recordCollaboration(success, provided);
  }

  /**
   * Record role switch
   */
  recordRoleSwitch(nodeId, success) {
    const reputation = this.getReputation(nodeId);
    reputation.recordRoleSwitch(success);
  }

  /**
   * Record validation
   */
  recordValidation(nodeId, passed) {
    const reputation = this.getReputation(nodeId);
    reputation.recordValidation(passed);
  }

  /**
   * Get best workers for a task based on reputation and skills
   */
  getBestWorkers(workers, task, requiredSkills = []) {
    return workers
      .map(worker => {
        const reputation = this.getReputation(worker.id);
        const score = reputation.getScore();

        // Calculate skill match score
        let skillScore = 0;
        const workerSkills = worker.config.skills || [];

        requiredSkills.forEach(requiredSkill => {
          if (workerSkills.includes(requiredSkill)) {
            const skillSuccessRate = reputation.getSkillSuccessRate(requiredSkill);
            skillScore += skillSuccessRate * 10;
          }
        });

        // Bonus for workers who collaborate well
        const collaborationBonus = reputation.collaborations > 0
          ? (reputation.successfulCollaborations / reputation.collaborations) * 5
          : 0;

        // Overall score combines reputation, skills, and collaboration
        const totalScore = score * 10 + skillScore + collaborationBonus;

        return {
          worker,
          reputation,
          score: totalScore,
          tier: reputation.getTier()
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get best collaborators for a struggling worker
   */
  getBestCollaborators(allWorkers, strugglingWorker, task) {
    const strugglingReputation = this.getReputation(strugglingWorker.id);
    const strugglingSkills = strugglingWorker.config.skills || [];

    return allWorkers
      .filter(w => w.id !== strugglingWorker.id)
      .map(worker => {
        const reputation = this.getReputation(worker.id);
        const workerSkills = worker.config.skills || [];

        // Prefer workers with different skills (complementary)
        const complementarySkills = workerSkills.filter(
          skill => !strugglingSkills.includes(skill)
        );

        let score = reputation.getScore() * 10;
        score += complementarySkills.length * 2; // Bonus for different skills
        score += reputation.helpProvided * 1.5; // Bonus for being helpful

        return {
          worker,
          reputation,
          score,
          complementarySkills
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get network-wide statistics
   */
  getNetworkStats() {
    const allReputations = Array.from(this.reputations.values());

    if (allReputations.length === 0) {
      return {
        totalNodes: 0,
        averageScore: 0,
        totalTasks: 0,
        totalCollaborations: 0,
        totalRoleSwitches: 0
      };
    }

    const totalTasks = allReputations.reduce((sum, rep) => sum + rep.totalTasks, 0);
    const totalCollaborations = allReputations.reduce((sum, rep) => sum + rep.collaborations, 0);
    const totalRoleSwitches = allReputations.reduce((sum, rep) => sum + rep.roleSwitches, 0);
    const averageScore = allReputations.reduce((sum, rep) => sum + rep.getScore(), 0) / allReputations.length;

    return {
      totalNodes: allReputations.length,
      averageScore,
      totalTasks,
      totalCollaborations,
      totalRoleSwitches,
      topPerformers: this.getTopPerformers(5),
      networkHealth: this.calculateNetworkHealth()
    };
  }

  /**
   * Get top performing nodes
   */
  getTopPerformers(limit = 5) {
    return Array.from(this.reputations.values())
      .sort((a, b) => b.getScore() - a.getScore())
      .slice(0, limit)
      .map(rep => ({
        nodeId: rep.nodeId,
        score: rep.getScore(),
        tier: rep.getTier(),
        successRate: rep.totalTasks > 0 ? rep.successfulTasks / rep.totalTasks : 0
      }));
  }

  /**
   * Calculate overall network health (0-1)
   */
  calculateNetworkHealth() {
    const stats = Array.from(this.reputations.values());
    if (stats.length === 0) return 0.5;

    const avgScore = stats.reduce((sum, rep) => sum + rep.getScore(), 0) / stats.length;
    const collaborationRate = stats.reduce((sum, rep) => {
      return sum + (rep.collaborations > 0 ? rep.successfulCollaborations / rep.collaborations : 0);
    }, 0) / stats.length;

    return (avgScore + collaborationRate) / 2;
  }

  /**
   * Reset all reputations (for testing)
   */
  reset() {
    this.reputations.clear();
  }

  /**
   * Export reputation data
   */
  export() {
    const data = {};
    this.reputations.forEach((reputation, nodeId) => {
      data[nodeId] = reputation.getSummary();
    });
    return data;
  }

  /**
   * Import reputation data
   */
  import(data) {
    Object.entries(data).forEach(([nodeId, summary]) => {
      const reputation = this.getReputation(nodeId);
      Object.assign(reputation, summary);
    });
  }
}

// Global reputation manager instance
export const reputationManager = new ReputationManager();

/**
 * Update node objects with their reputation scores
 * @param {Array} nodes - Array of nodes
 * @returns {Array} - Nodes with reputation data
 */
export const enrichNodesWithReputation = (nodes) => {
  return nodes.map(node => ({
    ...node,
    reputation: reputationManager.getReputation(node.id).getScore(),
    reputationTier: reputationManager.getReputation(node.id).getTier(),
    reputationData: reputationManager.getReputation(node.id).getSummary()
  }));
};

export default {
  NodeReputation,
  ReputationManager,
  reputationManager,
  enrichNodesWithReputation
};
