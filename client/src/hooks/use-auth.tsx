import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      // Redirect to login endpoint
      window.location.href = '/api/login';
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Redirect to logout endpoint
      window.location.href = '/api/logout';
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!user,
  };
}
