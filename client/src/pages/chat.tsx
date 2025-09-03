import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { useMobile } from "@/hooks/use-mobile";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";
import ChatSidebar from "@/components/chat/chat-sidebar";
import PromptEnhancementModal from "@/components/chat/prompt-enhancement-modal";
import { useMutation } from "@tanstack/react-query";
import { enhancePrompt } from "@/lib/api";
import "../styles/new-theme-toggle.css";
import { useTheme } from "@/components/ui/theme-provider";

export default function Chat() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { 
    messages, 
    conversations, 
    currentConversation, 
    sendMessage, 
    isLoading,
    refreshConversations
  } = useChat();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const enhanceMutation = useMutation({
    mutationFn: enhancePrompt,
    onSuccess: (response) => {
      setEnhancedPrompt(response.enhancedPrompt || response.enhanced || response.result);
    },
    onError: (error) => {
      console.error('Enhancement failed:', error);
      // If enhancement fails, just send the original message
      handleSendMessage(pendingMessage);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const isSimpleGreeting = (message: string): boolean => {
    const cleanMessage = message.toLowerCase().trim();
    const greetings = [
      'hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 
      'good evening', 'how are you', 'how are you doing', 'whats up', 
      'what\'s up', 'sup', 'yo', 'good day', 'howdy', 'greetings'
    ];
    
    return greetings.some(greeting => 
      cleanMessage === greeting || 
      cleanMessage.startsWith(greeting + ' ') ||
      cleanMessage.startsWith(greeting + '!')
    ) || cleanMessage.length < 4;
  };

  const handleSendWithEnhancement = async (message: string) => {
    // Check if it's a simple greeting - if so, send directly
    if (isSimpleGreeting(message)) {
      await handleSendMessage(message);
      return;
    }

    // Store the original message
    setPendingMessage(message);
    setOriginalPrompt(message);

    // Show the modal immediately
    setShowEnhancementModal(true);

    // Start enhancement
    enhanceMutation.mutate({ prompt: message });
  };

  const handleUseEnhanced = async () => {
    setShowEnhancementModal(false);
    await handleSendMessage(enhancedPrompt);
    // Clear state
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleUseOriginal = async () => {
    setShowEnhancementModal(false);
    await handleSendMessage(originalPrompt);
    // Clear state
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleCloseModal = () => {
    setShowEnhancementModal(false);
    // Clear state
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleAdminAccess = () => {
    setLocation('/admin');
  };

  const { toggleTheme, theme } = useTheme();

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Chat Content - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Flamingo branding */}
        <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-500/20 p-4 shadow-lg shadow-purple-100/50 dark:shadow-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* History Toggle Button */}
              <Button
                data-testid="history-toggle"
                variant="ghost"
                size="sm"
                className="hover:bg-purple-100 dark:hover:bg-purple-800/20 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-history text-purple-600 dark:text-purple-400"></i>
              </Button>

              {/* Clickable Flamingo Logo and Name */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setLocation('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                    Flamingo AI
                  </h1>
                  <span className="text-xs text-purple-500/70 dark:text-purple-400/70">
                    {currentConversation?.title || 'New Conversation'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* New Switch Theme Toggle */}
              <label className="switch" data-testid="theme-toggle">
                <input 
                  type="checkbox" 
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>
              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium border border-purple-200/50 dark:border-purple-600/20">
                <i className="fas fa-sparkles mr-1 text-purple-500"></i>
                AI Active
              </span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-purple-50/30 via-indigo-50/20 to-pink-50/30 dark:from-slate-900/50 dark:via-purple-900/10 dark:to-indigo-900/10">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                  <span className="text-white text-xl font-bold">FA</span>
                </div>
                <h3 className="text-3xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">Flamingo</span>{" "}
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent animate-pulse">AI</span>
                </h3>
                <p className="text-lg text-purple-600/80 dark:text-purple-400/80 mb-6 font-medium">
                  Start your intelligent conversation
                </p>
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-purple-100/50 dark:bg-purple-800/20 px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-600/20">
                    <i className="fas fa-shield-alt text-purple-500"></i>
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Private</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-pink-100/50 dark:bg-pink-800/20 px-4 py-2 rounded-full border border-pink-200/50 dark:border-pink-600/20">
                    <i className="fas fa-brain text-pink-500"></i>
                    <span className="text-pink-700 dark:text-pink-300 font-medium">Intelligent</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-indigo-100/50 dark:bg-indigo-800/20 px-4 py-2 rounded-full border border-indigo-200/50 dark:border-indigo-600/20">
                    <i className="fas fa-bolt text-indigo-500"></i>
                    <span className="text-indigo-700 dark:text-indigo-300 font-medium">Fast</span>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-800/20 dark:to-pink-800/20 p-4 rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-600/20 backdrop-blur-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-typing"></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full animate-typing" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area - Full Width */}
        <ChatInput 
          onSendMessage={handleSendWithEnhancement} 
          disabled={isLoading} 
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - History - Left Side */}
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAdminAccess={handleAdminAccess}
      />

      <PromptEnhancementModal
        isOpen={showEnhancementModal}
        originalPrompt={originalPrompt}
        enhancedPrompt={enhancedPrompt}
        onUseEnhanced={handleUseEnhanced}
        onUseOriginal={handleUseOriginal}
        onClose={handleCloseModal}
        isEnhancing={enhanceMutation.isPending}
      />
    </div>
  );
}