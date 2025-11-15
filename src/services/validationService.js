/**
 * Validation Service - Enhanced validation with feedback loops
 * Implements validator-driven retries and requirement clarification
 */

import { executeTask } from './apiService';
import { requestValidation, sendValidationResult, requestClarification, messageHistory } from './messagingService';
import { reputationManager } from './reputationService';

/**
 * Validate task result with feedback capability
 * @param {Object} validator - Validator node
 * @param {Object} workerNode - Node that executed the task
 * @param {string} task - Original task
 * @param {string} result - Result to validate
 * @param {Array} log - Collaboration log
 * @returns {Promise<Object>} - Validation result with feedback
 */
export const validateWithFeedback = async (validator, workerNode, task, result, log) => {
  log.push({
    nodeId: validator.id,
    nodeType: 'validator',
    action: 'validating_result',
    message: `Validator ${validator.id} reviewing result from ${workerNode.id}`
  });

  // Create validation request message
  const validationMessage = requestValidation(workerNode, validator, task, result);
  messageHistory.add(validationMessage);

  // Perform validation
  try {
    const validationPrompt = `
You are a validator reviewing work. Analyze the following:

ORIGINAL TASK:
${task}

WORKER'S RESULT:
${result}

Provide validation in this format:
1. IS_VALID: true or false
2. ISSUES: List any problems found (or "None" if valid)
3. FEEDBACK: Specific suggestions for improvement
4. CAN_RETRY: Whether worker should retry with feedback

Be thorough but fair in your assessment.
`;

    const validationResponse = await executeTask(validator.config, validationPrompt);

    if (!validationResponse.success) {
      throw new Error('Validation execution failed');
    }

    // Parse validation response
    const isValid = validationResponse.data.toLowerCase().includes('is_valid: true');
    const issues = extractIssues(validationResponse.data);
    const feedback = extractFeedback(validationResponse.data);
    const canRetry = !isValid && validationResponse.data.toLowerCase().includes('can_retry: true');

    // Create validation result message
    const resultMessage = sendValidationResult(
      validationMessage,
      validator,
      isValid,
      feedback,
      issues
    );
    messageHistory.add(resultMessage);

    // Record validation in reputation system
    reputationManager.recordValidation(workerNode.id, isValid);

    log.push({
      nodeId: validator.id,
      nodeType: 'validator',
      action: isValid ? 'validation_passed' : 'validation_failed',
      message: isValid
        ? `Validation passed - result is acceptable`
        : `Validation failed - ${issues.length} issue(s) found`,
      issues,
      feedback,
      canRetry
    });

    return {
      isValid,
      issues,
      feedback,
      canRetry,
      validatorId: validator.id,
      validationMessage: resultMessage
    };

  } catch (error) {
    log.push({
      nodeId: validator.id,
      nodeType: 'validator',
      action: 'validation_error',
      message: `Validation error: ${error.message}`
    });

    return {
      isValid: true, // Default to accepting if validation fails
      issues: [],
      feedback: 'Validation process encountered an error',
      canRetry: false,
      error: error.message
    };
  }
};

/**
 * Request clarification from client when requirements unclear
 * @param {Object} node - Node requesting clarification
 * @param {string} task - Task with unclear requirements
 * @param {string} ambiguity - What is unclear
 * @param {Array} log - Collaboration log
 * @returns {Object} - Clarification request
 */
export const requestClientClarification = (node, task, ambiguity, log) => {
  const question = `I need clarification on: ${ambiguity}\n\nOriginal task: ${task}\n\nPlease provide more details.`;

  const clarificationMessage = requestClarification(node, question, { task, ambiguity });
  messageHistory.add(clarificationMessage);

  log.push({
    nodeId: node.id,
    nodeType: node.type,
    action: 'requesting_clarification',
    message: `${node.id} requesting clarification from client`,
    question: ambiguity
  });

  return {
    needsClarification: true,
    question,
    message: clarificationMessage
  };
};

