import { useState, useCallback, useEffect } from "react";
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
  });

  // Sync fetched conversations with local state
  useEffect(() => {
    if (fetchedConversations) {
      setConversations(fetchedConversations);
    }
  }, [fetchedConversations]);

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