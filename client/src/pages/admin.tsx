
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }

    // Check if user is admin
    if (user.email !== 'admin@flamgio.ai') {
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
            <Button onClick={() => setLocation('/dashboard')} className="w-full">
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
                  <span className="text-black text-lg filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔥</span>
                </div>
                <button
                  onClick={() => setLocation('/dashboard')}
                  className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  Flamgio AI - Admin
                </button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/30"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-300">
            Manage your Flamgio AI platform
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
