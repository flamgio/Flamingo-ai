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
import { useUserAnalytics } from "@/hooks/use-user-analytics";

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
  const { trackPageVisit, trackMessage } = useUserAnalytics();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      trackMessage(); // Track the message sent
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

  // Track page visit when component loads
  useEffect(() => {
    if (user) {
      trackPageVisit('Chat', 1);
    }
  }, [user, trackPageVisit]);

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 dark:from-indigo-900 dark:via-purple-800 dark:to-blue-900">
      {/* Chat Content - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimal Header */}
        <div className="p-2 bg-transparent">
          <Button
            data-testid="history-toggle"
            variant="ghost"
            size="sm"
            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100/20 dark:hover:bg-purple-800/20"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </Button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/30 via-blue-50/20 to-indigo-50/30 dark:from-indigo-900/50 dark:via-purple-800/10 dark:to-blue-900/10">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white font-bold text-lg">FA</span>
                </div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Ready to explore the future of AI?
                </div>
                <div className="text-base text-gray-600 dark:text-gray-300">
                  Ask anything, discover everything
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