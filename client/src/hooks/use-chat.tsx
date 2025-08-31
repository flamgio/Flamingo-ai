import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import type { Conversation, Message } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useChat() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Fetch messages for current conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && !!currentConversationId,
  });

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
      }

      // Send message using agent endpoint
      const response = await apiRequest('POST', '/api/agent', {
        prompt: content,
        conversationId: conversationId,
        selectedModel: 'gpt-3.5-turbo',
        useEnhancement: false
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
  });

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return {
    conversations,
    messages,
    currentConversation,
    sendMessage: sendMessageMutation.mutateAsync,
    isLoading: sendMessageMutation.isPending,
    setCurrentConversation: setCurrentConversationId,
  };
}
