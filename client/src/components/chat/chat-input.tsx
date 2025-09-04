import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSubmitting) return;

    const messageToSend = message.trim();
    setMessage('');
    setIsSubmitting(true);

    try {
      await onSendMessage(messageToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-purple-200/30 dark:border-purple-600/30 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-600/30 shadow-xl backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                data-testid="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={disabled || isSubmitting}
                rows={1}
                className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-base leading-6 max-h-32 overflow-y-auto"
                style={{ height: 'auto' }}
              />
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || disabled || isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 rounded-xl px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="send-button"
            >
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              )}
            </Button>
          </form>
          
          {/* Suggestion Tags */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              AI Assistant
            </span>
            <span className="px-3 py-1 bg-pink-100/50 dark:bg-pink-800/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
              Smart Chat
            </span>
            <span className="px-3 py-1 bg-indigo-100/50 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
              Intelligent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
