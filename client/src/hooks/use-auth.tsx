import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { useLocation } from "wouter";

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

  const userQuery = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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

  return {
    user: userQuery.data as User | null | undefined,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!userQuery.data,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };
}