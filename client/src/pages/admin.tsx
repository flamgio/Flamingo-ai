import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { apiRequest } from "@/lib/queryClient";
import { Moon, Sun, Database, Users, Settings, Shield, BarChart, Globe, Menu, X } from "lucide-react";
import "../styles/new-theme-toggle.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Types for admin data
interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  totalMessages: number;
  systemHealth: number;
  premiumUsers: number;
  dailyActiveUsers: number;
}

interface EnvVariable {
  key: string;
  value: string;
  isSecret: boolean;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [envVars, setEnvVars] = useState<EnvVariable[]>([]);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (user.role !== 'admin') {
      setLocation('/dashboard');
      return;
    }

    setIsAuthorized(true);
    fetchAdminData();
  }, [user, setLocation]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with real API calls
      setAdminStats({
        totalUsers: 1247,
        activeSessions: 389,
        totalMessages: 15200,
        systemHealth: 98.7,
        premiumUsers: 156,
        dailyActiveUsers: 234
      });
      
      setEnvVars([
        { key: 'NODE_ENV', value: 'development', isSecret: false },
        { key: 'DATABASE_URL', value: '***hidden***', isSecret: true },
        { key: 'OPENROUTER_API_KEY', value: '***hidden***', isSecret: true },
        { key: 'PORT', value: '5000', isSecret: false }
      ]);

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Premium GSAP animations
  useGSAP(() => {
    if (!isAuthorized || !containerRef.current || loading) return;

    const tl = gsap.timeline({ delay: 0.1 });

    // Header slide down
    tl.fromTo(headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    
    // Stats cards staggered entrance
    .fromTo(statsRef.current?.children || [],
      { opacity: 0, y: 60, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "backOut"
      },
      "-=0.4"
    )
    
    // Panels slide in
    .fromTo(panelsRef.current?.children || [],
      { opacity: 0, x: -80, rotationY: -10 },
      { 
        opacity: 1, 
        x: 0, 
        rotationY: 0,
        duration: 1,
        stagger: 0.15,
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
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }
  }, [isAuthorized, loading]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/dashboard')} className="w-full" data-testid="button-return-dashboard">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <nav ref={headerRef} className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <button
                  onClick={() => setLocation('/dashboard')}
                  className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                >
                  <span className="hidden sm:inline">Flamingo - Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-white hover:bg-purple-600/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              {/* Desktop Theme Toggle */}
              <div className="hidden sm:block toggle-cont-small">
                <input 
                  type="checkbox" 
                  className="toggle-input" 
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  data-testid="theme-toggle"
                />
                <label className="toggle-label-small">
                  <div className="cont-icon">
                    <div className="sparkle" style={{"--deg": "45", "--duration": "3"} as React.CSSProperties}></div>
                    <div className="sparkle" style={{"--deg": "90", "--duration": "3"} as React.CSSProperties}></div>
                    <div className="sparkle" style={{"--deg": "135", "--duration": "3"} as React.CSSProperties}></div>
                    <div className="sparkle" style={{"--deg": "180", "--duration": "3"} as React.CSSProperties}></div>
                    <svg className="icon" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                    </svg>
                  </div>
                </label>
              </div>
              
              {/* Desktop Back Button */}
              <Button
                variant="ghost"
                onClick={() => setLocation('/dashboard')}
                className="hidden sm:flex text-purple-200 hover:bg-purple-600/20 hover:text-white"
                data-testid="button-back"
              >
                <span className="mr-2">←</span>
                <span className="hidden lg:inline">Back to Dashboard</span>
                <span className="lg:hidden">Back</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-purple-500/20 py-3">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="text-purple-200 hover:bg-purple-600/20 justify-start"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  Toggle Theme
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/dashboard')}
                  className="text-purple-200 hover:bg-purple-600/20 justify-start"
                >
                  <span className="mr-2">←</span>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Admin Header */}
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                Admin Control Center
              </h1>
              <p className="text-gray-300 text-base sm:text-lg">
                Comprehensive platform management and analytics
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 rounded-xl text-white shadow-lg">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <div className="text-xs sm:text-sm opacity-80">Admin Level</div>
                <div className="font-bold text-sm sm:text-base">Full Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview - Responsive Grid */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-600/80 to-cyan-600/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-blue-400/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-200 text-xs sm:text-sm font-medium">Total Users</div>
                <div className="text-2xl sm:text-4xl font-bold text-white">{adminStats?.totalUsers || 0}</div>
                <div className="text-blue-300 text-xs sm:text-sm flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active Platform
                </div>
              </div>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/80 to-emerald-600/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-green-400/20 shadow-2xl hover:shadow-green-500/25 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-200 text-xs sm:text-sm font-medium">Premium Users</div>
                <div className="text-2xl sm:text-4xl font-bold text-white">{adminStats?.premiumUsers || 0}</div>
                <div className="text-green-300 text-xs sm:text-sm flex items-center mt-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                  Subscribed
                </div>
              </div>
              <BarChart className="w-8 h-8 sm:w-12 sm:h-12 text-green-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-400/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-200 text-xs sm:text-sm font-medium">Total Messages</div>
                <div className="text-2xl sm:text-4xl font-bold text-white">{adminStats?.totalMessages || 0}</div>
                <div className="text-purple-300 text-xs sm:text-sm flex items-center mt-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  All Conversations
                </div>
              </div>
              <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-purple-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/80 to-red-600/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-orange-400/20 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-200 text-xs sm:text-sm font-medium">System Health</div>
                <div className="text-2xl sm:text-4xl font-bold text-white">{adminStats?.systemHealth || 98.7}%</div>
                <div className="text-orange-300 text-xs sm:text-sm flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Excellent
                </div>
              </div>
              <Database className="w-8 h-8 sm:w-12 sm:h-12 text-orange-300" />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex overflow-x-auto gap-2 bg-black/40 backdrop-blur-xl rounded-2xl p-2 border border-purple-500/20">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'env', label: 'Environment', icon: Settings },
              { id: 'database', label: 'Database', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content - Responsive */}
        <div ref={panelsRef}>
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-purple-500/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-purple-600/20 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">Daily Active Users</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{adminStats?.dailyActiveUsers || 234}</p>
                  </div>
                  <div className="bg-pink-600/20 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-pink-300 mb-2">Active Sessions</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{adminStats?.activeSessions || 389}</p>
                  </div>
                  <div className="bg-cyan-600/20 rounded-xl p-4 sm:p-6 md:col-span-2 lg:col-span-1">
                    <h3 className="text-base sm:text-lg font-semibold text-cyan-300 mb-2">Server Uptime</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">99.9%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-purple-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Environment Variables</h2>
              <div className="space-y-3 sm:space-y-4">
                {envVars.map((env, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <code className="text-purple-400 font-mono text-sm sm:text-base">{env.key}</code>
                    </div>
                    <div className="flex-1">
                      <code className="text-gray-300 font-mono text-sm sm:text-base break-all">
                        {env.isSecret ? '***hidden***' : env.value}
                      </code>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                      {env.isSecret && (
                        <Button size="sm" variant="outline" className="text-xs">Show</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-purple-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">User Management</h2>
              <p className="text-gray-300 mb-4">Comprehensive user administration and analytics.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">View All Users</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Add New User</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Export Data</Button>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-purple-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Database Management</h2>
              <p className="text-gray-300 mb-4">Monitor and manage database operations.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Backup DB</Button>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">View Logs</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Optimize</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Analytics</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}