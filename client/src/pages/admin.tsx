
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import "../styles/new-theme-toggle.css";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }

    // Check if user is admin (updated to use the correct admin email)
    if (user.role !== 'admin') {
      setLocation('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [user, setLocation]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <button
                  onClick={() => setLocation('/dashboard')}
                  className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  Flamingo - Admin Panel
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="toggle-cont-small">
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
              <Button
                variant="ghost"
                onClick={() => setLocation('/dashboard')}
                className="text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                data-testid="button-back"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 dark:from-slate-200 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
                Admin Control Center
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Comprehensive platform management and analytics
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl text-white shadow-lg">
              <i className="fas fa-shield-alt text-2xl"></i>
              <div>
                <div className="text-sm opacity-80">Admin Level</div>
                <div className="font-bold">Full Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm">Total Users</div>
                <div className="text-3xl font-bold">1,247</div>
                <div className="text-blue-200 text-sm">+12% this month</div>
              </div>
              <i className="fas fa-users text-3xl text-blue-200"></i>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-100 text-sm">Active Sessions</div>
                <div className="text-3xl font-bold">389</div>
                <div className="text-green-200 text-sm">Live now</div>
              </div>
              <i className="fas fa-chart-line text-3xl text-green-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm">Messages Today</div>
                <div className="text-3xl font-bold">15.2K</div>
                <div className="text-purple-200 text-sm">+8% vs yesterday</div>
              </div>
              <i className="fas fa-comments text-3xl text-purple-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-100 text-sm">System Health</div>
                <div className="text-3xl font-bold">98.7%</div>
                <div className="text-orange-200 text-sm">Excellent</div>
              </div>
              <i className="fas fa-heartbeat text-3xl text-orange-200"></i>
            </div>
          </div>
        </div>

        {/* Main Admin Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Management Panel */}
          <Card className="shadow-xl border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users-cog text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">User Management</CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <i className="fas fa-user-plus mr-2"></i>
                  Add User
                </Button>
                <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                  <i className="fas fa-list mr-2"></i>
                  View All
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">Recent Activity</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>New registrations</span>
                    <span className="font-semibold">23 today</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Premium upgrades</span>
                    <span className="font-semibold">5 today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration Panel */}
          <Card className="shadow-xl border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cogs text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">System Configuration</CardTitle>
                  <CardDescription>Configure platform settings and features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <i className="fas fa-database mr-2"></i>
                  Database
                </Button>
                <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                  <i className="fas fa-server mr-2"></i>
                  Servers
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">System Status</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span className="font-semibold text-green-600">123ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Database Load</span>
                    <span className="font-semibold text-blue-600">45%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Panel */}
          <Card className="lg:col-span-2 shadow-xl border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-bar text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">Platform Analytics</CardTitle>
                    <CardDescription>Real-time usage metrics and insights</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <i className="fas fa-download mr-2"></i>
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-chart-area text-4xl text-slate-400 mb-4"></i>
                  <div className="text-slate-600 dark:text-slate-400">Advanced Analytics Dashboard</div>
                  <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">Real-time metrics and reporting</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="shadow-xl border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-bolt text-red-600 dark:text-red-400"></i>
                </div>
                <div>
                  <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">Quick Actions</CardTitle>
                  <CardDescription>Administrative shortcuts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white justify-start">
                <i className="fas fa-broadcast-tower mr-3"></i>
                Send Announcement
              </Button>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white justify-start">
                <i className="fas fa-exclamation-triangle mr-3"></i>
                System Maintenance
              </Button>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-start">
                <i className="fas fa-backup mr-3"></i>
                Create Backup
              </Button>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white justify-start">
                <i className="fas fa-file-export mr-3"></i>
                Export Data
              </Button>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white justify-start">
                <i className="fas fa-power-off mr-3"></i>
                Emergency Stop
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
