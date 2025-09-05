import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { AnalyticsChart } from "@/components/analytics-chart";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useUserAnalytics } from "@/hooks/use-user-analytics";
import logoImg from "@/assets/logo.png";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { formattedTime, sessionTime } = useScreenTime();
  const { analytics, trackPageVisit, trackScreenTime } = useUserAnalytics();

  // Real user analytics data
  const activityData = analytics.activityData;
  const usageData = analytics.usageData;

  useEffect(() => {
    // Only redirect if user is explicitly null (not loading/undefined)
    if (user === null) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  // Track page visit and screen time
  useEffect(() => {
    if (user) {
      trackPageVisit('Dashboard', 1);
    }
  }, [user, trackPageVisit]);

  // Track screen time every minute
  useEffect(() => {
    if (user && sessionTime > 0) {
      const minutes = Math.floor(sessionTime / 60);
      if (minutes > 0) {
        trackScreenTime(minutes);
      }
    }
  }, [sessionTime, trackScreenTime, user]);

  const handleStartChat = () => {
    setLocation('/chat');
  };

  // Show loading state while user data is being fetched
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // User is explicitly null (not authenticated)
  if (user === null) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Header with Screen Time */}
        <div className="relative z-10 p-6 border-b border-purple-500/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Welcome back, {user?.username || 'User'}!
              </h1>
              <p className="text-purple-100/70 mt-1">Explore your AI-powered workspace</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-purple-200/70 uppercase tracking-wide">Session Time</p>
                <p className="text-lg font-bold text-white" data-testid="session-time">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="relative z-10 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200/70 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-white">247</p>
                </div>
                <i className="fas fa-comment text-purple-300 text-2xl"></i>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200/70 text-sm">Conversations</p>
                  <p className="text-2xl font-bold text-white">18</p>
                </div>
                <i className="fas fa-comments text-purple-300 text-2xl"></i>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200/70 text-sm">Active Time</p>
                  <p className="text-2xl font-bold text-white">4h 32m</p>
                </div>
                <i className="fas fa-clock text-purple-300 text-2xl"></i>
              </div>
            </motion.div>
          </div>

          {/* Analytics Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <AnalyticsChart 
              data={activityData} 
              type="line" 
              title="Weekly Activity" 
              color="#a855f7"
            />
            <AnalyticsChart 
              data={usageData} 
              type="bar" 
              title="Feature Usage" 
              color="#ec4899"
            />
          </div>

          {/* Action Cards Row */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative h-[18em] w-full border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] via-purple-700/80 to-[rgba(75,30,133,0.2)] text-white p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group/card hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <h1 className="text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  Chat
                </h1>
                <p className="text-[0.9em] text-purple-100/90 leading-relaxed font-light">
                  Experience intelligent conversations with our advanced AI. Start your journey into seamless communication and discover the power of smart responses.
                </p>
              </div>

              <button
                onClick={handleStartChat}
                className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-300/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-500/10"
                data-testid="start-chat-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                <p className="relative z-10 font-medium tracking-wide">Begin Journey</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </motion.div>

            {/* Premium Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[18em] w-full border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] via-purple-700/80 to-[rgba(75,30,133,0.2)] text-white p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group/card hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <h1 className="text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  Premium
                </h1>
                <p className="text-[0.9em] text-purple-100/90 leading-relaxed font-light">
                  Unlock unlimited potential with premium features. Enhanced models, priority support, and exclusive capabilities await your exploration.
                </p>
              </div>

              <button
                onClick={() => setLocation('/pricing')}
                className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-300/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-500/10"
                data-testid="pricing-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                <p className="relative z-10 font-medium tracking-wide">Explore Now</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}