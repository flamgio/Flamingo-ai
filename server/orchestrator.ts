import { callProvider as callOpenRouter } from './adapters/openrouter-adapter.js';
import { callProvider as callHuggingFace } from './adapters/huggingface-adapter.js';
import { callProvider as callPuter } from './adapters/puter-adapter.js';
import { v4 as uuidv4 } from 'uuid';

interface RouteOptions {
  userId?: string;
  enhanced?: string | null;
}

interface OrchestrationResult {
  text: string;
  provider: string;
  model: string;
  wordCount: number;
  task: string;
  signature: string;
  requestId: string;
}

const providers = [
  { name: 'Provider1', adapter: callOpenRouter },
  { name: 'Provider2', adapter: callHuggingFace },
  { name: 'Provider3', adapter: callPuter }
];

function classifyTask(prompt: string): { task: string; complexity: 'small' | 'medium' | 'high' } {
  const lowerPrompt = prompt.toLowerCase();
  const promptLength = prompt.trim().length;
  const wordCount = getWordCount(prompt);
  
  // High complexity tasks - Route to Puter.js
  if (
    lowerPrompt.includes('code') || lowerPrompt.includes('programming') || 
    lowerPrompt.includes('debug') || lowerPrompt.includes('function') ||
    lowerPrompt.includes('complex') || lowerPrompt.includes('analyze') ||
    lowerPrompt.includes('multi-step') || lowerPrompt.includes('reasoning') ||
    lowerPrompt.includes('logic') || lowerPrompt.includes('research') ||
    lowerPrompt.includes('create') || lowerPrompt.includes('develop') ||
    lowerPrompt.includes('explain in detail') || lowerPrompt.includes('comprehensive') ||
    wordCount > 100 || promptLength > 500
  ) {
    return { task: 'high-complexity', complexity: 'high' };
  }
  
  // Small complexity tasks - Route to HuggingFace
  if (
    lowerPrompt.includes('hi') || lowerPrompt.includes('hello') ||
    lowerPrompt.includes('clean') || lowerPrompt.includes('sentiment') ||
    lowerPrompt.includes('simple') || lowerPrompt.includes('basic') ||
    wordCount <= 20 || promptLength <= 100 ||
    lowerPrompt.match(/^(hi|hello|hey|good morning|good afternoon|good evening)[\s\!]*$/i)
  ) {
    return { task: 'small-task', complexity: 'small' };
  }
  
  // Medium complexity tasks - Route to OpenRouter
  return { task: 'medium-task', complexity: 'medium' };
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function getProviderByComplexity(complexity: 'small' | 'medium' | 'high'): { name: string; adapter: any } {
  switch (complexity) {
    case 'small':
      return providers[1]; // HuggingFace (Provider 2) for small tasks
    case 'medium':
      return providers[0]; // OpenRouter (Provider 1) for medium tasks
    case 'high':
      return providers[2]; // Puter.js (Provider 3) for high complexity
    default:
      return providers[0]; // Default to OpenRouter
  }
}

function getModelsByComplexity(complexity: 'small' | 'medium' | 'high'): string[] {
  switch (complexity) {
    case 'small':
      // HuggingFace models for simple tasks
      return ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill', 'microsoft/DialoGPT-small'];
    case 'medium':
      // OpenRouter models for medium complexity
      return [
        'mistralai/mistral-7b-instruct',
        'google/gemma-7b-it',
        'tiiuae/falcon-7b-instruct',
        'meta-llama/llama-2-7b-chat',
        'nousresearch/nous-hermes-2-mistral-7b',
        'openchat/openchat-3.5',
        'phind/phind-7b'
      ];
    case 'high':
      // Puter.js advanced models for complex tasks
      return ['gpt-4', 'gpt-4-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro'];
    default:
      return ['mistralai/mistral-7b-instruct']; // Default OpenRouter model
  }
}

function shouldSkipEnhancement(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return lowerPrompt.includes('!no enhance');
}

async function enhancePrompt(prompt: string): Promise<string> {
  try {
    // Call the existing gemini enhancer
    const { geminiEnhancer } = await import('./gemini-enhancer.js');
    const result = await geminiEnhancer.enhancePrompt(prompt);
    return result.enhanced;
  } catch (error) {
    console.warn('Enhancement failed, using original prompt:', error);
    return prompt;
  }
}

export async function routePrompt(userPrompt: string, opts: RouteOptions = {}): Promise<OrchestrationResult> {
  const requestId = uuidv4();
  console.log(`[${requestId}] Processing prompt: ${userPrompt.substring(0, 100)}...`);
  
  const wordCount = getWordCount(userPrompt);
  const { task, complexity } = classifyTask(userPrompt);
  const skipEnhancement = shouldSkipEnhancement(userPrompt);
  
  // Determine final prompt to use
  let finalPrompt = userPrompt;
  if (!skipEnhancement && !opts.enhanced && complexity === 'high') {
    try {
      finalPrompt = await enhancePrompt(userPrompt);
      console.log(`[${requestId}] Enhanced prompt for ${complexity} complexity task`);
    } catch (error) {
      console.warn(`[${requestId}] Enhancement failed, using original:`, error);
    }
  } else if (opts.enhanced && !skipEnhancement) {
    finalPrompt = opts.enhanced;
  }

  // Remove enhancement skip tokens from final prompt
  finalPrompt = finalPrompt.replace(/!no enhance/gi, '').trim();
  
  const selectedProvider = getProviderByComplexity(complexity);
  console.log(`[${requestId}] Routing to ${selectedProvider.name} for ${complexity} complexity task: ${task}`);

  // Set specific models based on complexity
  const fallbacks = getModelsByComplexity(complexity);
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < Math.max(fallbacks.length, 1); attempt++) {
    try {
      const result = await selectedProvider.adapter({
        prompt: finalPrompt,
        task,
        options: {
          model: fallbacks[attempt]
        }
      });

      return {
        ...result,
        wordCount,
        task: `${complexity}-${task}`,
        signature: process.env.FLAMINGO_SIGNATURE || 'Built by Flamingo (human curated)',
        requestId
      };
    } catch (error: any) {
      lastError = error;
      
      if (error.message.includes('RETRY_WITH_FALLBACK') && attempt < fallbacks.length - 1) {
        console.warn(`[${requestId}] Provider ${selectedProvider.name} failed, trying fallback ${attempt + 1}`);
        continue;
      }
      
      // If it's the last attempt or not a retryable error, break
      break;
    }
  }

  // If all attempts failed, throw the last error
  throw new Error(`All providers failed for request ${requestId}: ${lastError?.message}`);
}