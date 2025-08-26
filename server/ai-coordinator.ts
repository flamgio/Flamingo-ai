
let hf: any = null;

// Initialize Hugging Face inference with error handling
try {
  const { HfInference } = await import('@huggingface/inference');
  hf = new HfInference(process.env.HF_TOKEN || 'dummy_token');
} catch (error) {
  console.warn('Hugging Face not available, using fallback responses');
}

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
      // Simulate cloud API call (OpenRouter integration would go here)
      const responses = [
        "Based on your question, here's what I can help you with: " + this.generateContextualResponse(prompt),
        "Let me address your query: " + this.generateContextualResponse(prompt),
        "I can help with that. " + this.generateContextualResponse(prompt)
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (error) {
      console.error('Cloud model error:', error);
      return this.generateFallbackResponse(prompt);
    }
  }

  private generateContextualResponse(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('hello') || promptLower.includes('hi')) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }
    
    if (promptLower.includes('code') || promptLower.includes('programming')) {
      return "I can help you with coding! What programming language or specific problem are you working on?";
    }
    
    if (promptLower.includes('explain') || promptLower.includes('what is')) {
      return "I'd be happy to explain that! Let me break it down for you step by step.";
    }
    
    if (promptLower.includes('help')) {
      return "I'm here to help! I can assist with coding, explanations, problem-solving, and more. What do you need help with?";
    }
    
    if (promptLower.includes('how')) {
      return "Great question! Let me walk you through how to approach this.";
    }
    
    if (promptLower.includes('why')) {
      return "That's an insightful question. Let me explain the reasoning behind this.";
    }
    
    // For general prompts, provide a contextual response
    if (prompt.length > 100) {
      return "I see you have a detailed question. Let me provide you with a comprehensive answer based on what you've asked.";
    }
    
    return "I understand what you're asking. Let me provide you with a helpful response tailored to your question.";
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
    // Simple prompt enhancement
    return `Please provide a comprehensive and helpful response to: ${prompt}`;
  }

  private estimateTokens(text: string): number {
    // Rough token estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  }
}

export const aiCoordinator = new AICoordinator();
