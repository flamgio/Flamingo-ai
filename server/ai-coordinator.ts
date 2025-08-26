
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face inference
const hf = new HfInference(process.env.HF_TOKEN);

interface AIResponse {
  content: string;
  model: string;
  processingTime: number;
  tokensUsed?: number;
}

class AICoordinator {
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
      
      return response.generated_text?.trim() || "I'm processing your request. Could you please rephrase your question?";
    } catch (error) {
      console.error('Local model error:', error);
      return this.generateFallbackResponse(prompt);
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
      return "Hello! I'm Flamgio AI, ready to assist you with any questions or tasks you have.";
    }
    
    if (promptLower.includes('code') || promptLower.includes('programming')) {
      return "I can help you with programming and coding tasks. What specific language or problem are you working with?";
    }
    
    if (promptLower.includes('explain') || promptLower.includes('what is')) {
      return "I'd be happy to explain that concept. Let me break it down for you in a clear and understandable way.";
    }
    
    if (promptLower.includes('help')) {
      return "I'm here to help! I can assist with various tasks including answering questions, explaining concepts, helping with code, and much more.";
    }
    
    return "I understand your question and I'm ready to provide you with a helpful response. What would you like to know more about?";
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
