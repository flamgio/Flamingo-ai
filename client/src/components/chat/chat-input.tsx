import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            data-testid="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... I'll route it to the best model!"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-flamingo-500 focus:border-transparent transition-colors min-h-[52px] max-h-[150px]"
            disabled={disabled || isSubmitting}
            style={{ height: 'auto' }}
          />
          <Button
            data-testid="send-message-btn"
            type="submit"
            size="sm"
            disabled={!message.trim() || disabled || isSubmitting}
            className="absolute right-3 top-3 w-8 h-8 bg-gradient-to-r from-flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700 text-white p-0"
          >
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin text-sm"></i>
            ) : (
              <i className="fas fa-paper-plane text-sm"></i>
            )}
          </Button>
        </form>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>Powered by intelligent agent routing</span>
        </div>
      </div>
    </div>
  );
}
