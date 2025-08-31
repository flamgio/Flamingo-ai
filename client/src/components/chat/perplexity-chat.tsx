import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import PromptEnhancementModal from "./prompt-enhancement-modal";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  selectedModel?: string;
  metadata?: any;
  createdAt?: string;
}

interface PerplexityChatProps {
  conversationId?: string;
  initialMessages?: Message[];
}

export default function PerplexityChat({ conversationId, initialMessages = [] }: PerplexityChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);
  const [enhancementData, setEnhancementData] = useState<{
    original: string;
    enhanced: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageContent: string, useEnhancement: boolean = false) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          prompt: messageContent,
          conversationId: conversationId,
          selectedModel: 'gpt-3.5-turbo',
          useEnhancement: useEnhancement ? enhancementData?.enhanced : null
        })
      });

      const result = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        selectedModel: result.model,
        metadata: {
          provider: result.provider,
          model: result.model,
          wordCount: result.wordCount,
          task: result.task,
          signature: result.signature
        },
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForEnhancement = async (prompt: string) => {
    if (prompt.trim().length < 10) { // Skip very short prompts
      await handleSendMessage(prompt, false);
      return;
    }

    try {
      setIsEnhancing(true);
      // Show enhancement modal immediately with loading state
      setEnhancementData({
        original: prompt,
        enhanced: ''
      });
      setShowEnhancementModal(true);

      const response = await apiRequest.post('/api/enhance-prompt', { prompt });

      if (response.data.needsEnhancement) {
        setEnhancementData({
          original: response.data.original,
          enhanced: response.data.enhanced
        });
        // Modal stays open to show enhanced version
      } else {
        // If no enhancement needed, close modal and send original
        setShowEnhancementModal(false);
        await handleSendMessage(prompt, false);
      }
    } catch (error) {
      console.error('Enhancement check failed:', error);
      // Close modal and fallback to original prompt
      setShowEnhancementModal(false);
      await handleSendMessage(prompt, false);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const prompt = inputValue.trim();
    setInputValue("");

    await checkForEnhancement(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEnhancementChoice = async (useEnhanced: boolean) => {
    if (!enhancementData) return;

    const finalPrompt = useEnhanced ? enhancementData.enhanced : enhancementData.original;
    setShowEnhancementModal(false);
    setEnhancementData(null);

    await handleSendMessage(finalPrompt, useEnhanced);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-4xl w-full ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                {message.role === 'user' ? (
                  <div className="chat-message-user px-6 py-4 rounded-2xl max-w-2xl">
                    <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <Card className="chat-message-assistant p-6 max-w-none">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-robot text-white text-sm"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        {message.selectedModel && (
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              {message.selectedModel}
                            </span>
                            {message.metadata?.processingTime && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {message.metadata.processingTime}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="prose dark:prose-invert prose-blue max-w-none text-sm leading-relaxed">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <Card className="chat-message-assistant p-6 max-w-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <i className="fas fa-cog text-white text-sm"></i>
                  </motion.div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="chat-input-container relative">
            <Textarea
              ref={textareaRef}
              data-testid="chat-input"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 resize-none focus:ring-0 bg-transparent text-sm leading-relaxed min-h-[52px] max-h-32 placeholder-black dark:placeholder-white"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {inputValue.trim() && (
                <Button
                  data-testid="send-button"
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0 shadow-lg"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Prompt Enhancement Modal */}
      <PromptEnhancementModal
        isOpen={showEnhancementModal}
        originalPrompt={enhancementData?.original || ''}
        enhancedPrompt={enhancementData?.enhanced || ''}
        onUseEnhanced={() => handleEnhancementChoice(true)}
        onUseOriginal={() => handleEnhancementChoice(false)}
        onClose={() => {
          setShowEnhancementModal(false);
          setEnhancementData(null);
        }}
        isEnhancing={isEnhancing}
      />
    </div>
  );
}