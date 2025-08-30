/**
 * Puter.js Integration - Handles advanced AI tasks through Puter.js
 */
import axios from 'axios';

interface PuterResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class PuterIntegration {
  private puterEndpoint: string;
  
  constructor() {
    // Puter.js endpoint - this would be configured based on your Puter.js setup
    this.puterEndpoint = process.env.PUTER_ENDPOINT || 'https://api.puter.com/v1/ai';
  }

  /**
   * Check if Puter.js is available and configured
   */
  isAvailable(): boolean {
    return !!process.env.PUTER_API_KEY && !!this.puterEndpoint;
  }

  /**
   * Send complex prompts to Puter.js for advanced AI models
   */
  async processComplexPrompt(prompt: string, selectedModel?: string): Promise<PuterResponse> {
    if (!this.isAvailable()) {
      throw new Error('Puter.js not configured - missing API key or endpoint');
    }

    try {
      const startTime = Date.now();
      
      // Default to advanced models for complex tasks
      const model = selectedModel || 'gpt-4';
      
      const response = await axios.post(
        this.puterEndpoint,
        {
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful AI assistant. Provide detailed, accurate, and contextual responses.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Flamingo-AI-Agent/1.0'
          },
          timeout: 60000 // 60 seconds for complex tasks
        }
      );

      const processingTime = Date.now() - startTime;

      // Handle different response formats
      let content = 'No response generated';
      if (response.data.choices && response.data.choices[0]) {
        content = response.data.choices[0].message?.content || response.data.choices[0].text || content;
      } else if (response.data.content) {
        content = response.data.content;
      } else if (response.data.text) {
        content = response.data.text;
      }

      return {
        content: content.trim(),
        model: `puter-${model}`,
        processingTime,
        tokensUsed: response.data.usage?.total_tokens || Math.ceil(content.length / 4)
      };
    } catch (error) {
      console.error('Puter.js integration error:', error);
      
      // Provide more specific error information
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(`Puter.js API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Request error:', error.message);
        throw new Error('Failed to connect to Puter.js API - network error');
      } else {
        console.error('Setup error:', error.message);
        throw new Error(`Puter.js configuration error: ${error.message}`);
      }
    }
  }

  /**
   * Get available models through Puter.js
   */
  getAvailableModels(): string[] {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'claude-3-opus',
      'claude-3-sonnet', 
      'gemini-pro'
    ];
  }
}

export const puterIntegration = new PuterIntegration();