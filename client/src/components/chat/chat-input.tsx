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
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              data-testid="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Flamingo AI anything..."
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 min-h-[60px] max-h-[150px] shadow-xl hover:shadow-2xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base"
              disabled={disabled || isSubmitting}
              style={{ height: 'auto' }}
            />
            <Button
              data-testid="send-message-btn"
              type="submit"
              size="sm"
              disabled={!message.trim() || disabled || isSubmitting}
              className="absolute right-4 top-4 w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white p-0 shadow-xl transform hover:scale-110 transition-all duration-300 rounded-xl"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin text-sm"></i>
              ) : (
                <i className="fas fa-paper-plane text-sm transform hover:translate-x-1 transition-transform duration-200"></i>
              )}
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <i className="fas fa-keyboard text-blue-500"></i>
              <span>Enter to send, Shift + Enter for new line</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <i className="fas fa-brain text-purple-500"></i>
            <span>Powered by Flamingo AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
