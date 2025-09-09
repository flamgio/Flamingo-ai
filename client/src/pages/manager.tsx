import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ui/theme-provider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Shield,
  Activity,
  Database,
  LogOut,
  Moon,
  Sun,
  BarChart3,
  Menu,
  X,
  Globe,
  Clock
} from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ManagerStats {
  activeUsers: number;
  conversations: number;
  monthlyGrowth: number;
  systemHealth: number;
  totalMessages: number;
  avgResponseTime: number;
}

export default function Manager() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [managerStats, setManagerStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated or not a manager/admin
  useEffect(() => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
      setLocation('/login');
      return;
    }
    
    fetchManagerData();
  }, [user, setLocation]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with real API calls
      setManagerStats({
        activeUsers: 127,
        conversations: 2345,
        monthlyGrowth: 24,
        systemHealth: 98.5,
        totalMessages: 15678,
        avgResponseTime: 1.2
      });
      
    } catch (error) {
      console.error('Failed to fetch manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Premium GSAP animations
  useGSAP(() => {
    if (!containerRef.current || loading || !user) return;

    const tl = gsap.timeline({ delay: 0.1 });

    // Header slide down
    tl.fromTo(headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    
    // Stats cards staggered entrance
    .fromTo(statsRef.current?.children || [],
      { opacity: 0, y: 60, scale: 0.8, rotationY: -15 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    )
    
    // Content slide in
    .fromTo(contentRef.current?.children || [],
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      },
      "-=0.6"
    );

    // Add hover animations to stats cards
    const statsCards = statsRef.current?.children;
    if (statsCards) {
      Array.from(statsCards).forEach((card) => {
        const element = card as HTMLElement;
        
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            y: -8,
            scale: 1.05,
            boxShadow: "0 25px 50px rgba(251, 146, 60, 0.3)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(251, 146, 60, 0)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }
  }, [loading, user]);

  if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Manager Panel...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Active Users", value: managerStats?.activeUsers?.toString() || "127", icon: Users, change: "+12%", color: "from-blue-600 to-cyan-600" },
    { title: "Conversations", value: managerStats?.conversations?.toString() || "2,345", icon: MessageSquare, change: "+8%", color: "from-green-600 to-emerald-600" },
    { title: "Monthly Growth", value: `${managerStats?.monthlyGrowth || 24}%`, icon: TrendingUp, change: "+3%", color: "from-purple-600 to-pink-600" },
    { title: "System Health", value: `${managerStats?.systemHealth || 98.5}%`, icon: Activity, change: "+0.2%", color: "from-orange-600 to-red-600" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      {/* Header */}
      <header ref={headerRef} className="bg-black/40 backdrop-blur-xl border-b border-orange-500/20 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 flex-1">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Flamingo Manager</span>
                  <span className="sm:hidden">Manager</span>
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-orange-600/20 text-orange-300 border-orange-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Manager Portal
              </Badge>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-white hover:bg-orange-600/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Desktop Controls */}
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-orange-200 hover:bg-orange-600/20 hover:text-white"
                  data-testid="button-theme-toggle"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-orange-200 hidden lg:inline">
                    {user.firstName} {user.lastName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-orange-200 border-orange-500/30 hover:bg-orange-600/20 hover:text-white"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden lg:inline">Logout</span>
                    <span className="lg:hidden">Exit</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-orange-500/20 py-3">
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-orange-200 px-3 py-1">
                  {user.firstName} {user.lastName}
                </div>
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="text-orange-200 hover:bg-orange-600/20 justify-start"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  Toggle Theme
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-orange-200 hover:bg-orange-600/20 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Manager Dashboard
          </h2>
          <p className="text-orange-200">
            Monitor team performance and manage user operations
          </p>
        </div>

        {/* Stats Cards - Mobile First Responsive */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} data-testid={`card-stat-${index}`} className={`bg-gradient-to-br ${stat.color}/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-white/70 mb-1 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-white/80 flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs - Mobile Responsive */}
        <div ref={contentRef}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-4 w-full min-w-[400px] bg-black/40 backdrop-blur-xl border border-orange-500/20">
                <TabsTrigger value="overview" data-testid="tab-overview" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="users" data-testid="tab-users" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="analytics" data-testid="tab-analytics" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Config</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Enhanced Stats */}
                <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Activity className="w-5 h-5 mr-2 text-orange-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { action: "New user registration", user: "john@example.com", time: "5 mins ago" },
                        { action: "Conversation completed", user: "sarah@example.com", time: "12 mins ago" },
                        { action: "Premium upgrade", user: "mike@example.com", time: "1 hour ago" },
                        { action: "Support ticket resolved", user: "lisa@example.com", time: "2 hours ago" },
                      ].map((activity, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-orange-500/20 last:border-0 gap-1 sm:gap-0" data-testid={`activity-${index}`}>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {activity.action}
                            </p>
                            <p className="text-xs text-orange-200">
                              {activity.user}
                            </p>
                          </div>
                          <span className="text-xs text-orange-300 self-start sm:self-center">
                            {activity.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Clock className="w-5 h-5 mr-2 text-orange-400" />
                        Response Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200 text-sm">Average Response</span>
                          <span className="text-white font-bold">{managerStats?.avgResponseTime || 1.2}s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200 text-sm">Total Messages</span>
                          <span className="text-white font-bold">{managerStats?.totalMessages || 15678}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Globe className="w-5 h-5 mr-2 text-orange-400" />
                        Platform Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200 text-sm">Server Uptime</span>
                          <span className="text-green-400 font-bold">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-200 text-sm">API Status</span>
                          <span className="text-green-400 font-bold">Healthy</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-200 mb-4 text-sm sm:text-base">
                    Manage user accounts and permissions (Manager-level access)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">View All Users</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">User Analytics</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Export Data</Button>
                  </div>
                  <div className="bg-orange-900/20 border border-orange-500/30 p-3 sm:p-4 rounded-lg">
                    <p className="text-orange-200 text-xs sm:text-sm">
                      Manager role allows viewing and basic user management. Contact admin for advanced permissions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-200 mb-4 text-sm sm:text-base">
                    View team performance metrics and user engagement data
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-orange-300 mb-2">Engagement Rate</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white">87.3%</p>
                    </div>
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-orange-300 mb-2">Conversion Rate</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white">12.8%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="bg-black/60 backdrop-blur-xl border border-orange-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Manager Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-200 mb-4 text-sm sm:text-base">
                    Configure manager-level preferences and team settings
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">Notification Settings</Button>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">Team Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}