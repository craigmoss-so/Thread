/**
 * Delegation Service - Handles task routing between nodes
 * Implements the hierarchical delegation model:
 * Architect -> Broker -> Worker
 */

import { executeTask } from './apiService';

/**
 * Process a task through the node network
 * @param {Object} startNode - The starting node (usually Architect)
 * @param {string} task - The task to process
 * @param {Array} allNodes - All available nodes
 * @param {Array} connections - Node connections
 * @returns {Promise<Object>} - Delegation result
 */
export const delegateTask = async (startNode, task, allNodes, connections) => {
  const delegationLog = [];

  try {
    // Start delegation based on node type
    switch (startNode.type) {
      case 'architect':
        return await processAsArchitect(startNode, task, allNodes, connections, delegationLog);

      case 'broker':
        return await processAsBroker(startNode, task, allNodes, connections, delegationLog);

      case 'worker':
        return await processAsWorker(startNode, task, delegationLog);

      case 'validator':
        return await processAsValidator(startNode, task, allNodes, connections, delegationLog);

      default:
        throw new Error(`Unknown node type: ${startNode.type}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      delegationLog
    };
  }
};

/**
 * Architect: Breaks down task and delegates to brokers
 */
async function processAsArchitect(node, task, allNodes, connections, log) {
  log.push({
    nodeId: node.id,
    nodeType: 'architect',
    action: 'received_task',
    message: `Architect ${node.id} received task`
  });

  // Find connected brokers
  const brokerConnections = connections.filter(conn => conn.from === node.id);
  const connectedBrokers = brokerConnections
    .map(conn => allNodes.find(n => n.id === conn.to && n.type === 'broker'))
    .filter(Boolean);

  if (connectedBrokers.length === 0) {
    // No brokers, architect executes directly
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
      delegationLog: log,
      executedBy: node.id
    };
  }

  // Delegate to first available broker
  const broker = connectedBrokers[0];
  log.push({
    nodeId: node.id,
    nodeType: 'architect',
    action: 'delegating_to_broker',
    message: `Delegating to broker ${broker.id}`
  });

  return await processAsBroker(broker, task, allNodes, connections, log);
}

/**
 * Broker: Routes task to appropriate worker
 */
async function processAsBroker(node, task, allNodes, connections, log) {
  log.push({
    nodeId: node.id,
    nodeType: 'broker',
    action: 'received_task',
    message: `Broker ${node.id} received task`
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
      delegationLog: log,
      executedBy: node.id
    };
  }

  // Find best worker (for now, just use first available)
  const worker = connectedWorkers[0];
  log.push({
    nodeId: node.id,
    nodeType: 'broker',
    action: 'assigning_to_worker',
    message: `Assigning to worker ${worker.id}`
  });

  return await processAsWorker(worker, task, log);
}

/**
 * Worker: Executes the task
 */
async function processAsWorker(node, task, log) {
  log.push({
    nodeId: node.id,
    nodeType: 'worker',
    action: 'executing_task',
    message: `Worker ${node.id} executing task`
  });

  const result = await executeTask(node.config, task);

  log.push({
    nodeId: node.id,
    nodeType: 'worker',
    action: 'task_complete',
    message: `Worker ${node.id} completed task`,
    success: result.success
  });

  return {
    success: result.success,
    data: result.data,
    error: result.error,
    delegationLog: log,
    executedBy: node.id
  };
}

/**
 * Validator: Validates results from other nodes
 */
async function processAsValidator(node, task, allNodes, connections, log) {
  log.push({
    nodeId: node.id,
    nodeType: 'validator',
    action: 'validating',
    message: `Validator ${node.id} validating task`
  });

  // For now, validators just execute and add validation context
  const result = await executeTask(node.config,
    `Validate the following: ${task}`
  );

  log.push({
    nodeId: node.id,
    nodeType: 'validator',
    action: 'validation_complete',
    message: 'Validation complete'
  });

  return {
    success: result.success,
    data: result.data,
    delegationLog: log,
    executedBy: node.id,
    validated: true
  };
}

/**
 * Find the best worker for a task based on skills
 * @param {Array} workers - Available workers
 * @param {string} task - Task description
 * @returns {Object} - Selected worker
 */
export const findBestWorker = (workers, task) => {
  // Simple implementation: return first worker
  // Future: implement skill matching
  return workers[0];
};

/**
 * Send message between nodes
 * @param {Object} fromNode - Source node
 * @param {Object} toNode - Destination node
 * @param {Object} message - Message content
 * @returns {Object} - Message result
 */
export const sendMessage = (fromNode, toNode, message) => {
  return {
    from: fromNode.id,
    to: toNode.id,
    message: message,
    timestamp: new Date().toISOString()
  };
};
