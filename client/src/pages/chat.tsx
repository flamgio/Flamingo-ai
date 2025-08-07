import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Chat() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { messages, sendMessage, isLoading, currentConversation, conversations } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleAdminAccess = () => {
    setLocation('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-flamingo-400 to-flamingo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">FA</span>
                </div>
                <button 
                  onClick={() => setLocation('/')}
                  className="text-xl font-bold text-gray-900 dark:text-white hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors"
                >
                  Flamgio AI
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                data-testid="admin-access-btn"
                variant="ghost"
                onClick={handleAdminAccess}
                className="text-gray-600 dark:text-gray-400"
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Admin
              </Button>
              <Button
                data-testid="logout-btn"
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar */}
        <ChatSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAdminAccess={handleAdminAccess}
        />
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  data-testid="sidebar-toggle"
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <i className="fas fa-bars text-gray-600 dark:text-gray-400"></i>
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Powered by intelligent agent routing</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  <i className="fas fa-circle text-green-500 mr-1"></i>
                  Online
                </span>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-16 h-16 bg-flamingo-100 dark:bg-flamingo-900/30 rounded-full flex items-center justify-center mx-auto">
                    <i className="fas fa-robot text-flamingo-600 dark:text-flamingo-400 text-2xl"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome to Flamgio AI</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ask me anything! I'll intelligently route your query to the best available model.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <i className="fas fa-robot text-gray-600 dark:text-gray-300 text-sm"></i>
                      </div>
                      <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
