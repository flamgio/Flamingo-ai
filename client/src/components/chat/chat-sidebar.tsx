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
      <div className={`w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative inset-y-0 left-0 z-30 lg:z-0`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flamingo AI
            </h2>
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
            className="w-full bg-gradient-to-r from- flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            New Conversation
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Recent Chats
            </h3>

            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-comments text-gray-400 dark:text-gray-500"></i>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  data-testid={`conversation-${conversation.id}`}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-flamingo-50 dark:bg-flamingo-900/20 border border-flamingo-200 dark:border-flamingo-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conversation.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(conversation.updatedAt || conversation.createdAt || Date.now()))} ago
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-flamingo-200 dark:border-gray-700">
          <Button
            data-testid="settings-btn"
            variant="ghost"
            className="w-full justify-start text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-700 dark:hover:text-flamingo-300 transform hover:scale-105 transition-all duration-200"
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