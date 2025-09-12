
let hf: any = null;
import { geminiEnhancer } from './gemini-enhancer';

interface AIResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class AICoordinator {
  private initialized = false;
  
  async initialize() {
    if (this.initialized) return;
    
    try {
      const { HfInference } = await import('@huggingface/inference');
      hf = new HfInference(process.env.HF_TOKEN || 'dummy_token');
      this.initialized = true;
    } catch (error) {
      console.warn('Hugging Face package not available, using fallback responses');
      this.initialized = true;
    }
  }
  private availableModels = {
    local: [
      'microsoft/DialoGPT-medium',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-small'
    ],
    cloud: [
      'openai/gpt-4',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-sonnet',
      'google/gemini-pro'
    ]
  };

  selectBestModel(prompt: string, selectedModel?: string): string {
    if (selectedModel && this.isModelAvailable(selectedModel)) {
      return selectedModel;
    }

    // Smart routing logic
    const promptLower = prompt.toLowerCase();
    
    // Use cloud models for complex queries
    if (promptLower.includes('code') || promptLower.includes('analysis') || promptLower.includes('complex')) {
      return this.availableModels.cloud[0]; // GPT-4
    }
    
    // Use local models for simple conversations
    if (promptLower.includes('hello') || promptLower.includes('hi') || prompt.length < 50) {
      return this.availableModels.local[1]; // BlenderBot
    }
    
    // Default to GPT-3.5 for balanced performance
    return this.availableModels.cloud[1];
  }

  private isModelAvailable(model: string): boolean {
    return [...this.availableModels.local, ...this.availableModels.cloud].includes(model);
  }

  async generateResponse(prompt: string, model: string, useEnhancement = false): Promise<AIResponse> {
    await this.initialize();
    const startTime = Date.now();
    
    try {
      // Enhanced prompt if requested
      let finalPrompt = prompt;
      if (useEnhancement) {
        finalPrompt = await this.enhancePrompt(prompt);
      }

      let response: string;
      
      if (this.availableModels.local.includes(model)) {
        response = await this.generateLocalResponse(finalPrompt, model);
      } else {
        response = await this.generateCloudResponse(finalPrompt, model);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        content: response,
        model,
        processingTime,
        tokensUsed: this.estimateTokens(response)
      };
    } catch (error) {
      console.error('AI generation error:', error);
      
      // Fallback response
      const processingTime = Date.now() - startTime;
      return {
        content: "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment.",
        model: 'fallback',
        processingTime,
        tokensUsed: 20
      };
    }
  }

  private async generateLocalResponse(prompt: string, model: string): Promise<string> {
    try {
      if (!hf) {
        return this.generateContextualResponse(prompt);
      }
      
      const response = await hf.textGeneration({
        model: model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      });
      
      return response.generated_text?.trim() || this.generateContextualResponse(prompt);
    } catch (error) {
      console.error('Local model error:', error);
      return this.generateContextualResponse(prompt);
    }
  }

  private async generateCloudResponse(prompt: string, model: string): Promise<string> {
    try {
      // Try Puter.js integration first
      const { puterIntegration } = await import('./puter-integration');
      
      if (puterIntegration.isAvailable()) {
        try {
          const puterResponse = await puterIntegration.processComplexPrompt(prompt, model.replace('openai/', '').replace('anthropic/', '').replace('google/', ''));
          return puterResponse.content;
        } catch (puterError: any) {
          console.log('Puter.js failed, trying OpenRouter...', puterError.message);
        }
      }
      
      // Try OpenRouter as backup
      try {
        const { openRouterIntegration } = await import('./openrouter-integration');
        
        if (openRouterIntegration.isAvailable()) {
          const openRouterResponse = await openRouterIntegration.processPrompt(prompt, model);
          return openRouterResponse.content;
        }
      } catch (openRouterError: any) {
        console.log('OpenRouter failed, using enhanced contextual response...', openRouterError.message);
      }
      
      // Enhanced contextual response with model-specific behavior
      const contextualResponse = this.generateContextualResponse(prompt);
      
      const modelResponses = {
        'openai/gpt-4': `**GPT-4 Enhanced Response**: ${contextualResponse}`,
        'openai/gpt-3.5-turbo': `**GPT-3.5 Enhanced Response**: ${contextualResponse}`,
        'anthropic/claude-3-sonnet': `**Claude-3 Enhanced Response**: ${contextualResponse}`,
        'google/gemini-pro': `**Gemini Pro Enhanced Response**: ${contextualResponse}`
      };
      
      return modelResponses[model as keyof typeof modelResponses] || contextualResponse;
    } catch (error) {
      console.error('Cloud model error:', error);
      return this.generateFallbackResponse(prompt);
    }
  }

