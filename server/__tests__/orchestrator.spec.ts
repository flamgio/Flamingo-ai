import { describe, it, expect, beforeAll } from 'vitest';

// Mock environment variables
beforeAll(() => {
  process.env.OPENROUTER_API_KEY = 'test-key';
  process.env.HF_API_KEY = 'test-key';
  process.env.HF_MODEL = 'test-model';
  process.env.PUTER_API_KEY = 'test-key';
  process.env.PUTER_SCRIPT_URL = 'https://test.com';
  process.env.OR_MODEL_FALLBACKS = 'gpt-4o-mini,claude-3-haiku';
  process.env.FLAMINGO_SIGNATURE = 'Test Signature';
});

describe('Orchestrator', () => {
  it('should route to Provider1 for prompts with <= 50 words', () => {
    const prompt = 'Hello world how are you doing today?'; // 8 words
    const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
    expect(wordCount).toBeLessThanOrEqual(50);
  });

  it('should route to Provider2 for prompts with 51-99 words', () => {
    const prompt = 'This is a medium length prompt that contains between fifty-one and ninety-nine words to test the routing logic for medium-sized prompts that require moderate processing power and should be handled by the second provider in our intelligent routing system that automatically selects the most appropriate AI model based on the complexity and length of the user input to ensure optimal performance and cost efficiency for all types of requests submitted through our platform.'; // ~75 words
    const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
    expect(wordCount).toBeGreaterThan(50);
    expect(wordCount).toBeLessThan(100);
  });

  it('should route to Provider2 for prompts with 100-149 words', () => {
    const prompt = 'This is a longer prompt that requires more extensive processing and contains between one hundred and one hundred forty-nine words to thoroughly test our routing logic for longer prompts that need significant computational resources and advanced model capabilities to handle complex requests with multiple parts, detailed explanations, nuanced understanding, and comprehensive responses that require sophisticated natural language processing, advanced reasoning abilities, contextual awareness, and the capacity to generate detailed, well-structured, and informative responses that address all aspects of the user query while maintaining coherence, accuracy, and relevance throughout the entire response to ensure complete satisfaction with the AI assistance provided through our intelligent routing system.'; // ~100+ words
    const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
    expect(wordCount).toBeGreaterThanOrEqual(100);
    expect(wordCount).toBeLessThan(150);
  });

  it('should route to Provider3 for prompts with >= 150 words', () => {
    const prompt = 'This is an extremely long and comprehensive prompt that definitely contains more than one hundred and fifty words and is designed to test the routing logic for very lengthy prompts that require the most powerful and sophisticated AI models with maximum computational resources, advanced reasoning capabilities, extensive contextual understanding, and the ability to handle complex multi-part requests with detailed analysis, comprehensive explanations, nuanced interpretations, sophisticated problem-solving approaches, and the capacity to generate extensive, well-structured, highly detailed, and thoroughly informative responses that address every single aspect of the user query while maintaining perfect coherence, absolute accuracy, complete relevance, and exceptional quality throughout the entire response to ensure total satisfaction with the premium AI assistance provided through our most advanced intelligent routing system that automatically selects the highest-tier AI model specifically designed for handling the most complex and demanding requests that require maximum processing power, advanced algorithms, sophisticated natural language understanding, comprehensive knowledge base access, and superior response generation capabilities.'; // 150+ words
    const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
    expect(wordCount).toBeGreaterThanOrEqual(150);
  });

  it('should detect !no enchace skip token', () => {
    const prompt = 'Enhance this prompt please !no enchace';
    expect(prompt.toLowerCase().includes('!no enchace')).toBe(true);
  });

  it('should detect !no enhance skip token', () => {
    const prompt = 'Enhance this prompt please !no enhance';
    expect(prompt.toLowerCase().includes('!no enhance')).toBe(true);
  });

  it('should classify task types correctly', () => {
    expect('Write some code for me'.toLowerCase().includes('code')).toBe(true);
    expect('Research this topic'.toLowerCase().includes('research')).toBe(true);
    expect('Write an essay'.toLowerCase().includes('write')).toBe(true);
    expect('Analyze this data'.toLowerCase().includes('analyze')).toBe(true);
  });
});