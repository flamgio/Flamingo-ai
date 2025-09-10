import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { AnalyticsChart } from "@/components/analytics-chart";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useUserAnalytics } from "@/hooks/use-user-analytics";
import { useRealTimeClock } from "@/hooks/use-real-time-clock";
import { animations, gsapUtils } from "@/lib/animations";
import logoImg from "@/assets/logo.png";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { formattedTime, sessionTime } = useScreenTime();
  const { analytics, trackPageVisit, trackScreenTime } = useUserAnalytics();
  const { formattedTime: clockTime, formattedDate } = useRealTimeClock();
  
  // GSAP refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const statsCardsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const actionCardsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  // GSAP animations on mount
  useGSAP(() => {
    if (!user || !containerRef.current) return;

    const tl = gsap.timeline();

    // Header entrance
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    
    // Stats cards staggered entrance
    .fromTo(statsCardsRef.current?.children || [],
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    )
    
    // Charts entrance
    .fromTo(chartsRef.current?.children || [],
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      },
      "-=0.2"
    )
    
    // Action cards entrance
    .fromTo(actionCardsRef.current?.children || [],
      { opacity: 0, y: 50, rotationY: -15 },
      { 
        opacity: 1, 
        y: 0, 
        rotationY: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      },
      "-=0.4"
    );

    // Add hover animations to stats cards
    const statsCards = statsCardsRef.current?.children;
    if (statsCards) {
      Array.from(statsCards).forEach((card) => {
        const element = card as HTMLElement;
        
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            y: -5,
            scale: 1.02,
            rotationY: 2,
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            rotationY: 0,
            boxShadow: "0 0 0 rgba(168, 85, 247, 0)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }
  }, [user]);

  const handleStartChat = () => {
    setLocation('/chat');
  };

  // Show loading state while user data is being fetched
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
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
    <div ref={containerRef} className="flex min-h-screen bg-[#0c0c0c] overflow-hidden relative">
      {/* Mobile Sidebar Overlay - Using 768px breakpoint for consistency */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-[#0c0c0c]/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarCollapsed(true)}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
      )}
      
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-[#0c0c0c] to-purple-700/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Header with Screen Time */}
        <div ref={headerRef} className="relative z-10 p-3 sm:p-6 lg:p-8 border-b border-purple-500/20 animate-premium-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 md:hidden">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-white hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-purple-500/20 touch-manipulation interactive-scale"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mt-2 lg:mt-0 drop-shadow-2xl tracking-wide">
                Welcome back, {user?.firstName || user?.username || 'User'}!
              </h1>
              <p className="text-gray-300 mt-2">Explore your intelligent workspace</p>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-500/20 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 px-4 sm:px-6 py-4 w-full sm:w-auto lg:min-w-[280px]">
              <div className="text-center space-y-3">
                <div>
                  <p className="text-sm text-purple-400/70">Current Time</p>
                  <p className="text-lg font-bold text-white" data-testid="current-time">{clockTime}</p>
                  <p className="text-sm text-gray-400">{formattedDate}</p>
                </div>
                <div className="border-t border-purple-500/20 pt-3">
                  <p className="text-sm text-purple-400/70">Session Time</p>
                  <p className="text-xl font-bold text-white" data-testid="session-time">{formattedTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="relative z-10 p-3 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Stats Cards Row */}
          <div ref={statsCardsRef} className="grid-premium gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Quick Stats */}
            <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 p-5 sm:p-6 lg:p-8 stats-card">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-purple-400/70">Total Messages</p>
                  <p className="text-2xl lg:text-4xl font-bold text-white stats-number">247</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                    <span className="text-sm text-purple-400">+12 today</span>
                  </div>
                </div>
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <i className="fas fa-comment text-white text-xl lg:text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 p-5 sm:p-6 lg:p-8 stats-card">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-purple-400/70">Conversations</p>
                  <p className="text-2xl lg:text-4xl font-bold text-white stats-number">18</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(147,51,234,0.6)]"></div>
                    <span className="text-sm text-purple-600">3 active</span>
                  </div>
                </div>
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                  <i className="fas fa-comments text-white text-xl lg:text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 p-5 sm:p-6 lg:p-8 stats-card">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-purple-400/70">Active Time</p>
                  <p className="text-2xl lg:text-4xl font-bold text-white stats-number">4h 32m</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-700 rounded-full animate-pulse shadow-[0_0_8px_rgba(109,40,217,0.6)]"></div>
                    <span className="text-sm text-purple-700">This session</span>
                  </div>
                </div>
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-700 to-purple-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(109,40,217,0.4)]">
                  <i className="fas fa-clock text-white text-xl lg:text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts Row */}
          <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
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
              color="#9333ea"
            />
          </div>

          {/* Action Cards Row */}
          <div ref={actionCardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Chat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative h-[16em] sm:h-[18em] w-full border-2 border-purple-500/40 rounded-[1.5em] bg-gradient-to-br from-[#1a1a1a] via-[#0c0c0c]/80 to-[#1a1a1a]/20 text-white p-[1em] sm:p-[1.5em] flex justify-center items-left flex-col gap-[0.8em] sm:gap-[1em] backdrop-blur-[12px] hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group/card hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <h1 className="text-[1.8em] sm:text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-400 to-purple-500 bg-clip-text text-transparent">
                  Chat
                </h1>
                <p className="text-[0.9em] text-gray-300/90 leading-relaxed font-light">
                  Experience intelligent conversations with advanced technology. Start your journey into seamless communication and discover powerful response capabilities.
                </p>
              </div>

              <button
                onClick={handleStartChat}
                className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-500/40 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-500/10"
                data-testid="start-chat-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-purple-600/40 to-purple-500/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
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

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </motion.div>

            {/* Premium Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[18em] w-full border-2 border-purple-600/40 rounded-[1.5em] bg-gradient-to-br from-[#1a1a1a] via-[#0c0c0c]/80 to-[#1a1a1a]/20 text-white p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 group/card hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-700/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <h1 className="text-[1.8em] sm:text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Premium
                </h1>
                <p className="text-[0.9em] text-gray-300/90 leading-relaxed font-light">
                  Unlock unlimited potential with premium features. Enhanced capabilities, priority support, and exclusive tools await your exploration.
                </p>
              </div>

              <button
                onClick={() => setLocation('/pricing')}
                className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-600/40 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-600/60 hover:shadow-lg hover:shadow-purple-600/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-600/10"
                data-testid="pricing-btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-purple-700/40 to-purple-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
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

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}