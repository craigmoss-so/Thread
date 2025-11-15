/**
 * API Service - Handles communication with various AI model providers
 * Supports: OpenAI, Ollama, LM Studio
 */

import { callOpenAI } from './openaiService';
import { callOllama } from './ollamaService';
import { callLMStudio } from './lmstudioService';

/**
 * Execute a task using the configured AI model
 * @param {Object} config - Node configuration
 * @param {string} task - Task description/prompt
 * @returns {Promise<Object>} - API response
 */
export const executeTask = async (config, task) => {
  const { primaryModel, modelParams } = config;

  try {
    let response;

    switch (primaryModel.provider) {
      case 'openai':
        response = await callOpenAI(primaryModel.model, task, modelParams);
        break;

      case 'ollama':
        response = await callOllama(primaryModel.model, task, modelParams);
        break;

      case 'lmstudio':
        response = await callLMStudio(primaryModel.model, task, modelParams);
        break;

      default:
        throw new Error(`Unsupported provider: ${primaryModel.provider}`);
    }

    return {
      success: true,
      data: response,
      provider: primaryModel.provider,
      model: primaryModel.model
    };

  } catch (error) {
    console.error('API Service Error:', error);
    return {
      success: false,
      error: error.message,
      provider: primaryModel.provider,
      model: primaryModel.model
    };
  }
};

/**
 * Transform data according to configured rules
 * @param {string} data - Raw data to transform
 * @param {Array} rules - Transformation rules
 * @returns {string} - Transformed data
 */
export const transformData = (data, rules = []) => {
  if (!rules || rules.length === 0) {
    return data;
  }

  let transformed = data;

  rules.forEach(rule => {
    switch (rule.type) {
      case 'strip_whitespace':
        transformed = transformed.trim();
        break;

      case 'lowercase':
        transformed = transformed.toLowerCase();
        break;

      case 'uppercase':
        transformed = transformed.toUpperCase();
        break;

      case 'remove_html':
        transformed = transformed.replace(/<[^>]*>/g, '');
        break;

      case 'custom_regex':
        if (rule.pattern && rule.replacement !== undefined) {
          const regex = new RegExp(rule.pattern, rule.flags || 'g');
          transformed = transformed.replace(regex, rule.replacement);
        }
        break;

      default:
        console.warn(`Unknown transformation rule: ${rule.type}`);
    }
  });

  return transformed;
};
