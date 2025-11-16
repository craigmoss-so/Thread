/**
 * Agent-to-Agent Messaging Protocol
 * Formal communication system between nodes
 */

/**
 * Message types for inter-node communication
 */
export const MessageType = {
  REQUEST_HELP: 'request_help',
  OFFER_HELP: 'offer_help',
  TASK_RESULT: 'task_result',
  VALIDATION_REQUEST: 'validation_request',
  VALIDATION_RESULT: 'validation_result',
  CLARIFICATION_REQUEST: 'clarification_request',
  CLARIFICATION_RESPONSE: 'clarification_response',
  STATUS_UPDATE: 'status_update',
  SKILL_ADVERTISEMENT: 'skill_advertisement',
  COLLABORATION_INVITE: 'collaboration_invite',
  COLLABORATION_RESPONSE: 'collaboration_response'
};

/**
 * Message priority levels
 */
export const MessagePriority = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  URGENT: 4
};

/**
 * Create a formal message between nodes
 * @param {Object} params - Message parameters
 * @returns {Object} - Formatted message
 */
export const createMessage = ({
  from,
  to,
  type,
  content,
  priority = MessagePriority.NORMAL,
  context = {}
}) => {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    type,
    content,
    priority,
    context,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
};

/**
 * Request help from another worker
 * @param {Object} fromNode - Requesting node
 * @param {Object} toNode - Target node
 * @param {string} task - Task that needs help
 * @param {Object} failureContext - Previous failure information
 * @returns {Object} - Help request message
 */
export const requestHelp = (fromNode, toNode, task, failureContext = {}) => {
  return createMessage({
    from: fromNode.id,
    to: toNode.id,
    type: MessageType.REQUEST_HELP,
    priority: MessagePriority.HIGH,
    content: {
      task,
      reason: failureContext.reason || 'Task failed',
      attemptNumber: failureContext.attemptNumber || 1,
      previousErrors: failureContext.errors || [],
      requestingNodeSkills: fromNode.config.skills || []
    },
    context: {
      fromNodeType: fromNode.type,
      toNodeType: toNode.type,
      collaboration: true
    }
  });
};

/**
 * Offer help in response to a request
 * @param {Object} originalMessage - Original help request
 * @param {Object} fromNode - Responding node
 * @param {boolean} canHelp - Whether node can assist
 * @param {string} reason - Reason for acceptance/rejection
 * @returns {Object} - Help offer message
 */
export const offerHelp = (originalMessage, fromNode, canHelp, reason = '') => {
  return createMessage({
    from: fromNode.id,
    to: originalMessage.from,
    type: MessageType.OFFER_HELP,
    priority: MessagePriority.HIGH,
    content: {
      canHelp,
      reason,
      skills: fromNode.config.skills || [],
      reputation: fromNode.reputation || 0
    },
    context: {
      originalMessageId: originalMessage.id,
      collaboration: true
    }
  });
};

/**
 * Request validation from a validator
 * @param {Object} fromNode - Node requesting validation
 * @param {Object} toNode - Validator node
 * @param {string} task - Original task
 * @param {string} result - Result to validate
 * @returns {Object} - Validation request message
 */
export const requestValidation = (fromNode, toNode, task, result) => {
  return createMessage({
    from: fromNode.id,
    to: toNode.id,
    type: MessageType.VALIDATION_REQUEST,
    priority: MessagePriority.NORMAL,
    content: {
      task,
      result,
      executedBy: fromNode.id
    },
    context: {
      validation: true
    }
  });
};

/**
 * Send validation result
 * @param {Object} originalMessage - Original validation request
 * @param {Object} fromNode - Validator node
 * @param {boolean} isValid - Validation result
 * @param {string} feedback - Validator feedback
 * @param {Array} issues - List of issues found
 * @returns {Object} - Validation result message
 */
export const sendValidationResult = (originalMessage, fromNode, isValid, feedback, issues = []) => {
  return createMessage({
    from: fromNode.id,
    to: originalMessage.from,
    type: MessageType.VALIDATION_RESULT,
    priority: isValid ? MessagePriority.NORMAL : MessagePriority.HIGH,
    content: {
      isValid,
      feedback,
      issues,
      validatorId: fromNode.id,
      canRetry: !isValid && issues.length > 0
    },
    context: {
      originalMessageId: originalMessage.id,
      validation: true
    }
  });
};

/**
 * Request clarification from client/user
 * @param {Object} fromNode - Node requesting clarification
 * @param {string} question - Question for user
 * @param {Object} taskContext - Context about the task
 * @returns {Object} - Clarification request message
 */
