import axios from 'axios';

interface CallProviderOptions {
  prompt: string;
  task: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  };
}

interface ProviderResponse {
  text: string;
  provider: string;
  model: string;
}

export async function callProvider(options: CallProviderOptions): Promise<ProviderResponse> {
  const { prompt, task, options: providerOptions = {} } = options;
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  // Get fallback models from env
  const fallbacks = process.env.OR_MODEL_FALLBACKS?.split(',') || ['gpt-4o-mini'];
  const model = providerOptions.model || fallbacks[0];

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: providerOptions.temperature || 0.7,
        max_tokens: providerOptions.maxTokens || 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      text: response.data.choices[0]?.message?.content || 'No response',
      provider: 'OpenRouter',
      model: model
    };
  } catch (error: any) {
    // Handle rate limiting and server errors with fallback
    if (error.response?.status === 429 || error.response?.status >= 500) {
      console.warn(`OpenRouter error ${error.response?.status}, will retry with fallback`);
      throw new Error(`RETRY_WITH_FALLBACK: ${error.message}`);
    }
    throw new Error(`OpenRouter API error: ${error.message}`);
  }
}