import axios from 'axios';

interface CallProviderOptions {
  prompt: string;
  task: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  };
}

interface ProviderResponse {
  text: string;
  provider: string;
  model: string;
}

// Smart demo response generator
function getSmartDemoResponse(prompt: string, task: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Greeting responses
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
    return "Hello! I'm your AI assistant powered by Puter.js integration. I can help you with questions, provide information, and assist with various tasks. What would you like to know?";
  }
  
  // Technical questions
  if (lowerPrompt.includes('how') || lowerPrompt.includes('what') || lowerPrompt.includes('explain')) {
    return `Great question! Based on your inquiry about "${prompt.slice(0, 50)}...", I can provide you with detailed information. Puter.js integration allows for seamless AI interactions that appear directly in your chat interface, making conversations feel natural and responsive.`;
  }
  
  // Code-related
  if (lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('develop')) {
    return `I'd be happy to help with your coding question! With Puter.js integration, I can assist with programming concepts, provide code examples, and help debug issues. Your query about "${prompt.slice(0, 40)}..." is exactly the type of technical question I can help with.`;
  }
  
  // Creative tasks
  if (lowerPrompt.includes('write') || lowerPrompt.includes('create') || lowerPrompt.includes('design')) {
    return `I can definitely help with creative tasks! Whether you need help writing, creating content, or designing something, I'm here to assist. Your request for "${prompt.slice(0, 40)}..." sounds interesting - let me provide some ideas and suggestions.`;
  }
  
  // Default response
  return `Thank you for your message: "${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}"\n\nI understand what you're asking and I'm here to help! This response is generated through our Puter.js integration, demonstrating how AI responses appear seamlessly in your chat interface. The system intelligently routes complex queries to the most appropriate AI model.`;
}

export async function callProvider(options: CallProviderOptions): Promise<ProviderResponse> {
  const { prompt, task, options: providerOptions = {} } = options;
  
  const apiKey = process.env.PUTER_API_KEY;
  const scriptUrl = process.env.PUTER_SCRIPT_URL || 'https://api.puter.com/v1/scripts';
  
  // For development mode, provide a smart fallback response if no API key is configured
  if (!apiKey) {
    const smartResponse = getSmartDemoResponse(prompt, task);
    return {
      text: `🤖 **Puter AI Response**\n\n${smartResponse}\n\n---\n*Note: This is a development demo of Puter.js integration. Configure PUTER_API_KEY to connect to real Puter AI services. Your message was successfully routed through our AI orchestrator and displays directly in this chat interface without external redirects.*`,
      provider: 'Puter (Demo)',
      model: 'puter-chat-demo'
    };
  }

  try {
    const response = await axios.post(
      scriptUrl,
      {
        prompt: prompt,
        task_type: task,
        parameters: {
          temperature: providerOptions.temperature || 0.7,
          max_tokens: providerOptions.maxTokens || 1500
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 35000
      }
    );

    return {
      text: response.data.result || response.data.output || response.data.text || 'No response',
      provider: 'Puter',
      model: response.data.model || 'puter-default'
    };
  } catch (error: any) {
    // Handle rate limiting and server errors with fallback
    if (error.response?.status === 429 || error.response?.status >= 500) {
      console.warn(`Puter error ${error.response?.status}, will retry with fallback`);
      throw new Error(`RETRY_WITH_FALLBACK: ${error.message}`);
    }
    throw new Error(`Puter API error: ${error.message}`);
  }
}