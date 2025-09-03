import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import '../styles/chat-input.css';

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
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-purple-200/50 dark:border-purple-500/20 p-6 shadow-lg shadow-purple-100/50 dark:shadow-purple-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="container_chat_bot transform transition-all duration-300 hover:scale-[1.02]">
          <div className="container-chat-options">
            <div className="chat">
              <div className="chat-bot">
                <form onSubmit={handleSubmit}>
                  <textarea
                    ref={textareaRef}
                    data-testid="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    disabled={disabled || isSubmitting}
                    style={{ height: 'auto' }}
                    className="transition-all duration-300 focus:scale-[1.01] focus:shadow-lg"
                  />
                </form>
              </div>
              <div className="options">
                <div className="btns-add">
                  <button type="button" className="hover:scale-110 transition-transform duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                  <button type="button" className="hover:scale-110 transition-transform duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-2V2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM9 4h6v1H9V4zm9 16H6V6h2v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6h2v14z"/>
                    </svg>
                  </button>
                </div>
                <button 
                  className="btn-submit hover:scale-110 transition-all duration-200 hover:shadow-lg"
                  type="submit"
                  disabled={!message.trim() || disabled || isSubmitting}
                  onClick={handleSubmit}
                >
                  <i className={isSubmitting ? "animate-spin" : ""}>
                    {isSubmitting ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    )}
                  </i>
                </button>
              </div>
            </div>
          </div>
          <div className="tags">
            <span className="animate-pulse">Professional</span>
            <span className="animate-pulse" style={{animationDelay: '0.1s'}}>AI Chat</span>
            <span className="animate-pulse" style={{animationDelay: '0.2s'}}>Smart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
