/**
 * LM Studio API Service
 * Handles communication with local LM Studio instance
 */

/**
 * Call LM Studio API
 * @param {string} model - Model name
 * @param {string} prompt - User prompt
 * @param {Object} params - Model parameters
 * @returns {Promise<string>} - Model response
 */
export const callLMStudio = async (model, prompt, params) => {
  const lmStudioUrl = process.env.REACT_APP_LMSTUDIO_URL || 'http://localhost:1234';
  const endpoint = `${lmStudioUrl}/v1/chat/completions`;

  const requestBody = {
    model: model,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: params.temperature || 0.7,
    top_p: params.top_p || 1.0,
    max_tokens: params.max_tokens || 2000,
    ...(params.seed && { seed: params.seed })
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from LM Studio');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('LM Studio API Error:', error);

    // Provide helpful error message if LM Studio is not running
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to LM Studio. Make sure LM Studio is running on ' + lmStudioUrl);
    }

    throw error;
  }
};
