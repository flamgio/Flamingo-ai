/** HUMAN-CRAFTED HUGGINGFACE ADAPTER - Original code by human developer */
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
  
  const apiKey = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL || providerOptions.model || 'microsoft/DialoGPT-medium';
  
  if (!apiKey) {
    throw new Error('HuggingFace API key not configured');
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          temperature: providerOptions.temperature || 0.7,
          max_new_tokens: providerOptions.maxTokens || 1000,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }
    );

    // Handle different HF response formats
    let text = '';
    if (Array.isArray(response.data)) {
      text = response.data[0]?.generated_text || response.data[0]?.text || 'No response';
    } else if (response.data.generated_text) {
      text = response.data.generated_text;
    } else if (typeof response.data === 'string') {
      text = response.data;
    } else {
      text = JSON.stringify(response.data);
    }

    return {
      text: text.trim(),
      provider: 'HuggingFace',
      model: model
    };
  } catch (error: any) {
    // Handle rate limiting and server errors with fallback
    if (error.response?.status === 429 || error.response?.status >= 500) {
      console.warn(`HuggingFace error ${error.response?.status}, will retry with fallback`);
      throw new Error(`RETRY_WITH_FALLBACK: ${error.message}`);
    }
    throw new Error(`HuggingFace API error: ${error.message}`);
  }
}