/**
 * OpenAI API Service
 * Handles communication with OpenAI's API
 */

/**
 * Call OpenAI API
 * @param {string} model - Model name (e.g., 'gpt-4')
 * @param {string} prompt - User prompt
 * @param {Object} params - Model parameters
 * @returns {Promise<string>} - Model response
 */
export const callOpenAI = async (model, prompt, params) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY in your .env file.');
  }

  const endpoint = 'https://api.openai.com/v1/chat/completions';

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
    n: params.n || 1,
    max_tokens: params.max_tokens || 2000,
    ...(params.seed && { seed: params.seed })
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};
