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
    if (!model) return 'Flamingo AI';
    
    const modelNames: Record<string, string> = {
      'kimi-k2': 'Flamingo Core K2',
      'kimi-dev-72b': 'Flamingo Dev-72B',
      'mixtral-8x7b': 'Flamingo Matrix-8x7B',
      'mythomax-l2': 'Flamingo Engine-L2',
      'nous-capybara': 'Flamingo Intelligence',
      'kimi-vl-a3b': 'Flamingo Vision-A3B',
      'llama-3.3-70b': 'Flamingo Brain-3.3',
      'local-hf': 'Flamingo Local',
      'coordinator': 'Flamingo Coordinator'
    };
    
    return modelNames[model] || 'Flamingo AI';
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end" data-testid="user-message">
        <div className="flex items-end space-x-3 max-w-2xl">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start" data-testid="assistant-message">
      <div className="flex items-start space-x-3 max-w-3xl">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
          FA
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span 
              data-testid="model-tag"
              className="text-xs bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-800/40 dark:to-pink-800/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium shadow-sm border border-purple-200/50 dark:border-purple-600/30"
            >
              {getModelDisplayName(message.selectedModel)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(message.createdAt)}
            </span>
          </div>
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl relative group shadow-lg border border-purple-200/30 dark:border-purple-600/30">
            <div className="prose prose-purple dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 text-gray-800 dark:text-gray-200">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-purple-600 dark:text-purple-400">{children}</strong>,
                  em: ({ children }) => <em className="italic text-purple-600 dark:text-purple-400">{children}</em>,
                  code: ({ children }) => <code className="bg-purple-100/50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-slate-900 dark:bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto my-3 border border-slate-700">{children}</pre>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
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
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:bg-purple-100/80 dark:hover:bg-purple-800/80"
            >
              <i className={`fas ${copied ? 'fa-check text-green-600' : 'fa-copy text-purple-600 dark:text-purple-400'} text-xs`}></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
