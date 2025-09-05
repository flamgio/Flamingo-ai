import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ActivityData {
  name: string;
  value: number;
  messages: number;
}

interface UsageData {
  name: string;
  value: number;
}

interface UserAnalytics {
  activityData: ActivityData[];
  usageData: UsageData[];
  totalMessages: number;
  totalTimeSpent: number;
}

const STORAGE_KEY = 'flamingo_user_analytics';

export function useUserAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    activityData: [],
    usageData: [],
    totalMessages: 0,
    totalTimeSpent: 0
  });

  // Load analytics from localStorage on component mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          setAnalytics(parsedData);
        } catch (error) {
          console.error('Error parsing stored analytics:', error);
          initializeDefaultData();
        }
      } else {
        initializeDefaultData();
      }
    }
  }, [user]);

  const initializeDefaultData = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayIndex = now.getDay();
    
    // Create last 7 days starting from today
    const activityData: ActivityData[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (currentDayIndex - i + 7) % 7;
      activityData.push({
        name: days[dayIndex],
        value: i === 0 ? 0 : 0, // Start with 0, will be updated as user interacts
        messages: i === 0 ? 0 : 0
      });
    }

    const usageData: UsageData[] = [
      { name: 'Chat', value: 0 },
      { name: 'Dashboard', value: 0 },
      { name: 'Premium', value: 0 },
      { name: 'Settings', value: 0 }
    ];

    setAnalytics({
      activityData,
      usageData,
      totalMessages: 0,
      totalTimeSpent: 0
    });
  };

  // Save analytics to localStorage
  const saveAnalytics = useCallback((newAnalytics: UserAnalytics) => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newAnalytics));
      setAnalytics(newAnalytics);
    }
  }, [user]);

  // Track page visits
  const trackPageVisit = useCallback((pageName: string, timeSpent: number = 1) => {
    setAnalytics(prev => {
      const newUsageData = prev.usageData.map(item => 
        item.name === pageName 
          ? { ...item, value: item.value + timeSpent }
          : item
      );

      // If page not found, add it
      if (!newUsageData.find(item => item.name === pageName)) {
        newUsageData.push({ name: pageName, value: timeSpent });
      }

      const newAnalytics = {
        ...prev,
        usageData: newUsageData,
        totalTimeSpent: prev.totalTimeSpent + timeSpent
      };

      if (user) {
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newAnalytics));
      }
      
      return newAnalytics;
    });
  }, [user]);

  // Track chat messages
  const trackMessage = useCallback(() => {
    setAnalytics(prev => {
      const today = new Date().getDay();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayName = days[today];

      const newActivityData = prev.activityData.map(item => 
        item.name === todayName 
          ? { ...item, messages: item.messages + 1, value: item.value + 1 }
          : item
      );

      const newAnalytics = {
        ...prev,
        activityData: newActivityData,
        totalMessages: prev.totalMessages + 1
      };

      if (user) {
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newAnalytics));
      }
      
      return newAnalytics;
    });
  }, [user]);

  // Track screen time (called periodically)
  const trackScreenTime = useCallback((minutes: number) => {
    setAnalytics(prev => {
      const today = new Date().getDay();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayName = days[today];

      const newActivityData = prev.activityData.map(item => 
        item.name === todayName 
          ? { ...item, value: Math.max(item.value, minutes) } // Track max time for the day
          : item
      );

      const newAnalytics = {
        ...prev,
        activityData: newActivityData
      };

      if (user) {
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newAnalytics));
      }
      
      return newAnalytics;
    });
  }, [user]);

  return {
    analytics,
    trackPageVisit,
    trackMessage,
    trackScreenTime,
    saveAnalytics
  };
}