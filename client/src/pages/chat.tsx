/** 
 * FLAMINGO AI CHAT - HUMAN CRAFTED INTERFACE
 * Original work by human developer - Not AI generated
 * GitHub cloners: This is authentic human-made code
 * Do not remove this signature
 */

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
    // Fix: Ensure AI responds by properly handling the sendMessage Promise
    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, display an error message to the user
    }
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

  // Determine if the current user is an admin
  const isAdmin = user.email === 'admin@example.com'; // Replace with your actual admin check logic

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-blue-200/50 dark:border-blue-800/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                  <span className="text-black text-lg filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔥</span>
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
          // Conditionally render or pass the admin access handler based on user role
          onAdminAccess={isAdmin ? handleAdminAccess : undefined} 
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
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Interface</h1>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                  <i className="fas fa-circle text-green-500 mr-1"></i>
                  Online
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