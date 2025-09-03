
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
    if (isSimpleGreeting(message)) {
      await handleSendMessage(message);
      return;
    }

    setPendingMessage(message);
    setOriginalPrompt(message);
    setShowEnhancementModal(true);
    enhanceMutation.mutate({ prompt: message });
  };

  const handleUseEnhanced = async () => {
    setShowEnhancementModal(false);
    await handleSendMessage(enhancedPrompt);
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleUseOriginal = async () => {
    setShowEnhancementModal(false);
    await handleSendMessage(originalPrompt);
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleCloseModal = () => {
    setShowEnhancementModal(false);
    setPendingMessage("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
  };

  const handleAdminAccess = () => {
    setLocation('/admin');
  };

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flamgio-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flamgio-theme', 'dark');
    }
  };

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar - Left Side */}
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAdminAccess={handleAdminAccess}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                data-testid="sidebar-toggle"
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setLocation('/')}>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Flamingo AI
                  </h1>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentConversation?.title || 'New Conversation'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="switch-small">
                <input type="checkbox" onChange={handleThemeToggle} />
                <span className="slider"></span>
              </label>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
                <i className="fas fa-comment mr-1"></i>
                Chat Active
              </span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-xl font-bold">FA</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Welcome to Flamingo AI
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Start a conversation with our AI assistant
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-blue-500"></i>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-comment text-purple-500"></i>
                    <span>Smart</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-clock text-green-500"></i>
                    <span>Fast</span>
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
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <ChatInput 
            onSendMessage={handleSendWithEnhancement} 
            disabled={isLoading} 
          />
        </div>
      </div>

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
