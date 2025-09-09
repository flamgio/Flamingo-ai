import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// Create axios instance
export const apiRequest = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up axios request interceptor for auth
const initializeAuth = () => {
  const token = localStorage.getItem('flamingo-token');
  if (token) {
    apiRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Initialize auth on app start
initializeAuth();

// Add request interceptor to ensure token is always included
apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flamingo-token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('flamingo-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Query function for React Query
export const getQueryFn = async ({ queryKey }: { queryKey: any }) => {
  const url = queryKey[0];
  const token = localStorage.getItem('flamingo-token');

  if (!token && url === '/api/user') {
    throw new Error('No auth token');
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('flamingo-token');
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message === 'Unauthorized' || error?.message === 'No auth token') {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});