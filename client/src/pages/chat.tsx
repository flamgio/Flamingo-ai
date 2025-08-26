import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import PerplexityChat from "@/components/chat/perplexity-chat";
import ChatSidebar from "@/components/chat/chat-sidebar";
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-blue-200/50 dark:border-blue-800/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold font-mono">FA</span>
                </div>
                <button 
                  onClick={() => setLocation('/')}
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Flamgio AI
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                data-testid="logout-btn"
                variant="ghost"
                onClick={handleLogout}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  data-testid="sidebar-toggle"
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-blue-600 dark:text-blue-400"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <i className="fas fa-bars"></i>
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Flamingo AI</h1>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Intelligent AI routing with prompt enhancement</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                  <i className="fas fa-circle text-green-500 mr-1"></i>
                  Enhanced AI Ready
                </span>
              </div>
            </div>
          </div>
          
          {/* Perplexity-style Chat Area */}
          <PerplexityChat 
            conversationId={currentConversation?.id}
            initialMessages={messages}
          />
        </div>
      </div>
    </div>
  );
}
