/**
 * Gemini Prompt Enhancer - Uses Gemini to enhance user prompts
 */
import { GoogleGenAI } from '@google/genai';

class GeminiEnhancer {
  private gemini: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.gemini = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Check if prompt needs enhancement based on complexity
   */
  needsEnhancement(prompt: string): boolean {
    // Don't enhance simple greetings and short messages
    const simplePatterns = [
      /^hi$/i, /^hello$/i, /^hey$/i, /^how are you/i, 
      /^good morning/i, /^good afternoon/i, /^good evening/i,
      /^thanks?$/i, /^thank you$/i, /^ok$/i, /^okay$/i, /^yes$/i, /^no$/i
    ];

    const isSimple = simplePatterns.some(pattern => pattern.test(prompt.trim()));
    const isShort = prompt.trim().length < 15;
    
    return !isSimple && !isShort && prompt.trim().length > 10;
  }

  /**
   * Enhance prompt using Gemini
   */
  async enhancePrompt(originalPrompt: string): Promise<{ enhanced: string; original: string }> {
    if (!this.gemini) {
      return { enhanced: originalPrompt, original: originalPrompt };
    }

    try {
      const enhancementPrompt = `You are a prompt enhancement expert. Your task is to take a user's prompt and make it clearer, more specific, and more likely to get a high-quality response from an AI assistant.

RULES:
1. Keep the original intent and meaning exactly the same
2. Make it more specific and actionable
3. Add context if missing
4. Improve clarity without changing the core request
5. Keep the enhanced version concise but comprehensive
6. Don't change simple questions like greetings

Original prompt: "${originalPrompt}"

Provide ONLY the enhanced version, nothing else:`;

      const result = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enhancementPrompt,
      });

      const enhancedPrompt = result.text?.trim() || originalPrompt;

      return {
        enhanced: enhancedPrompt || originalPrompt,
        original: originalPrompt
      };
    } catch (error) {
      console.error('Gemini enhancement error:', error);
      return { enhanced: originalPrompt, original: originalPrompt };
    }
  }
}

export const geminiEnhancer = new GeminiEnhancer();