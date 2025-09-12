import { useState, useEffect, useRef } from 'react';

interface RealtimeMetrics {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalMessages: number;
  activeSessions: number;
  systemHealth: number;
  avgResponseTime: number;
  apiRequestsToday: number;
  serverUptime: number;
  openChats: number;
  lastUpdated: string;
}

interface RealtimeDataHook {
  data: RealtimeMetrics;
  isLoading: boolean;
  lastUpdate: Date;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export function useRealtimeData(): RealtimeDataHook {
  const [data, setData] = useState<RealtimeMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalMessages: 0,
    activeSessions: 0,
    systemHealth: 0,
    avgResponseTime: 0,
    apiRequestsToday: 0,
    serverUptime: 0,
    openChats: 0,
    lastUpdated: 'Loading...'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time data updates
  const generateRealtimeUpdate = () => {
    setData(prevData => {
      // Simulate small fluctuations in metrics
      const variance = (base: number, maxChange: number = 0.05) => {
        const change = (Math.random() - 0.5) * 2 * maxChange;
        return Math.max(0, Math.round(base * (1 + change)));
      };

      const varianceFloat = (base: number, maxChange: number = 0.1) => {
        const change = (Math.random() - 0.5) * 2 * maxChange;
        return Math.max(0, parseFloat((base * (1 + change)).toFixed(1)));
      };

      return {
        totalUsers: variance(prevData.totalUsers, 0.02),
        activeUsers: variance(prevData.activeUsers, 0.1),
        premiumUsers: variance(prevData.premiumUsers, 0.05),
        totalMessages: prevData.totalMessages + Math.floor(Math.random() * 10), // Gradually increasing
        activeSessions: variance(prevData.activeSessions, 0.15),
        systemHealth: Math.max(95, Math.min(100, varianceFloat(prevData.systemHealth, 0.02))),
        avgResponseTime: Math.max(0.8, Math.min(3.0, varianceFloat(prevData.avgResponseTime, 0.2))),
        apiRequestsToday: prevData.apiRequestsToday + Math.floor(Math.random() * 25),
        serverUptime: Math.max(99.5, Math.min(100, varianceFloat(prevData.serverUptime, 0.001))),
        openChats: variance(prevData.openChats, 0.15),
        lastUpdated: new Date().toLocaleTimeString()
      };
    });
    
    setLastUpdate(new Date());
  };

  // Simulate connection status changes
  const simulateConnectionStatus = () => {
    const statuses: Array<'connected' | 'disconnected' | 'connecting'> = ['connected', 'connected', 'connected', 'connecting'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setConnectionStatus(randomStatus);
  };

  // Setup real-time updates
  useEffect(() => {
    // Initial load
    setIsLoading(true);
    
    const initialTimeout = setTimeout(() => {
      setIsLoading(false);
      generateRealtimeUpdate();
    }, 1000);

    // Setup regular updates every 3-5 seconds
    intervalRef.current = setInterval(() => {
      generateRealtimeUpdate();
      
      // Occasionally simulate connection status changes
      if (Math.random() < 0.1) {
        simulateConnectionStatus();
      }
    }, 3000 + Math.random() * 2000); // 3-5 seconds

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isLoading,
    lastUpdate,
    connectionStatus
  };
}

// Hook specifically for admin metrics
export function useAdminRealtimeData() {
  const { data, isLoading, lastUpdate, connectionStatus } = useRealtimeData();
  
  return {
    adminStats: {
      totalUsers: data.totalUsers,
      premiumUsers: data.premiumUsers,
      totalMessages: data.totalMessages,
      systemHealth: data.systemHealth,
      dailyActiveUsers: data.activeUsers,
      activeSessions: data.activeSessions,
      apiRequestsToday: data.apiRequestsToday,
      serverUptime: data.serverUptime
    },
    isLoading,
    lastUpdate,
    connectionStatus
  };
}

// Hook specifically for manager metrics  
export function useManagerRealtimeData() {
  const { data, isLoading, lastUpdate, connectionStatus } = useRealtimeData();
  
  return {
    managerStats: {
      activeUsers: data.activeUsers,
      conversations: data.totalMessages,
      monthlyGrowth: 24, // Static for now
      systemHealth: data.systemHealth,
      totalMessages: data.totalMessages,
      avgResponseTime: data.avgResponseTime,
      openChats: data.openChats
    },
    isLoading,
    lastUpdate,
    connectionStatus
  };
}

// Hook for dashboard metrics
export function useDashboardRealtimeData() {
  const { data, isLoading, lastUpdate, connectionStatus } = useRealtimeData();
  
  return {
    dashboardStats: {
      totalUsers: data.totalUsers,
      activeUsers: data.activeUsers,
      totalMessages: data.totalMessages,
      systemHealth: data.systemHealth,
      avgResponseTime: data.avgResponseTime,
      openChats: data.openChats
    },
    isLoading,
    lastUpdate,
    connectionStatus
  };
}