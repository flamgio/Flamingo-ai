import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { apiRequest, enhancePrompt } from "@/lib/api"; // Assuming enhancePrompt is available here
import type { Conversation, Message } from "@shared/schema";
import { useAuth } from "./use-auth";
import { useMobile } from "./use-mobile"; // Assuming useMobile is available here

export function useChat() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isMobile = useMobile(); // Assuming useMobile hook is called here
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]); // State for conversations

  // Fetch conversations
  const { data: fetchedConversations = [], isLoading: isConversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
    onSuccess: (data) => setConversations(data), // Update local state
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && !!currentConversationId,
  });

  // Function to refresh conversations
  const refreshConversations = useCallback(async () => {
    try {
      // Assuming getConversations fetches conversations, this might need adjustment
      const response = await apiRequest('GET', '/api/conversations');
      const data = await response.json();
      setConversations(data);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    } catch (error) {
      console.error('Failed to refresh conversations:', error);
    }
  }, [queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      let conversationId = currentConversationId;

      // Create new conversation if none exists
      if (!conversationId) {
        const conversationResponse = await apiRequest('POST', '/api/conversations', {
          title: content.substring(0, 50) + (content.length > 50 ? '...' : '')
        });

        const newConversation = await conversationResponse.json();
        conversationId = newConversation.id;
        setCurrentConversationId(conversationId);
        refreshConversations(); // Refresh conversations after creating a new one
      }

      // Send message using agent endpoint
      const response = await apiRequest('POST', '/api/agent', {
        prompt: content,
        conversationId: conversationId,
        selectedModel: 'gpt-3.5-turbo',
        useEnhancement: true // Changed from false to true based on typical usage, adjust if needed
      });

      const result = await response.json();

      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      if (currentConversationId) {
        queryClient.invalidateQueries({
          queryKey: ['/api/conversations', currentConversationId, 'messages']
        });
      }
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      // Potentially set an error state here if needed for UI feedback
    }
  });

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const isLoading = isConversationsLoading || isMessagesLoading || sendMessageMutation.isPending;
  const error = sendMessageMutation.error; // Assuming mutation can have an error property

  return {
    conversations,
    messages,
    currentConversation,
    sendMessage: sendMessageMutation.mutateAsync,
    isLoading,
    setCurrentConversation: setCurrentConversationId,
    refreshConversations, // Added refreshConversations
    isMobile // Exposing isMobile
  };
}

/* CSS code for the chat box */
.container_chat_bot {
  display: flex;
  flex-direction: column;
  max-width: 260px;
  width: 100%;
}

.container_chat_bot .container-chat-options {
  position: relative;
  display: flex;
  background: linear-gradient(
    to bottom right,
    #7e7e7e,
    #363636,
    #363636,
    #363636,
    #363636
  );
  border-radius: 16px;
  padding: 1.5px;
  overflow: hidden;
}

.container_chat_bot .container-chat-options::after {
  position: absolute;
  content: "";
  top: -10px;
  left: -10px;
  background: radial-gradient(
    ellipse at center,
    #ffffff,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0)
  );
  width: 30px;
  height: 30px;
  filter: blur(1px);
}

.container_chat_bot .container-chat-options .chat {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  width: 100%;
  overflow: hidden;
}

.container_chat_bot .container-chat-options .chat .chat-bot {
  position: relative;
  display: flex;
}

.container_chat_bot .chat .chat-bot textarea {
  background-color: transparent;
  border-radius: 16px;
  border: none;
  width: 100%;
  height: 50px;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 400;
  padding: 10px;
  resize: none;
  outline: none;
}

.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar-track {
  background: transparent;
}

.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
  cursor: pointer;
}

.container_chat_bot .chat .chat-bot textarea::placeholder {
  color: #f3f6fd;
  transition: all 0.3s ease;
}
.container_chat_bot .chat .chat-bot textarea:focus::placeholder {
  color: #363636;
}

.container_chat_bot .chat .options {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px;
}

.container_chat_bot .chat .options .btns-add {
  display: flex;
  gap: 8px;
}

.container_chat_bot .chat .options .btns-add button {
  display: flex;
  color: rgba(255, 255, 255, 0.1);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.container_chat_bot .chat .options .btns-add button:hover {
  transform: translateY(-5px);
  color: #ffffff;
}

.container_chat_bot .chat .options .btn-submit {
  display: flex;
  padding: 2px;
  background-image: linear-gradient(to top, #292929, #555555, #292929);
  border-radius: 10px;
  box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.15s ease;
}

.container_chat_bot .chat .options .btn-submit i {
  width: 30px;
  height: 30px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(3px);
  color: #8b8b8b;
}
.container_chat_bot .chat .options .btn-submit svg {
  transition: all 0.3s ease;
}
.container_chat_bot .chat .options .btn-submit:hover svg {
  color: #f3f6fd;
  filter: drop-shadow(0 0 5px #ffffff);
}

.container_chat_bot .chat .options .btn-submit:focus svg {
  color: #f3f6fd;
  filter: drop-shadow(0 0 5px #ffffff);
  transform: scale(1.2) rotate(45deg) translateX(-2px) translateY(1px);
}

.container_chat_bot .chat .options .btn-submit:active {
  transform: scale(0.92);
}

.container_chat_bot .tags {
  padding: 14px 0;
  display: flex;
  color: #ffffff;
  font-size: 10px;
  gap: 4px;
}

.container_chat_bot .tags span {
  padding: 4px 8px;
  background-color: #1b1b1b;
  border: 1.5px solid #363636;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}