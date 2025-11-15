/**
 * Collaboration Service - Handles worker-to-worker collaboration and dynamic role switching
 * Implements advanced features from Steps 3-5:
 * - Worker collaboration with formal messaging protocol
 * - Dynamic role flipping
 * - Failure detection and recovery
 * - Skill-based task routing
 * - Reputation-based collaborator selection
 * - Agent-to-agent communication
 */

import { executeTask } from './apiService';
import { requestHelp, offerHelp, messageHistory } from './messagingService';
import { reputationManager } from './reputationService';
import { validateWithFeedback, retryWithFeedback, assessTaskClarity } from './validationService';
import { getRemoteTaskManager, isRemoteHelpAvailable } from './remoteTaskService';

/**
 * Process task with collaboration and dynamic role switching
 * @param {Object} startNode - The starting node
 * @param {string} task - The task to process
 * @param {Array} allNodes - All available nodes
 * @param {Array} connections - Node connections
 * @param {number} attemptNumber - Current attempt number
 * @returns {Promise<Object>} - Collaboration result
 */
export const processWithCollaboration = async (
  startNode,
  task,
  allNodes,
  connections,
  attemptNumber = 1
) => {
  const collaborationLog = [];
  const maxRetries = startNode.config.systemParams?.maxRetries || 3;

  try {
    // Start processing based on node type
    switch (startNode.type) {
      case 'architect':
        return await processArchitectWithCollaboration(
          startNode,
          task,
          allNodes,
          connections,
          collaborationLog,
          attemptNumber
        );

      case 'broker':
        return await processBrokerWithCollaboration(
          startNode,
          task,
          allNodes,
          connections,
          collaborationLog,
          attemptNumber
        );

      case 'worker':
        return await processWorkerWithCollaboration(
          startNode,
          task,
          allNodes,
          connections,
          collaborationLog,
          attemptNumber,
          maxRetries
        );

      case 'validator':
        return await processValidatorWithCollaboration(
          startNode,
          task,
          allNodes,
          connections,
          collaborationLog
        );

      default:
        throw new Error(`Unknown node type: ${startNode.type}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      collaborationLog
    };
  }
};

/**
 * Architect with collaboration support
 */
async function processArchitectWithCollaboration(
  node,
  task,
  allNodes,
  connections,
  log,
  attemptNumber
) {
  log.push({
    nodeId: node.id,
    nodeType: 'architect',
    action: 'received_task',
    message: `Architect ${node.id} received task (attempt ${attemptNumber})`,
    attemptNumber
  });

  // Find connected brokers
  const brokerConnections = connections.filter(conn => conn.from === node.id);
  const connectedBrokers = brokerConnections
    .map(conn => allNodes.find(n => n.id === conn.to && n.type === 'broker'))
    .filter(Boolean);

  if (connectedBrokers.length === 0) {
    // No brokers, execute directly
    log.push({
      nodeId: node.id,
      nodeType: 'architect',
      action: 'no_brokers',
      message: 'No brokers available, executing task directly'
    });

    const result = await executeTask(node.config, task);
    return {
      success: result.success,
      data: result.data,
      collaborationLog: log,
      executedBy: node.id,
      roleSwitch: false
    };
  }

  // Delegate to broker
  const broker = connectedBrokers[0];
  log.push({
    nodeId: node.id,
    nodeType: 'architect',
    action: 'delegating_to_broker',
    message: `Delegating to broker ${broker.id}`
  });

  return await processBrokerWithCollaboration(
    broker,
    task,
    allNodes,
    connections,
    log,
    attemptNumber
  );
}

/**
 * Broker with skill-based worker selection
 */
async function processBrokerWithCollaboration(
  node,
  task,
  allNodes,
  connections,
  log,
  attemptNumber
) {
  log.push({
    nodeId: node.id,
    nodeType: 'broker',
    action: 'received_task',
    message: `Broker ${node.id} analyzing task for skill match`,
    attemptNumber
  });

  // Find connected workers
  const workerConnections = connections.filter(conn => conn.from === node.id);
  const connectedWorkers = workerConnections
    .map(conn => allNodes.find(n => n.id === conn.to && n.type === 'worker'))
    .filter(Boolean);

  if (connectedWorkers.length === 0) {
    // No workers, broker executes directly
    log.push({
      nodeId: node.id,
      nodeType: 'broker',
      action: 'no_workers',
      message: 'No workers available, executing task directly'
    });

    const result = await executeTask(node.config, task);
    return {
      success: result.success,
      data: result.data,
      collaborationLog: log,
      executedBy: node.id,
      roleSwitch: false
    };
  }

  // Find best worker based on skills
  const bestWorker = findBestWorkerForTask(connectedWorkers, task);

  log.push({
    nodeId: node.id,
    nodeType: 'broker',
    action: 'assigning_to_worker',
    message: `Assigned to worker ${bestWorker.id}${
      bestWorker.config.skills?.length > 0
        ? ` (skills: ${bestWorker.config.skills.join(', ')})`
        : ''
    }`
  });

  return await processWorkerWithCollaboration(
    bestWorker,
    task,
    allNodes,
    connections,
    log,
    attemptNumber,
    bestWorker.config.systemParams?.maxRetries || 3
  );
}

/**
 * Worker with collaboration and dynamic role switching
 */
async function processWorkerWithCollaboration(
  node,
  task,
  allNodes,
  connections,
  log,
  attemptNumber,
  maxRetries
) {
  log.push({
    nodeId: node.id,
    nodeType: 'worker',
    action: 'executing_task',
    message: `Worker ${node.id} executing task (attempt ${attemptNumber}/${maxRetries})`,
    attemptNumber
  });

  try {
    const result = await executeTask(node.config, task);

    if (result.success) {
      log.push({
        nodeId: node.id,
        nodeType: 'worker',
        action: 'task_complete',
        message: `Worker ${node.id} completed task successfully`,
        success: true
      });

      return {
        success: true,
        data: result.data,
        collaborationLog: log,
        executedBy: node.id,
        roleSwitch: false
      };
    }

    // Task failed
    throw new Error(result.error || 'Task execution failed');
  } catch (error) {
    log.push({
      nodeId: node.id,
      nodeType: 'worker',
      action: 'task_failed',
      message: `Worker ${node.id} encountered error: ${error.message}`,
      success: false,
      attemptNumber
    });

    // Check if we should try collaboration
    if (attemptNumber < maxRetries && node.config.canCollaborate) {
      log.push({
        nodeId: node.id,
        nodeType: 'worker',
        action: 'seeking_collaboration',
        message: `Worker ${node.id} seeking help from peers`
      });

      // Find other workers who might help
      const result = await seekCollaboration(
        node,
        task,
        allNodes,
        connections,
        log,
        attemptNumber,
        error.message
      );

      if (result.success) {
        return result;
      }
    }

    // If collaboration failed or not available, check if worker can lead
    if (attemptNumber >= maxRetries && node.config.canLead) {
      log.push({
        nodeId: node.id,
        nodeType: 'worker',
        action: 'becoming_architect',
        message: `Worker ${node.id} taking lead role due to repeated failures`,
        roleSwitch: true
      });

      return await workerBecomesArchitect(
        node,
        task,
        allNodes,
        connections,
        log,
        error.message
      );
    }

    // All attempts failed
    return {
      success: false,
      error: `Worker ${node.id} failed after ${attemptNumber} attempts: ${error.message}`,
      collaborationLog: log,
      executedBy: node.id,
      roleSwitch: false
    };
  }
}

/**
 * Worker seeks help from other workers - Enhanced with formal messaging and reputation
 */
async function seekCollaboration(
  node,
  task,
  allNodes,
  connections,
  log,
  attemptNumber,
  previousError
) {
  // Find other available workers
  const allWorkers = allNodes.filter(n => n.type === 'worker' && n.id !== node.id);

  if (allWorkers.length === 0) {
    log.push({
      nodeId: node.id,
      nodeType: 'worker',
      action: 'no_collaborators',
      message: 'No other workers available for collaboration'
    });

    return { success: false };
  }

  // Use reputation system to find best collaborator
  const rankedCollaborators = reputationManager.getBestCollaborators(
    allWorkers,
    node,
    task
  );

  // Try collaborators in order of reputation
  for (const { worker: collaborator, reputation, complementarySkills } of rankedCollaborators) {
    // Send formal help request message
    const helpRequest = requestHelp(node, collaborator, task, {
      reason: previousError,
      attemptNumber,
      errors: [previousError]
    });
    messageHistory.add(helpRequest);

    log.push({
      nodeId: node.id,
      nodeType: 'worker',
      action: 'requesting_help_via_protocol',
      message: `Worker ${node.id} sending help request to ${collaborator.id} (reputation: ${reputation.getScore().toFixed(2)}, complementary skills: ${complementarySkills.join(', ') || 'none'})`,
      messageId: helpRequest.id,
      protocol: true
    });

    // Collaborator evaluates request and responds
    const canHelp = collaborator.config.canCollaborate !== false &&
                    reputation.getScore() > 0.3; // Minimum reputation threshold

    const helpOffer = offerHelp(helpRequest, collaborator, canHelp,
      canHelp
        ? `I can help with this task (skills: ${collaborator.config.skills?.join(', ') || 'general'})`
        : 'Unable to assist at this time'
    );
    messageHistory.add(helpOffer);

    if (!canHelp) {
      log.push({
        nodeId: collaborator.id,
        nodeType: 'worker',
        action: 'declined_help',
        message: `Worker ${collaborator.id} declined to help`,
        messageId: helpOffer.id
      });
      continue; // Try next collaborator
    }

    log.push({
      nodeId: collaborator.id,
      nodeType: 'worker',
      action: 'accepting_help_request',
      message: `Worker ${collaborator.id} accepting help request`,
      collaboration: true,
      messageId: helpOffer.id
    });

    try {
      const startTime = Date.now();
      const result = await executeTask(
        collaborator.config,
        `Help with this task (previous attempt by ${node.id} failed: ${previousError}): ${task}`
      );
      const duration = Date.now() - startTime;

      if (result.success) {
        // Record successful collaboration in reputation system
        reputationManager.recordCollaboration(node.id, true, false); // Received help
        reputationManager.recordCollaboration(collaborator.id, true, true); // Provided help
        reputationManager.recordTaskResult(collaborator.id, true, duration, collaborator.config.skills || []);

        log.push({
          nodeId: collaborator.id,
          nodeType: 'worker',
          action: 'collaboration_success',
          message: `Worker ${collaborator.id} successfully assisted ${node.id}`,
          success: true,
          collaboration: true,
          duration: `${duration}ms`
        });

        return {
          success: true,
          data: result.data,
          collaborationLog: log,
          executedBy: collaborator.id,
          assistedBy: collaborator.id,
          originalWorker: node.id,
          roleSwitch: false,
          messageHistory: [helpRequest.id, helpOffer.id]
        };
      }

      // Collaboration failed, record and try next
      reputationManager.recordCollaboration(node.id, false, false);
      reputationManager.recordCollaboration(collaborator.id, false, true);
      reputationManager.recordTaskResult(collaborator.id, false, duration, collaborator.config.skills || []);

    } catch (error) {
      log.push({
        nodeId: collaborator.id,
        nodeType: 'worker',
        action: 'collaboration_failed',
        message: `Worker ${collaborator.id} also failed: ${error.message}`,
        success: false,
        collaboration: true
      });

      // Record failed collaboration
      reputationManager.recordCollaboration(node.id, false, false);
      reputationManager.recordCollaboration(collaborator.id, false, true);

      // Continue to next collaborator
    }
  }

  // All local collaborators failed or declined
  log.push({
    nodeId: node.id,
    nodeType: 'worker',
    action: 'all_local_collaborators_failed',
    message: 'All local collaborators either declined or failed to help'
  });

  // Try remote help from peer Threads as final fallback
  const skills = node.config.skills || [];
  if (isRemoteHelpAvailable(skills)) {
    log.push({
      nodeId: node.id,
      nodeType: 'worker',
      action: 'seeking_remote_help',
      message: `No local help available, seeking assistance from peer Thread instances`,
      federated: true
    });

    try {
      const remoteManager = getRemoteTaskManager();
      const remoteResult = await remoteManager.findAndRequestHelpWithFallback(
        task,
        skills,
        2 // Try up to 2 remote peers
      );

      if (remoteResult.success) {
        // Record successful remote collaboration
        reputationManager.recordCollaboration(node.id, true, false);

        log.push({
          nodeId: 'remote-thread',
          nodeType: 'worker',
          action: 'remote_collaboration_success',
          message: `Remote Thread (${remoteResult.peerThread}) successfully assisted ${node.id}`,
          success: true,
          collaboration: true,
          federated: true
        });

        return {
          success: true,
          data: remoteResult.data,
          collaborationLog: log,
          executedBy: remoteResult.executedBy,
          assistedBy: remoteResult.peerThread,
          originalWorker: node.id,
          roleSwitch: false,
          remote: true,
          federatedCollaboration: true
        };
      }
    } catch (remoteError) {
      log.push({
        nodeId: node.id,
        nodeType: 'worker',
        action: 'remote_help_failed',
        message: `Remote help also failed: ${remoteError.message}`,
        federated: true
      });

      // Record failed remote attempt
      reputationManager.recordCollaboration(node.id, false, false);
    }
  }

  return { success: false };
}

/**
 * Worker becomes temporary architect (role flip)
 */
async function workerBecomesArchitect(
  node,
  task,
  allNodes,
  connections,
  log,
  previousError
) {
  log.push({
    nodeId: node.id,
    nodeType: 'architect', // Now acting as architect
    action: 'role_switched',
    message: `Worker ${node.id} now acting as Architect - re-decomposing task`,
    roleSwitch: true
  });

  // Worker analyzes the problem and tries a different approach
  const reframedTask = `Task requires alternative approach (previous attempts failed: ${previousError}).
Please analyze and provide a solution for: ${task}`;

  try {
    const result = await executeTask(node.config, reframedTask);

    if (result.success) {
      log.push({
        nodeId: node.id,
        nodeType: 'architect',
        action: 'reframed_success',
        message: `Worker-turned-Architect ${node.id} solved problem with new approach`,
        success: true,
        roleSwitch: true
      });

      return {
        success: true,
        data: result.data,
        collaborationLog: log,
        executedBy: node.id,
        roleSwitch: true,
        originalRole: 'worker',
        newRole: 'architect'
      };
    }

    throw new Error('Reframed approach also failed');
  } catch (error) {
    log.push({
      nodeId: node.id,
      nodeType: 'architect',
      action: 'reframe_failed',
      message: `Even after role switch, ${node.id} could not solve the task`,
      success: false,
      roleSwitch: true
    });

    return {
      success: false,
      error: `All approaches exhausted for task: ${error.message}`,
      collaborationLog: log,
      executedBy: node.id,
      roleSwitch: true
    };
  }
}

/**
 * Validator with collaboration context
 */
async function processValidatorWithCollaboration(
  node,
  task,
  allNodes,
  connections,
  log
) {
  log.push({
    nodeId: node.id,
    nodeType: 'validator',
    action: 'validating',
    message: `Validator ${node.id} independently verifying task`
  });

  const result = await executeTask(node.config, `Validate the following: ${task}`);

  log.push({
    nodeId: node.id,
    nodeType: 'validator',
    action: 'validation_complete',
    message: `Validation ${result.success ? 'passed' : 'failed'}`,
    success: result.success
  });

  return {
    success: result.success,
    data: result.data,
    collaborationLog: log,
    executedBy: node.id,
    validated: true,
    roleSwitch: false
  };
}

/**
 * Find the best worker for a task based on skills
 * @param {Array} workers - Available workers
 * @param {string} task - Task description
 * @returns {Object} - Selected worker
 */
function findBestWorkerForTask(workers, task) {
  const taskLower = task.toLowerCase();

  // Score each worker based on skill match
  const scoredWorkers = workers.map(worker => {
    let score = 0;
    const skills = worker.config.skills || [];

    // Check if any skills match keywords in the task
    skills.forEach(skill => {
      if (taskLower.includes(skill.toLowerCase())) {
        score += 10;
      }
    });

    // Bonus for workers with more skills (more versatile)
    score += skills.length;

    return { worker, score };
  });

  // Sort by score (highest first)
  scoredWorkers.sort((a, b) => b.score - a.score);

  // Return best match (or first worker if no skills match)
  return scoredWorkers[0].worker;
}

/**
 * Match task keywords to skills
 * @param {string} task - Task description
 * @param {Array} skills - Available skills
 * @returns {number} - Match score
 */
export const calculateSkillMatch = (task, skills) => {
  if (!skills || skills.length === 0) return 0;

  const taskLower = task.toLowerCase();
  let matchScore = 0;

  skills.forEach(skill => {
    if (taskLower.includes(skill.toLowerCase())) {
      matchScore += 10;
    }
  });

  return matchScore;
};
