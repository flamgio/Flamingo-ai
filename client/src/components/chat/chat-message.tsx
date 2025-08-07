import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import type { Message } from '@shared/schema';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getModelDisplayName = (model?: string | null) => {
    if (!model) return 'AI';
    
    const modelNames: Record<string, string> = {
      'kimi-k2': 'Kimi-K2',
      'kimi-dev-72b': 'Kimi-Dev-72B',
      'mixtral-8x7b': 'Mixtral-8x7B',
      'mythomax-l2': 'MythoMax-L2',
      'nous-capybara': 'Nous-Capybara',
      'kimi-vl-a3b': 'Kimi-VL-A3B',
      'llama-3.3-70b': 'Llama-3.3-70B',
      'local-hf': 'Local Model',
      'coordinator': 'AI Coordinator'
    };
    
    return modelNames[model] || model;
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end" data-testid="user-message">
        <div className="flex items-end space-x-3 max-w-2xl">
          <div className="chat-message-user px-4 py-3 rounded-2xl rounded-br-md">
            <p className="text-white whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-flamingo-500 to-flamingo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start" data-testid="assistant-message">
      <div className="flex items-start space-x-3 max-w-2xl">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-robot text-gray-600 dark:text-gray-300 text-sm"></i>
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span 
              data-testid="model-tag"
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
            >
              {getModelDisplayName(message.selectedModel)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(message.createdAt)}
            </span>
          </div>
          <div className="chat-message-assistant px-4 py-3 rounded-2xl rounded-bl-md relative group">
            <div className="prose-flamingo">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-flamingo-600 dark:text-flamingo-400">{children}</strong>,
                  em: ({ children }) => <em className="italic text-flamingo-600 dark:text-flamingo-400">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 text-flamingo-600 dark:text-flamingo-400 px-1 py-0.5 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto my-3">{children}</pre>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{children}</h4>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            
            {/* Copy Button */}
            <Button
              data-testid="copy-message-btn"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-xs`}></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
