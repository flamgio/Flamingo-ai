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

function classifyTask(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('code') || lowerPrompt.includes('programming') || lowerPrompt.includes('debug') || lowerPrompt.includes('function')) {
    return 'coding';
  }
  if (lowerPrompt.includes('research') || lowerPrompt.includes('find') || lowerPrompt.includes('information') || lowerPrompt.includes('search')) {
    return 'research';
  }
  if (lowerPrompt.includes('write') || lowerPrompt.includes('essay') || lowerPrompt.includes('article') || lowerPrompt.includes('blog')) {
    return 'writing';
  }
  if (lowerPrompt.includes('analyze') || lowerPrompt.includes('explain') || lowerPrompt.includes('logic') || lowerPrompt.includes('reasoning')) {
    return 'reasoning';
  }
  
  return 'general';
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function getProviderByWordCount(wordCount: number): { name: string; adapter: any } {
  if (wordCount >= 150) {
    return providers[2]; // Heavy provider (Provider 3)
  } else if (wordCount >= 100) {
    return providers[1]; // Provider 2
  } else if (wordCount <= 50) {
    return providers[0]; // Provider 1
  } else {
    // 51-99 words
    return providers[1]; // Provider 2
  }
}

function shouldSkipEnhancement(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return lowerPrompt.includes('!no enchace') || lowerPrompt.includes('!no enhance');
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
  const task = classifyTask(userPrompt);
  const skipEnhancement = shouldSkipEnhancement(userPrompt);
  
  // Determine final prompt to use
  let finalPrompt = userPrompt;
  if (!skipEnhancement && !opts.enhanced && wordCount >= 100) {
    try {
      finalPrompt = await enhancePrompt(userPrompt);
      console.log(`[${requestId}] Enhanced prompt for ${wordCount} words`);
    } catch (error) {
      console.warn(`[${requestId}] Enhancement failed, using original:`, error);
    }
  } else if (opts.enhanced && !skipEnhancement) {
    finalPrompt = opts.enhanced;
  }

  // Remove enhancement skip tokens from final prompt
  finalPrompt = finalPrompt.replace(/!no enchace|!no enhance/gi, '').trim();
  
  const selectedProvider = getProviderByWordCount(wordCount);
  console.log(`[${requestId}] Routing to ${selectedProvider.name} for ${wordCount} words, task: ${task}`);

  // Try primary provider with fallback logic
  const fallbacks = process.env.OR_MODEL_FALLBACKS?.split(',') || [];
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
        task,
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