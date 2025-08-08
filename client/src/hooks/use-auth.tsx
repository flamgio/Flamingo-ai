
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import type { User } from "@shared/schema";

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
  const queryClient = useQueryClient();

  // Get token from localStorage
  const getToken = () => localStorage.getItem('flamgio-token');
  
  // Set token in localStorage and Authorization header
  const setToken = (token: string) => {
    localStorage.setItem('flamgio-token', token);
    // Update default headers for future requests
    apiRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };
  
  // Remove token
  const removeToken = () => {
    localStorage.removeItem('flamgio-token');
    delete apiRequest.defaults.headers.common['Authorization'];
  };

  // Set initial token if exists
  const token = getToken();
  if (token) {
    apiRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    enabled: !!token, // Only fetch if token exists
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiRequest.post('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(['/api/auth/user'], data.user);
      // Redirect to chat
      window.location.href = '/chat';
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials): Promise<AuthResponse> => {
      const response = await apiRequest.post('/api/auth/signup', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(['/api/auth/user'], data.user);
      // Redirect to chat
      window.location.href = '/chat';
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
      removeToken();
      queryClient.clear();
      window.location.href = '/';
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!user && !!token,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };
}
