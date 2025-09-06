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

  useEffect(() => {
    if (fetchedConversations) {
      setConversations(fetchedConversations);
    }
  }, [fetchedConversations]);

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: isMessagesLoading, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && !!currentConversationId,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fetch fresh data
  });

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

        if (!conversationResponse.ok) {
          throw new Error('Failed to create conversation');
        }

        const newConversation = await conversationResponse.json();
        conversationId = newConversation.id;
        setCurrentConversationId(conversationId);
      }

      // Send message to chat API
      const response = await apiRequest('POST', '/api/agent', {
        prompt: content,
        conversationId: conversationId,
        selectedModel: 'auto',
        useEnhancement: false
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to send message: ${errorData}`);
      }

      const result = await response.json();
      return { result, conversationId };
    },
    onSuccess: (data) => {
      const { conversationId } = data;
      
      // Immediately invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      queryClient.invalidateQueries({
        queryKey: ['/api/conversations', conversationId, 'messages']
      });
      
      // Force refetch messages if we have the refetch function
      if (conversationId === currentConversationId && refetchMessages) {
        refetchMessages();
      }
      
      // Refresh conversations list
      refreshConversations();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
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