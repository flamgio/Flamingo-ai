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
      throw new Error('Puter.js not configured');
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
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 seconds for complex tasks
        }
      );

      const processingTime = Date.now() - startTime;

      return {
        content: response.data.choices[0]?.message?.content || 'No response generated',
        model: `puter-${model}`,
        processingTime,
        tokensUsed: response.data.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('Puter.js integration error:', error);
      throw new Error('Failed to process with Puter.js');
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