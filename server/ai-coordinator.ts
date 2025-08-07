/**
 * AI Coordinator - Routes prompts to appropriate AI models
 * Handles intelligent model selection and routing
 */

interface AIModel {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  available: boolean;
}

class AICoordinator {
  private models: AIModel[] = [
    { id: 'local-hf', name: 'Local HF Model', type: 'local', available: true },
    { id: 'kimi-k2', name: 'Kimi-K2', type: 'cloud', available: true },
    { id: 'kimi-dev-72b', name: 'Kimi-Dev-72B', type: 'cloud', available: true },
    { id: 'mixtral-8x7b', name: 'Mixtral-8x7B', type: 'cloud', available: true },
    { id: 'mythomax-l2', name: 'MythoMax-L2', type: 'cloud', available: true },
    { id: 'nous-capybara', name: 'Nous-Capybara', type: 'cloud', available: true },
    { id: 'kimi-vl-a3b', name: 'Kimi-VL-A3B', type: 'cloud', available: true },
    { id: 'llama-3.3-70b', name: 'Llama-3.3-70B', type: 'cloud', available: true }
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
    return isComplex ? 'kimi-k2' : 'local-hf';
  }

  /**
   * Simple complexity analysis for prompt routing
   */
  private analyzeComplexity(prompt: string): boolean {
    const complexKeywords = ['analyze', 'complex', 'detailed', 'comprehensive', 'research', 'explain', 'compare'];
    const isLong = prompt.length > 200;
    const hasComplexKeywords = complexKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    return isLong || hasComplexKeywords;
  }

  /**
   * Generate AI response using selected model
   */
  async generateResponse(prompt: string, selectedModel: string): Promise<string> {
    try {
      // This would integrate with actual AI processing
      // For now, return a placeholder that indicates the model would be used
      return `Response from ${this.getModelName(selectedModel)}: ${prompt}`;
    } catch (error) {
      console.error('AI Coordinator error:', error);
      throw new Error('Failed to generate AI response');
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