export const requestClarification = (fromNode, question, taskContext = {}) => {
  return createMessage({
    from: fromNode.id,
    to: 'client',
    type: MessageType.CLARIFICATION_REQUEST,
    priority: MessagePriority.URGENT,
    content: {
      question,
      taskContext,
      nodeType: fromNode.type
    },
    context: {
      requiresHumanInput: true
    }
  });
};

/**
 * Advertisement of skills to the network
 * @param {Object} fromNode - Node advertising skills
 * @param {Array} skills - Skills to advertise
 * @returns {Object} - Skill advertisement message
 */
export const advertiseSkills = (fromNode, skills) => {
  return createMessage({
    from: fromNode.id,
    to: 'broadcast',
    type: MessageType.SKILL_ADVERTISEMENT,
    priority: MessagePriority.LOW,
    content: {
      skills,
      nodeType: fromNode.type,
      reputation: fromNode.reputation || 0,
      availability: true
    },
    context: {
      broadcast: true
    }
  });
};

/**
 * Collaboration invitation with specific requirements
 * @param {Object} fromNode - Inviting node
 * @param {Object} toNode - Invited node
 * @param {string} task - Task for collaboration
 * @param {Array} requiredSkills - Skills needed
 * @returns {Object} - Collaboration invite message
 */
export const inviteCollaboration = (fromNode, toNode, task, requiredSkills = []) => {
  return createMessage({
    from: fromNode.id,
    to: toNode.id,
    type: MessageType.COLLABORATION_INVITE,
    priority: MessagePriority.HIGH,
    content: {
      task,
      requiredSkills,
      invitingNodeSkills: fromNode.config.skills || [],
      collaborationType: 'peer-to-peer'
    },
    context: {
      collaboration: true
    }
  });
};

/**
 * Message history manager
 */
class MessageHistory {
  constructor() {
    this.messages = [];
    this.maxHistory = 1000;
  }

  add(message) {
    this.messages.push({
      ...message,
      receivedAt: new Date().toISOString()
    });

    // Keep only recent messages
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }
  }

  getByNode(nodeId) {
    return this.messages.filter(
      msg => msg.from === nodeId || msg.to === nodeId
    );
  }

  getByType(type) {
    return this.messages.filter(msg => msg.type === type);
  }

  getCollaborationMessages(nodeId) {
    return this.messages.filter(
      msg => (msg.from === nodeId || msg.to === nodeId) &&
             msg.context.collaboration === true
    );
  }

  getValidationMessages(nodeId) {
    return this.messages.filter(
      msg => (msg.from === nodeId || msg.to === nodeId) &&
             msg.context.validation === true
    );
  }

  getRecentMessages(limit = 10) {
    return this.messages.slice(-limit);
  }

  clear() {
    this.messages = [];
  }
}

// Global message history instance
export const messageHistory = new MessageHistory();

/**
 * Process incoming message
 * @param {Object} message - Message to process
 * @param {Object} currentNode - Node processing the message
 * @returns {Object} - Processing result
 */
export const processMessage = (message, currentNode) => {
  messageHistory.add(message);

  const result = {
    messageId: message.id,
    processed: true,
    response: null,
    action: null
  };

  switch (message.type) {
    case MessageType.REQUEST_HELP:
      result.action = 'evaluate_help_request';
      result.response = offerHelp(
        message,
        currentNode,
        canProvideHelp(currentNode, message.content),
        'Evaluated based on skills and availability'
      );
      break;

    case MessageType.VALIDATION_REQUEST:
      result.action = 'perform_validation';
      break;

    case MessageType.COLLABORATION_INVITE:
      result.action = 'evaluate_collaboration';
      break;

    default:
      result.action = 'acknowledge';
  }

  return result;
};

/**
 * Check if node can provide help
 * @param {Object} node - Node that might help
 * @param {Object} requestContent - Help request content
 * @returns {boolean} - Whether node can help
 */
function canProvideHelp(node, requestContent) {
  // Check if node has any of the requested skills
  const nodeSkills = node.config.skills || [];
  const requestingSkills = requestContent.requestingNodeSkills || [];

  // Node should have different skills to provide alternative approach
  const hasDifferentSkills = nodeSkills.some(
    skill => !requestingSkills.includes(skill)
  );

  // Check reputation if available
  const hasGoodReputation = !node.reputation || node.reputation > 0.5;

  // Check if node can collaborate
  const canCollaborate = node.config.canCollaborate !== false;

  return canCollaborate && hasDifferentSkills && hasGoodReputation;
}

export default {
  MessageType,
  MessagePriority,
  createMessage,
  requestHelp,
  offerHelp,
  requestValidation,
  sendValidationResult,
  requestClarification,
  advertiseSkills,
  inviteCollaboration,
  messageHistory,
  processMessage
};
