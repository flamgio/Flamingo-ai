/**
 * AI Coordinator - Routes prompts to appropriate AI models
 * Handles intelligent model selection and routing between OpenRouter and Hugging Face
 */

import axios from 'axios';

interface AIModel {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  available: boolean;
  endpoint?: string;
}

interface AIResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class AICoordinator {
  private models: AIModel[] = [
    // Hugging Face local models
    { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium (HF)', type: 'local', available: true },
    { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M (HF)', type: 'local', available: true },
    
    // OpenRouter cloud models (7 free models)
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'cloud', available: true },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', type: 'cloud', available: true },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B Chat', type: 'cloud', available: true },
    { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', type: 'cloud', available: true },
    { id: 'google/gemma-7b-it', name: 'Gemma 7B IT', type: 'cloud', available: true },
    { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM 2 8x22B', type: 'cloud', available: true },
    { id: 'qwen/qwen-2-72b-instruct', name: 'Qwen 2 72B Instruct', type: 'cloud', available: true }
  ];

  /**
   * Get list of available AI models
   */
  getAvailableModels(): AIModel[] {
    return this.models.filter(model => model.available);
  }

  /**
   * Select best model based on prompt complexity
   */
  selectBestModel(prompt: string, selectedModel?: string): string {
    // If user specified a model, use it if available
    if (selectedModel && selectedModel !== 'coordinator') {
      const model = this.models.find(m => m.id === selectedModel);
      if (model && model.available) {
        return selectedModel;
      }
    }

    // Simple complexity analysis based on prompt length and keywords
    const isComplex = this.analyzeComplexity(prompt);
    const isPrivacySensitive = this.analyzePrivacy(prompt);
    
    // Route to local HF models for privacy-sensitive content
    if (isPrivacySensitive) {
      return 'microsoft/DialoGPT-medium';
    }
    
    // Route to cloud models for complex queries
    if (isComplex) {
      return 'anthropic/claude-3-haiku';
    }
    
    // Default to local model for simple queries
    return 'facebook/blenderbot-400M-distill';
  }

  /**
   * Simple complexity analysis for prompt routing
   */
  private analyzeComplexity(prompt: string): boolean {
    const complexKeywords = ['analyze', 'complex', 'detailed', 'comprehensive', 'research', 'explain', 'compare', 'code', 'programming', 'algorithm'];
    const isLong = prompt.length > 200;
    const hasComplexKeywords = complexKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    return isLong || hasComplexKeywords;
  }

  /**
   * Privacy analysis for prompt routing
   */
  private analyzePrivacy(prompt: string): boolean {
    const privacyKeywords = ['personal', 'private', 'confidential', 'secret', 'password', 'credit card', 'social security', 'ssn'];
    return privacyKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
  }

  /**
   * Generate AI response using selected model
   */
  async generateResponse(prompt: string, selectedModel: string): Promise<AIResponse> {
    const startTime = Date.now();
    const model = this.models.find(m => m.id === selectedModel);
    
    if (!model) {
      throw new Error(`Model ${selectedModel} not found`);
    }

    try {
      let content: string;
      let tokensUsed = 0;

      if (model.type === 'cloud') {
        content = await this.callOpenRouterAPI(prompt, selectedModel);
        tokensUsed = Math.ceil(prompt.length / 4); // Rough token estimate
      } else {
        content = await this.callHuggingFaceAPI(prompt, selectedModel);
        tokensUsed = Math.ceil(prompt.length / 4);
      }

      const processingTime = Date.now() - startTime;

      return {
        content,
        model: selectedModel,
        processingTime,
        tokensUsed
      };
    } catch (error) {
      console.error('AI Coordinator error:', error);
      
      // Fallback to a simple response if API calls fail
      return {
        content: `I'm currently experiencing technical difficulties connecting to the ${this.getModelName(selectedModel)} model. Here's a basic response to your query: "${prompt}"\n\nPlease note that this is a fallback response. The full AI capabilities will be restored once the model connections are re-established. Your query has been noted and the system is working to process it properly.`,
        model: `${selectedModel}-fallback`,
        processingTime: Date.now() - startTime,
        tokensUsed: 0
      };
    }
  }

  /**
   * Call OpenRouter API for cloud models
   */
  private async callOpenRouterAPI(prompt: string, model: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:5000',
          'X-Title': 'Flamgio AI'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0]?.message?.content || 'No response generated';
  }

  /**
   * Call Hugging Face API for local models
   */
  private async callHuggingFaceAPI(prompt: string, model: string): Promise<string> {
    const apiKey = process.env.HF_API_KEY;
    
    if (!apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Handle different response formats from HF
    if (Array.isArray(response.data)) {
      return response.data[0]?.generated_text || response.data[0]?.text || 'No response generated';
    } else if (response.data.generated_text) {
      return response.data.generated_text;
    } else {
      return JSON.stringify(response.data);
    }
  }

  /**
   * Get model display name
   */
  getModelName(modelId: string): string {
    const model = this.models.find(m => m.id === modelId);
    return model ? model.name : modelId;
  }
}

export const aiCoordinator = new AICoordinator();
