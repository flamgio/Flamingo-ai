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

  const handleSendWithEnhancement = async (message: string) => {
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

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAdminAccess={handleAdminAccess}
      />

      <div className="flex-1 flex flex-col">
        {/* Modern Header with Flamingo branding */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
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

              {/* Clickable Flamingo Logo and Name */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setLocation('/')}>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
                    Flamingo AI
                  </h1>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentConversation?.title || 'New Conversation'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
                <i className="fas fa-comment mr-1"></i>
                Chat Active
              </span>
            </div>
          </div>
        </header>

        {/* Modern Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/30">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-white text-xl font-bold">FA</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Welcome to Flamingo AI
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Start a professional conversation
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-blue-500"></i>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-comment text-purple-500"></i>
                    <span>Professional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-clock text-green-500"></i>
                    <span>Fast Response</span>
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
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-typing"></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-typing" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
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