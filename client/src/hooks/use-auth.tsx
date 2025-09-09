import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { useLocation } from "wouter";
import { useState, useCallback, useEffect } from 'react';

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Use React Query for user data
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest.post<AuthResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      // Store token
      localStorage.setItem('flamingo-token', data.token);
      
      // Update authorization header immediately
      apiRequest.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data in cache
      queryClient.setQueryData(["/api/user"], data.user);
      
      // Small delay to ensure token is set
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await apiRequest.post<AuthResponse>('/api/auth/signup', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem('flamingo-token', data.token);
      // Force update the authorization header
      apiRequest.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      // Set user data immediately
      queryClient.setQueryData(["/api/user"], data.user);
      // Wait a moment before invalidating to ensure the token is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      // Automatically redirect to dashboard after signup (regular users only)
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      console.error('Signup failed:', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest.post('/api/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('flamingo-token');
      queryClient.clear();
      window.location.href = '/';
    },
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }, [loginMutation]);

  return {
    user: user || null,
    isLoading,
    error: error || loginMutation.error || signupMutation.error,
    login,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!user,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    refetch,
  };
}