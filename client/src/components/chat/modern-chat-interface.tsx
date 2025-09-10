import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { animations, gsapUtils } from "@/lib/animations";
import { 
  Send, 
  Loader2, 
  Copy, 
  Check,
  Menu,
  X,
  Moon,
  Sun,
  MessageSquare,
  Trash2,
  Plus,
  Sparkles
} from "lucide-react";
import type { Message } from "@shared/schema";

interface ModernChatInterfaceProps {
  conversationId?: string;
  initialMessages?: Message[];
}

export default function ModernChatInterface({ conversationId, initialMessages = [] }: ModernChatInterfaceProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // GSAP animations setup
  useGSAP(() => {
    // Initialize send button glow effect
    if (sendButtonRef.current) {
      gsap.set(sendButtonRef.current, {
        boxShadow: "0 0 0px rgba(168, 85, 247, 0.4)"
      });
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      gsap.to(messagesEndRef.current, {
        scrollTop: messagesEndRef.current.scrollHeight,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping && typingIndicatorRef.current) {
      gsapUtils.typingIndicator(typingIndicatorRef.current);
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    setInputValue("");
    
    // Animate send button
    if (sendButtonRef.current) {
      gsap.to(sendButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: conversationId || "",
      role: 'user',
      content: messageContent,
      selectedModel: null,
      metadata: null,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('flamingo-token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: messageContent,
          enhanced: null // Match the API schema
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      const assistantMessage: Message = {
        id: result.id || Date.now().toString(),
        conversationId: conversationId || "",
        role: 'assistant',
        content: result.content || "I apologize, but I'm currently experiencing technical difficulties. Please try again.",
        selectedModel: result.selectedModel || 'flamingo-ai',
        metadata: result.metadata || null,
        createdAt: new Date(result.createdAt || Date.now())
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        conversationId: conversationId || "",
        role: 'assistant',
        content: "I apologize, but I'm currently experiencing technical difficulties. Please check your connection and try again.",
        selectedModel: null,
        metadata: null,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      
      // Animate the copy success
      gsap.to(`[data-testid="button-copy-message"]`, {
        scale: 1.2,
        duration: 0.2,
        ease: "backOut",
        yoyo: true,
        repeat: 1
      });
      
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a]/50 to-[#2a2a2a]/50 border-r border-purple-600/30 shadow-xl backdrop-blur-lg md:relative md:shadow-none"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-600/30">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    data-testid="logo-flamingo"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </button>
                  <span className="font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Conversations</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden"
                  data-testid="button-close-sidebar"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* New Conversation Button */}
              <div className="p-4">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-new-conversation"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length > 0 && (
                  <Card className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <MessageSquare className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate text-white">
                          Current Chat
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    data-testid="button-theme-toggle"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Hidden when messages exist */}
        {messages.length === 0 && (
          <div className="flex items-center justify-between p-4 border-b border-purple-600/30 bg-gradient-to-r from-[#1a1a1a] via-purple-900/30 to-purple-800/30 backdrop-blur-lg">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-purple-800/30"
                data-testid="button-menu"
              >
                <Menu className="h-5 w-5 text-purple-400" />
              </Button>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  data-testid="logo-flamingo-header"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </button>
                <span className="font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent text-lg">Flamingo AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-purple-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        )}

        {/* Minimized header when messages exist */}
        {messages.length > 0 && (
          <div className="flex items-center justify-between p-2 border-b border-purple-600/10 bg-[#1a1a1a]/90 backdrop-blur-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-purple-800/30"
              data-testid="button-menu-minimized"
            >
              <Menu className="h-4 w-4 text-purple-400" />
            </Button>
            <div className="flex items-center space-x-1 bg-purple-500/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-400 font-medium">AI Active</span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-[#1a1a1a]/60 via-[#2a2a2a]/30 to-[#1a1a1a]/50 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <motion.div 
                {...animations.scaleIn}
                className="text-center max-w-lg px-6"
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative overflow-hidden border-2 border-purple-500/30"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-600/30 opacity-40 animate-pulse"></div>
                  <div className="absolute -inset-2 rounded-full bg-purple-500/20 opacity-30 animate-ping"></div>
                </motion.div>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-4">
                    Welcome to Flamingo AI
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Experience the future of AI conversation. I'm here to assist you with intelligent responses, creative solutions, and engaging discussions.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Powered by advanced AI models</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  {...animations.messageSlideIn}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.role}`}
                >
                  <div className={`flex items-end space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <motion.div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-purple-500/30 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700' 
                          : 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border-purple-500/50'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-white text-sm font-bold drop-shadow-sm">
                        {message.role === 'user' ? user?.firstName?.charAt(0) || 'U' : <Sparkles className="w-4 h-4 text-purple-400" />}
                      </span>
                    </motion.div>
                    
                    {/* Message Bubble */}
                    <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <motion.div
                        whileHover={{ scale: 1.01, y: -2 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative"
                      >
                        {/* Message bubble with tail */}
                        <div className={`relative rounded-2xl p-4 shadow-xl backdrop-blur-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-white ml-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                            : 'bg-[#2a2a2a]/95 border border-purple-500/20 mr-4 text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                        }`}>
                          {/* Message tail */}
                          <div className={`absolute w-3 h-3 rotate-45 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-purple-600 to-purple-700 -left-1 bottom-4'
                              : 'bg-[#2a2a2a]/95 border-l border-b border-purple-500/20 -right-1 bottom-4'
                          }`}></div>
                          
                          {/* Message content */}
                          <div className={`prose prose-sm max-w-none ${
                            message.role === 'user' 
                              ? 'prose-invert prose-p:text-white prose-strong:text-white prose-em:text-white'
                              : 'dark:prose-invert'
                          }`}>
                            {message.role === 'assistant' ? (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            ) : (
                              <p className="whitespace-pre-wrap m-0 text-sm font-medium leading-relaxed">{message.content}</p>
                            )}
                          </div>
                          
                          {/* Assistant message footer */}
                          {message.role === 'assistant' && (
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/20">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                                  <span className="text-xs font-medium text-purple-400/80">
                                    {message.selectedModel || 'Flamingo AI'}
                                  </span>
                                </div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-xs text-gray-400">
                                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="h-7 w-7 hover:bg-purple-500/10 rounded-full transition-colors"
                                data-testid="button-copy-message"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="h-3 w-3 text-purple-400" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-400 hover:text-purple-400" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      {/* Message timestamp for user messages */}
                      {message.role === 'user' && (
                        <div className="text-xs text-gray-400 mt-1 mr-6">
                          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-3 max-w-[85%]">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-full flex items-center justify-center shadow-xl border-2 border-[#22c55e]/50">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="relative rounded-2xl p-4 bg-[#1a1a1a]/90 border border-[#22c55e]/20 shadow-xl backdrop-blur-sm mr-4 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      {/* Typing tail */}
                      <div className="absolute w-3 h-3 rotate-45 bg-[#1a1a1a]/90 border-l border-b border-[#22c55e]/20 -right-1 bottom-4"></div>
                      
                      <div ref={typingIndicatorRef} className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="typing-dot w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          <div className="typing-dot w-2 h-2 bg-[#16a34a] rounded-full shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
                          <div className="typing-dot w-2 h-2 bg-[#15803d] rounded-full shadow-[0_0_8px_rgba(21,128,61,0.6)]"></div>
                        </div>
                        <span className="text-sm text-[#22c55e]/80 font-medium">Flamingo is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-[#22c55e]/20 bg-[#0c0c0c]/80 backdrop-blur-xl p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4 bg-[#1a1a1a]/80 rounded-3xl p-4 shadow-2xl backdrop-blur-sm border border-[#22c55e]/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message Flamingo AI..."
                  className="min-h-[48px] max-h-36 resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-white placeholder-gray-400 text-base leading-relaxed"
                  disabled={isLoading}
                  data-testid="input-message"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  ref={sendButtonRef}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] hover:from-[#16a34a] hover:via-[#15803d] hover:to-[#166534] text-white border-0 h-12 w-12 rounded-full shadow-xl hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 disabled:opacity-50 disabled:scale-95"
                  data-testid="button-send"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
            {/* Input hint */}
            <div className="flex items-center justify-center mt-3 text-xs text-gray-400">
              <span>Press Enter to send, Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}