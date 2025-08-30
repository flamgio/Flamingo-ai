/** HUMAN-CRAFTED PUTER ADAPTER - Original code by human developer */
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
  
  const apiKey = process.env.PUTER_API_KEY;
  const scriptUrl = process.env.PUTER_SCRIPT_URL || 'https://api.puter.com/v1/scripts';
  
  if (!apiKey) {
    throw new Error('Puter API key not configured');
  }

  try {
    const response = await axios.post(
      scriptUrl,
      {
        prompt: prompt,
        task_type: task,
        parameters: {
          temperature: providerOptions.temperature || 0.7,
          max_tokens: providerOptions.maxTokens || 1500
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 35000
      }
    );

    return {
      text: response.data.result || response.data.output || response.data.text || 'No response',
      provider: 'Puter',
      model: response.data.model || 'puter-default'
    };
  } catch (error: any) {
    // Handle rate limiting and server errors with fallback
    if (error.response?.status === 429 || error.response?.status >= 500) {
      console.warn(`Puter error ${error.response?.status}, will retry with fallback`);
      throw new Error(`RETRY_WITH_FALLBACK: ${error.message}`);
    }
    throw new Error(`Puter API error: ${error.message}`);
  }
}