/**
 * Process validation feedback and retry if appropriate
 * @param {Object} workerNode - Worker that needs to retry
 * @param {string} task - Original task
 * @param {Object} validationResult - Result from validation
 * @param {Array} log - Collaboration log
 * @returns {Promise<Object>} - Retry result
 */
export const retryWithFeedback = async (workerNode, task, validationResult, log) => {
  if (!validationResult.canRetry) {
    return {
      success: false,
      error: 'Validation failed and retry not recommended',
      issues: validationResult.issues
    };
  }

  log.push({
    nodeId: workerNode.id,
    nodeType: 'worker',
    action: 'retry_with_feedback',
    message: `${workerNode.id} retrying with validator feedback`,
    feedback: validationResult.feedback
  });

  // Retry with feedback incorporated
  const retryPrompt = `
Previous attempt had issues. Please retry considering this feedback:

ORIGINAL TASK:
${task}

VALIDATOR FEEDBACK:
${validationResult.feedback}

ISSUES TO ADDRESS:
${validationResult.issues.join('\n')}

Please provide an improved result addressing all feedback.
`;

  try {
    const retryResponse = await executeTask(workerNode.config, retryPrompt);

    if (retryResponse.success) {
      log.push({
        nodeId: workerNode.id,
        nodeType: 'worker',
        action: 'retry_successful',
        message: `${workerNode.id} successfully addressed validation feedback`
      });

      return {
        success: true,
        data: retryResponse.data,
        improvedFromFeedback: true
      };
    }

    throw new Error('Retry failed');

  } catch (error) {
    log.push({
      nodeId: workerNode.id,
      nodeType: 'worker',
      action: 'retry_failed',
      message: `${workerNode.id} retry failed: ${error.message}`
    });

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract issues from validation response
 */
function extractIssues(validationText) {
  const issues = [];
  const issuesMatch = validationText.match(/ISSUES?:\s*(.+?)(?=\n[A-Z]+:|$)/is);

  if (issuesMatch) {
    const issuesText = issuesMatch[1].trim();
    if (issuesText.toLowerCase() !== 'none') {
      // Split by newlines or numbered lists
      const issueLines = issuesText.split(/\n|(?=\d+\.)/);
      issueLines.forEach(line => {
        const cleaned = line.trim().replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '');
        if (cleaned && cleaned.length > 0) {
          issues.push(cleaned);
        }
      });
    }
  }

  return issues;
}

/**
 * Extract feedback from validation response
 */
function extractFeedback(validationText) {
  const feedbackMatch = validationText.match(/FEEDBACK:\s*(.+?)(?=\n[A-Z]+:|$)/is);

  if (feedbackMatch) {
    return feedbackMatch[1].trim();
  }

  return 'No specific feedback provided';
}

/**
 * Check if task requirements are clear
 * @param {string} task - Task to check
 * @returns {Object} - Clarity assessment
 */
export const assessTaskClarity = (task) => {
  const ambiguousKeywords = [
    'maybe', 'perhaps', 'unclear', 'not sure', 'could be', 'might',
    'some', 'something', 'somehow', 'whatever', 'any'
  ];

  const taskLower = task.toLowerCase();
  const foundAmbiguities = ambiguousKeywords.filter(keyword =>
    taskLower.includes(keyword)
  );

  const isClear = foundAmbiguities.length === 0 && task.length > 20;

  return {
    isClear,
    ambiguities: foundAmbiguities,
    needsClarification: !isClear,
    reason: foundAmbiguities.length > 0
      ? `Task contains ambiguous terms: ${foundAmbiguities.join(', ')}`
      : task.length <= 20
        ? 'Task is too brief'
        : 'Task is clear'
  };
};

export default {
  validateWithFeedback,
  requestClientClarification,
  retryWithFeedback,
  assessTaskClarity
};
