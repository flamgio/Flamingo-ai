import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = () => {
    try {
      const adminSession = sessionStorage.getItem('admin_session');
      const timestamp = sessionStorage.getItem('admin_timestamp');
      
      if (adminSession === 'authenticated' && timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp);
        const maxAge = 2 * 60 * 60 * 1000; // 2 hours session timeout
        
        if (sessionAge < maxAge) {
          setIsAdminAuthenticated(true);
        } else {
          // Session expired
          clearAdminSession();
        }
      }
    } catch (error) {
      console.error('Admin session check failed:', error);
      clearAdminSession();
    } finally {
      setIsChecking(false);
    }
  };

  const clearAdminSession = () => {
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_timestamp');
    setIsAdminAuthenticated(false);
  };

  const logout = () => {
    clearAdminSession();
  };

  return {
    isAdminAuthenticated,
    isChecking,
    logout,
    checkAdminSession
  };
}