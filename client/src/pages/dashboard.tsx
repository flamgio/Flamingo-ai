import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PricingSection from "@/components/pricing-section";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleStartChat = () => {
    setLocation('/chat');
  };

  const handleAdminAccess = () => {
    setLocation('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 transition-all duration-300">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-blue-900/95 backdrop-blur-md border-b border-blue-200 dark:border-blue-700 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                  <span className="text-black text-lg filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔥</span>
                </div>
                <button
                  onClick={() => setLocation('/')}
                  className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  Flamgio AI
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                Welcome, {user.firstName}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/30"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              Welcome to Flamgio AI Dashboard
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-300 max-w-3xl mx-auto">
              Your privacy-first AI chat platform with intelligent model routing.
              Start chatting with our advanced AI models or manage your account.
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-800/30" onClick={handleStartChat}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <i className="fas fa-comments text-white text-xl"></i>
                  </div>
                  <CardTitle className="text-blue-800 dark:text-blue-200">Start Chatting</CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-300">
                    Begin a conversation with our intelligent AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-500 dark:text-blue-400">
                    Access local Hugging Face models and cloud-based OpenRouter models with automatic routing
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Panel - Only show for admin users */}
            {user?.email === 'admin@flamgio.ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-800/30" onClick={handleAdminAccess}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4 shadow-md">
                      <i className="fas fa-shield-alt text-white text-xl"></i>
                    </div>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Admin Panel</CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-300">
                      Access administrative features and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-500 dark:text-blue-400">
                      Manage users, monitor system performance, and configure AI models
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Additional feature card for non-admin users */}
            {user?.email !== 'admin@flamgio.ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4 shadow-md">
                      <i className="fas fa-cog text-white text-xl"></i>
                    </div>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Settings</CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-300">
                      Customize your chat experience and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-500 dark:text-blue-400">
                      Manage your profile, notifications, and model preferences
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-blue-800 dark:text-blue-200">Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <i className="fas fa-shield-alt text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Privacy First</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Your conversations stay private with local model options</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <i className="fas fa-route text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Smart Routing</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Automatically selects the best AI model for your query</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <i className="fas fa-history text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Persistent Memory</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Conversations are saved and context maintained</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <i className="fas fa-mobile-alt text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Mobile Responsive</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Works seamlessly on all devices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pricing Section */}
        <PricingSection />
      </div>
    </div>
  );
}