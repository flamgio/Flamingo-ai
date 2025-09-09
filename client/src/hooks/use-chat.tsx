
import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  selectedModel?: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useChat(conversationId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const token = localStorage.getItem('flamingo-token');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    enabled: !!user,
    staleTime: 30000,
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const token = localStorage.getItem('flamingo-token');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!conversationId && !!user,
    staleTime: 10000,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const token = localStorage.getItem('flamingo-token');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ prompt, conversationId: convId, selectedModel }: {
      prompt: string;
      conversationId?: string;
      selectedModel?: string;
    }) => {
      const token = localStorage.getItem('flamingo-token');
      if (!token) throw new Error('No auth token');

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          conversationId: convId,
          selectedModel: selectedModel || 'gpt-3.5-turbo',
          useEnhancement: false,
        }),
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversationId, 'messages'] });
      }
      setIsTyping(false);
      setCurrentMessage('');
    },
    onError: (error) => {
      console.error('Send message error:', error);
      setIsTyping(false);
      setCurrentMessage('');
    },
  });

  const sendMessage = useCallback(async (prompt: string, selectedModel?: string) => {
    if (!prompt.trim() || !user) return;

    setIsTyping(true);
    setCurrentMessage('');

    try {
      await sendMessageMutation.mutateAsync({
        prompt: prompt.trim(),
        conversationId,
        selectedModel,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  }, [user, conversationId, sendMessageMutation]);

  const createConversation = useCallback(async (title: string) => {
    try {
      return await createConversationMutation.mutateAsync(title);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }, [createConversationMutation]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
    setCurrentMessage('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    conversations,
    isLoading: messagesLoading || conversationsLoading,
    isTyping,
    currentMessage,
    sendMessage,
    createConversation,
    stopGeneration,
    refetchMessages,
    error: sendMessageMutation.error,
    isCreatingConversation: createConversationMutation.isPending,
    isSending: sendMessageMutation.isPending,
  };
}
