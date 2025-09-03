import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@shared/schema";
import { formatDistanceToNow } from 'date-fns';
import SettingsModal from './settings-modal';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversation?: Conversation;
  isOpen: boolean;
  onClose: () => void;
  onAdminAccess: () => void;
}

export default function ChatSidebar({
  conversations,
  currentConversation,
  isOpen,
  onClose,
  onAdminAccess
}: ChatSidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Unknown';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Invalid Date';

      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <>
      <div className={`w-80 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
      } fixed lg:fixed inset-y-0 left-0 z-30 lg:z-30`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-purple-200/50 dark:border-purple-500/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-sm">FA</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                  Flamingo AI
                </h1>
              </div>
            </div>
            <Button
              data-testid="sidebar-close"
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
          <Button
            data-testid="new-chat-btn"
            className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            New Conversation
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-purple-50/20 dark:from-slate-800 dark:to-purple-900/10 backdrop-blur-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white uppercase tracking-wide mb-3">
              Recent Chats
            </h3>

            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-comments text-gray-400 dark:text-gray-500"></i>
                </div>
                <p className="text-sm text-gray-300">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  data-testid={`conversation-${conversation.id}`}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-blue-100 dark:bg-gray-700 border border-blue-200 dark:border-gray-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {conversation.title}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(conversation.updatedAt || conversation.createdAt || Date.now()))} ago
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-purple-200/50 dark:border-purple-500/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
          <Button
            data-testid="settings-btn"
            variant="ghost"
            className="w-full justify-start text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-105 transition-all duration-200"
            onClick={() => setShowSettings(true)}
          >
            <i className="fas fa-cog mr-3"></i>
            Settings
          </Button>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </>
  );
}