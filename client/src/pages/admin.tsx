import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminOverview from "@/components/admin/admin-overview";
import AdminUsers from "@/components/admin/admin-users";
import AdminEnv from "@/components/admin/admin-env";
import { apiRequest } from "@/lib/api";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [activePanel, setActivePanel] = useState("overview");
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError("Admin key is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminKey }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        localStorage.setItem('admin-token', adminKey);
      } else {
        setError("Invalid admin key");
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation('/chat');
  };

  useEffect(() => {
    // Check if admin is already authenticated
    const savedToken = localStorage.getItem('admin-token');
    if (savedToken) {
      setAdminKey(savedToken);
      setIsAuthenticated(true);
      setShowLoginModal(false);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLoginModal(true);
    setAdminKey("");
    localStorage.removeItem('admin-token');
    setLocation('/chat');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Dialog open={showLoginModal} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-flamingo-100 dark:bg-flamingo-900/30 rounded-full flex items-center justify-center">
                  <i className="fas fa-shield-alt text-flamingo-600 dark:text-flamingo-400 text-2xl"></i>
                </div>
                <DialogTitle className="text-2xl font-bold">Admin Access</DialogTitle>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Enter your admin key to continue
                </p>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Key
                </label>
                <Input
                  data-testid="admin-key-input"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter ADMIN_KEY"
                  className="w-full"
                />
              </div>
              
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  data-testid="admin-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700"
                >
                  {isLoading ? "Verifying..." : "Login"}
                </Button>
                <Button
                  data-testid="admin-login-cancel"
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-flamingo-400 to-flamingo-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Flamgio AI</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                data-testid="back-to-chat-btn"
                variant="ghost"
                onClick={() => setLocation('/chat')}
                className="text-gray-600 dark:text-gray-400"
              >
                <i className="fas fa-comments mr-2"></i>
                Back to Chat
              </Button>
              <Button
                data-testid="admin-logout-btn"
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Admin Sidebar */}
        <AdminSidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        
        {/* Admin Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'overview' && <AdminOverview />}
          {activePanel === 'users' && <AdminUsers />}
          {activePanel === 'env' && <AdminEnv />}
        </div>
      </div>
    </div>
  );
}
