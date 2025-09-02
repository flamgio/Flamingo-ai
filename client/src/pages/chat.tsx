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
      setEnhancedPrompt(response.enhanced);
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
              <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                <i className="fas fa-brain mr-1"></i>
                AI Chat Active
              </span>
            </div>
          </div>
        </header>

        {/* Modern Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/30">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <i className="fas fa-robot text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Flamingo AI
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Start a conversation with our intelligent AI
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-blue-500"></i>
                    <span>Privacy First</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-brain text-purple-500"></i>
                    <span>Smart Routing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-memory text-green-500"></i>
                    <span>Persistent Memory</span>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="fas fa-brain text-white text-sm animate-pulse"></i>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-md shadow-xl border border-gray-100 dark:border-gray-600">
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
            isLoading={isLoading} 
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
        isEnhancing={enhanceMutation.isLoading}
      />
    </div>
  );
}