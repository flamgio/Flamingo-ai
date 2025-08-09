import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">FA</span>
                </div>
                <button 
                  onClick={() => setLocation('/')}
                  className="text-xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Flamgio AI
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.firstName}
              </span>
              <Button
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Flamgio AI Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your privacy-first AI chat platform with intelligent model routing. 
              Start chatting with our advanced AI models or manage your account.
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={handleStartChat}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-comments text-white text-xl"></i>
                  </div>
                  <CardTitle>Start Chatting</CardTitle>
                  <CardDescription>
                    Begin a conversation with our intelligent AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access local Hugging Face models and cloud-based OpenRouter models with automatic routing
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={handleAdminAccess}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-shield-alt text-white text-xl"></i>
                  </div>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>
                    Access administrative features and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage users, monitor system performance, and configure AI models
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-chart-line text-white text-xl"></i>
                  </div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View your chat history and usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track your interactions, model usage, and conversation insights
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-shield-alt text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Your conversations stay private with local model options</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-route text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Smart Routing</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically selects the best AI model for your query</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-history text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Persistent Memory</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Conversations are saved and context maintained</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-mobile-alt text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Responsive</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Works seamlessly on all devices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
