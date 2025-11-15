/**
 * Ollama API Service
 * Handles communication with local Ollama instance
 */

/**
 * Call Ollama API
 * @param {string} model - Model name (e.g., 'llama2')
 * @param {string} prompt - User prompt
 * @param {Object} params - Model parameters
 * @returns {Promise<string>} - Model response
 */
export const callOllama = async (model, prompt, params) => {
  const ollamaUrl = process.env.REACT_APP_OLLAMA_URL || 'http://localhost:11434';
  const endpoint = `${ollamaUrl}/api/generate`;

  const requestBody = {
    model: model,
    prompt: prompt,
    stream: false,
    options: {
      temperature: params.temperature || 0.7,
      top_p: params.top_p || 1.0,
      num_predict: params.max_tokens || 2000,
      ...(params.seed && { seed: params.seed })
    }
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
      throw new Error(`Ollama API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error('No response from Ollama');
    }

    return data.response;

  } catch (error) {
    console.error('Ollama API Error:', error);

    // Provide helpful error message if Ollama is not running
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running on ' + ollamaUrl);
    }

    throw error;
  }
};
