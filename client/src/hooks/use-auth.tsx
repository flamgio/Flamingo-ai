import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { useLocation } from "wouter";
import { useState, useCallback } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      // Verify the current token is still valid
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoading(false);
        return true;
      }

      // Token is invalid, remove it
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Initialize auth state by trying to refresh token
  // This should ideally be done within a context provider or a top-level component
  // For simplicity in this example, we call it directly. In a real app, consider useEffect.
  // useEffect(() => {
  //   refreshToken();
  // }, [refreshToken]);


  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest.post<AuthResponse>('/api/auth/login', credentials);
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

      // Role-based redirection
      const userRole = data.user.role;
      if (userRole === 'admin') {
        setLocation('/admin');
      } else if (userRole === 'manager') {
        setLocation('/manager');
      } else {
        setLocation('/dashboard');
      }
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsLoading(false);
        return { success: true, message: 'Login successful' };
      } else {
        setIsLoading(false);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);


  return {
    user: user,
    isLoading: isLoading,
    error: loginMutation.error || signupMutation.error,
    login: login,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!user,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };
}