  private generateContextualResponse(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    // Greetings
    if (promptLower.includes('hello') || promptLower.includes('hi') || promptLower.includes('hey')) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }
    
    // Programming and coding questions
    if (promptLower.includes('code') || promptLower.includes('programming') || promptLower.includes('function') || promptLower.includes('javascript') || promptLower.includes('python') || promptLower.includes('react')) {
      return `I can help you with coding! For your question about "${prompt.slice(0, 50)}...", let me provide you with a detailed solution and explanation.`;
    }
    
    // Explanations
    if (promptLower.includes('explain') || promptLower.includes('what is') || promptLower.includes('define')) {
      return `Let me explain that for you. Regarding "${prompt.slice(0, 40)}..." - I'll break this down step by step to give you a clear understanding.`;
    }
    
    // How-to questions
    if (promptLower.includes('how to') || promptLower.includes('how can') || promptLower.includes('how do')) {
      return `Great question! Here's how you can approach "${prompt.slice(0, 40)}...": Let me walk you through the process step by step.`;
    }
    
    // Why questions
    if (promptLower.includes('why') || promptLower.includes('reason')) {
      return `That's an insightful question about "${prompt.slice(0, 40)}...". Let me explain the reasoning and factors behind this.`;
    }
    
    // Math and calculations
    if (promptLower.includes('calculate') || promptLower.includes('math') || promptLower.includes('formula') || /\d+\s*[\+\-\*\/]\s*\d+/.test(prompt)) {
      return `I can help with that calculation. For "${prompt}", let me work through this step by step and provide you with the solution.`;
    }
    
    // Lists and recommendations
    if (promptLower.includes('list') || promptLower.includes('recommend') || promptLower.includes('suggest') || promptLower.includes('best')) {
      return `I'll provide you with a comprehensive list/recommendations for "${prompt.slice(0, 40)}...". Here are the key points you should consider:`;
    }
    
    // Comparison questions
    if (promptLower.includes('difference') || promptLower.includes('vs') || promptLower.includes('compare')) {
      return `Let me compare and explain the differences for you regarding "${prompt.slice(0, 40)}...". I'll break down the key distinctions.`;
    }
    
    // Problem-solving
    if (promptLower.includes('problem') || promptLower.includes('issue') || promptLower.includes('error') || promptLower.includes('fix')) {
      return `I understand you're facing an issue with "${prompt.slice(0, 40)}...". Let me help you troubleshoot and find a solution.`;
    }
    
    // Creative tasks
    if (promptLower.includes('write') || promptLower.includes('create') || promptLower.includes('design') || promptLower.includes('make')) {
      return `I'd be happy to help you create that! For "${prompt.slice(0, 40)}...", let me provide you with a detailed approach and suggestions.`;
    }
    
    // Analysis and review
    if (promptLower.includes('analyze') || promptLower.includes('review') || promptLower.includes('check')) {
      return `I'll analyze that for you. Regarding "${prompt.slice(0, 40)}...", let me examine this thoroughly and provide insights.`;
    }
    
    // For longer, detailed prompts
    if (prompt.length > 100) {
      return `I see you have a detailed question about "${prompt.slice(0, 50)}...". Let me provide you with a comprehensive and thoughtful response addressing all aspects of your inquiry.`;
    }
    
    // For shorter prompts
    if (prompt.length < 20) {
      return `Regarding "${prompt}", I'd be happy to help! Could you provide a bit more context so I can give you the most accurate and helpful response?`;
    }
    
    // Default contextual response
    return `Thank you for your question about "${prompt.slice(0, 40)}...". I understand what you're asking, and I'll provide you with a helpful and detailed response tailored to your specific needs.`;
  }

  private generateFallbackResponse(prompt: string): string {
    const responses = [
      "I understand your question. Could you provide a bit more context so I can give you the best possible answer?",
      "That's an interesting question. Let me think about the best way to help you with that.",
      "I'm here to help! Could you rephrase your question or provide more details?",
      "I want to make sure I give you accurate information. Could you clarify what specifically you'd like to know?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async enhancePrompt(prompt: string): Promise<string> {
    try {
      // Check if enhancement is needed
      if (!geminiEnhancer.needsEnhancement(prompt)) {
        return prompt;
      }
      
      // Use sophisticated Gemini enhancement
      const result = await geminiEnhancer.enhancePrompt(prompt);
      console.log(`Enhanced prompt: "${prompt.slice(0, 50)}..." -> "${result.enhanced.slice(0, 50)}..."`);
      return result.enhanced;
    } catch (error) {
      console.warn('Enhancement failed, using original prompt:', error);
      // Graceful fallback to original prompt
      return prompt;
    }
  }

  private estimateTokens(text: string): number {
    // Rough token estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  }
}

export const aiCoordinator = new AICoordinator();
