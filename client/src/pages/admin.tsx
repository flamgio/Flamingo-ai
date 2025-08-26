import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import AdminAuthModal from "@/components/admin/admin-auth-modal";

import AdminOverview from "@/components/admin/admin-overview";
import AdminUsers from "@/components/admin/admin-users";
import AdminEnv from "@/components/admin/admin-env";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAdminAuthenticated, isChecking, logout } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isChecking && !isAdminAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isChecking, isAdminAuthenticated]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.location.reload(); // Refresh to update auth state
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
    setLocation("/chat");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
            <i className="fas fa-spinner fa-spin text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-red-200 dark:border-red-800 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                This area is restricted to authorized administrators only.
              </p>
              <Button 
                onClick={() => setLocation("/chat")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Return to Chat
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <AdminAuthModal
          isOpen={showAuthModal}
          onClose={() => setLocation("/chat")}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Admin Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-blue-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold font-mono">FA</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/chat")}
                className="text-blue-600 dark:text-blue-400 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <i className="fas fa-comments mr-2"></i>
                Chat
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Administration
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your Flamgio AI platform
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <TabsTrigger 
              value="overview" 
              className="font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <i className="fas fa-users mr-2"></i>
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="environment" 
              className="font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <i className="fas fa-cogs mr-2"></i>
              Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <AdminEnv />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}