
/**
 * OpenRouter Integration - Alternative AI provider
 */
import axios from 'axios';

interface OpenRouterResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class OpenRouterIntegration {
  private endpoint: string;
  
  constructor() {
    this.endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  }

  /**
   * Check if OpenRouter is available and configured
   */
  isAvailable(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  /**
   * Send prompts to OpenRouter for AI processing
   */
  async processPrompt(prompt: string, selectedModel?: string): Promise<OpenRouterResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenRouter not configured - missing API key');
    }

    try {
      const startTime = Date.now();
      
      // Default to GPT-4 for complex tasks
      const model = selectedModel || 'openai/gpt-4';
      
      const response = await axios.post(
        this.endpoint,
        {
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful AI assistant. Provide detailed, accurate, and contextual responses to user queries.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
            'X-Title': 'AI Chat Assistant'
          },
          timeout: 60000
        }
      );

      const processingTime = Date.now() - startTime;

      return {
        content: response.data.choices[0]?.message?.content || 'No response generated',
        model: `openrouter-${model}`,
        processingTime,
        tokensUsed: response.data.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('OpenRouter integration error:', error);
      
      if (error.response) {
        throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Failed to connect to OpenRouter API - network error');
      } else {
        throw new Error(`OpenRouter configuration error: ${error.message}`);
      }
    }
  }

  /**
   * Get available models through OpenRouter
   */
  getAvailableModels(): string[] {
    return [
      'openai/gpt-4',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'google/gemini-pro',
      'meta-llama/llama-2-70b-chat',
      'mistralai/mixtral-8x7b-instruct'
    ];
  }
}

export const openRouterIntegration = new OpenRouterIntegration();
