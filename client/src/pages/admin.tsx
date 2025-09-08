
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
      <nav className="bg-white/95 dark:bg-blue-900/95 backdrop-blur-md border-b border-blue-200 dark:border-blue-700 shadow-sm">
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
                  Flamingo AI - Admin
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-300">
            Manage your Flamingo AI platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Coming Soon</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">System Stats</CardTitle>
              <CardDescription>Monitor platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Coming Soon</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Model Configuration</CardTitle>
              <CardDescription>Configure AI models and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Coming Soon</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
