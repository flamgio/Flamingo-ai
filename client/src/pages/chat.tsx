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
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <ChatSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
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
          {/* Mobile Sidebar Toggle - hidden by default */}
          <div className="lg:hidden absolute top-4 left-4 z-50">
            <Button
              data-testid="sidebar-toggle"
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fas fa-bars"></i>
            </Button>
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