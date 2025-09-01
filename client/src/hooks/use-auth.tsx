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
    onSuccess: (data) => {
      localStorage.setItem('flamgio-token', data.token);
      queryClient.setQueryData(["/api/user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      // Don't auto-redirect here, let the component handle it
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
    onSuccess: (data) => {
      localStorage.setItem('flamgio-token', data.token);
      queryClient.setQueryData(["/api/user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      // Don't auto-redirect here, let the component handle it
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
      localStorage.removeItem('flamgio-token');
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