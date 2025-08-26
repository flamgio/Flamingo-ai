/**
 * AI Coordinator - Routes prompts to appropriate AI models
 * Handles intelligent model selection and routing between OpenRouter, Hugging Face, and Puter.js
 */

import axios from 'axios';
import { puterIntegration } from './puter-integration';
import { geminiEnhancer } from './gemini-enhancer';

interface AIModel {
  id: string;
  name: string;
  type: 'local' | 'cloud' | 'advanced';
  available: boolean;
  endpoint?: string;
  complexity: 'simple' | 'medium' | 'complex';
}

interface AIResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class AICoordinator {
  private models: AIModel[] = [
    // OpenRouter cloud models for simple tasks
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'cloud', available: true, complexity: 'simple' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', type: 'cloud', available: true, complexity: 'simple' },
    
    // Hugging Face models for medium tasks
    { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium (HF)', type: 'local', available: true, complexity: 'medium' },
    { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M (HF)', type: 'local', available: true, complexity: 'medium' },
    { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', type: 'cloud', available: true, complexity: 'medium' },
    
    // Puter.js advanced models for complex tasks
    { id: 'puter/gpt-4', name: 'GPT-4 (Puter)', type: 'advanced', available: puterIntegration.isAvailable(), complexity: 'complex' },
    { id: 'puter/claude-3-opus', name: 'Claude 3 Opus (Puter)', type: 'advanced', available: puterIntegration.isAvailable(), complexity: 'complex' },
    { id: 'puter/gemini-pro', name: 'Gemini Pro (Puter)', type: 'advanced', available: puterIntegration.isAvailable(), complexity: 'complex' },
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

    // Analyze prompt complexity
    const complexity = this.analyzePromptComplexity(prompt);
    const isPrivacySensitive = this.analyzePrivacy(prompt);
    
    // Route to local HF models for privacy-sensitive content
    if (isPrivacySensitive) {
      return 'microsoft/DialoGPT-medium';
    }
    
    // Route based on complexity level
    switch (complexity) {
      case 'complex':
        // Use Puter.js for advanced tasks if available
        const advancedModel = this.models.find(m => m.type === 'advanced' && m.available);
        return advancedModel ? advancedModel.id : 'anthropic/claude-3-haiku';
        
      case 'medium':
        // Use Hugging Face or medium OpenRouter models
        return 'mistralai/mixtral-8x7b-instruct';
        
      case 'simple':
      default:
        // Use OpenRouter for simple tasks
        return 'openai/gpt-3.5-turbo';
    }
  }

  /**
   * Enhanced complexity analysis
   */
  private analyzePromptComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const length = prompt.length;
    const wordCount = prompt.split(/\s+/).length;
    
    // Simple greetings and short queries
    const simplePatterns = [
      /^hi$/i, /^hello$/i, /^hey$/i, /^how are you/i, 
      /^good morning/i, /^good afternoon/i, /^good evening/i,
      /^thanks?$/i, /^thank you$/i, /^what.*\?$/i
    ];
    
    // Complex task indicators
    const complexKeywords = [
      'analyze', 'research', 'comprehensive', 'detailed analysis', 'step by step', 
      'algorithm', 'programming', 'code', 'implementation', 'architecture',
      'compare and contrast', 'pros and cons', 'advantages and disadvantages',
      'create', 'build', 'develop', 'design', 'plan', 'strategy'
    ];
    
    // Medium complexity indicators
    const mediumKeywords = [
      'explain', 'describe', 'how does', 'what is', 'why', 'when',
      'example', 'summarize', 'overview', 'difference', 'comparison'
    ];

    const isSimple = simplePatterns.some(pattern => pattern.test(prompt.trim()));
    if (isSimple || (length < 20 && wordCount < 5)) {
      return 'simple';
    }

    const hasComplexKeywords = complexKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    
    if (hasComplexKeywords || length > 200 || wordCount > 40) {
      return 'complex';
    }

    const hasMediumKeywords = mediumKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    
    if (hasMediumKeywords || (length > 50 && wordCount > 10)) {
      return 'medium';
    }

    return 'simple';
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
   * Generate AI response using selected model with prompt enhancement
   */
  async generateResponse(prompt: string, selectedModel: string, useEnhancement: boolean = false): Promise<AIResponse> {
    const startTime = Date.now();
    const model = this.models.find(m => m.id === selectedModel);
    
    if (!model) {
      throw new Error(`Model ${selectedModel} not found`);
    }

    try {
      let finalPrompt = prompt;
      
      // Apply prompt enhancement if requested and needed
      if (useEnhancement && geminiEnhancer.needsEnhancement(prompt)) {
        const enhanced = await geminiEnhancer.enhancePrompt(prompt);
        finalPrompt = enhanced.enhanced;
        console.log(`Enhanced prompt: ${enhanced.original} -> ${enhanced.enhanced}`);
      }

      let content: string;
      let tokensUsed = 0;

      if (model.type === 'advanced') {
        // Use Puter.js for advanced models
        const puterModel = selectedModel.replace('puter/', '');
        const puterResponse = await puterIntegration.processComplexPrompt(finalPrompt, puterModel);
        content = puterResponse.content;
        tokensUsed = puterResponse.tokensUsed || 0;
      } else if (model.type === 'cloud') {
        content = await this.callOpenRouterAPI(finalPrompt, selectedModel);
        tokensUsed = Math.ceil(finalPrompt.length / 4); // Rough token estimate
      } else {
        content = await this.callHuggingFaceAPI(finalPrompt, selectedModel);
        tokensUsed = Math.ceil(finalPrompt.length / 4);
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
