import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useState } from "react";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    setLocation('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 dark:from-indigo-900 dark:via-purple-800 dark:to-blue-900 overflow-hidden relative">
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-hidden relative">
        {/* Modern Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-50/20 to-indigo-50/30 dark:from-indigo-900/50 dark:via-purple-800/10 dark:to-blue-900/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-500/5 rounded-full blur-2xl animate-bounce"></div>
        </div>

        {/* Modern Header */}
        <div className="relative z-10 p-6 border-b border-white/20 dark:border-purple-500/20 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-white dark:via-purple-100 dark:to-purple-200 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-purple-100/70 mt-1">Manage your account preferences</p>
            </div>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="back-to-dashboard"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="relative z-10 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-purple-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-gray-800/30"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <i className="fas fa-user mr-3 text-purple-500 dark:text-purple-300"></i>
                Account Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Username</label>
                    <input 
                      type="text" 
                      value={user?.username || 'User'}
                      className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || 'user@example.com'}
                      className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Member Since</label>
                    <input 
                      type="text" 
                      value="January 2024"
                      className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Plan Type</label>
                    <input 
                      type="text" 
                      value="Free Plan"
                      className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-purple-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-gray-800/30"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <i className="fas fa-palette mr-3 text-purple-500 dark:text-purple-300"></i>
                Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dark Mode</h3>
                    <p className="text-gray-600 dark:text-purple-200/70 text-sm">Toggle between light and dark themes</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative w-16 h-8 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                    data-testid="theme-toggle-settings"
                  >
                    <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                      theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    <p className="text-gray-600 dark:text-purple-200/70 text-sm">Receive updates and announcements</p>
                  </div>
                  <button className="relative w-16 h-8 rounded-full bg-purple-600">
                    <div className="absolute w-6 h-6 bg-white rounded-full top-1 translate-x-9"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Auto-save Chats</h3>
                    <p className="text-gray-600 dark:text-purple-200/70 text-sm">Automatically save chat conversations</p>
                  </div>
                  <button className="relative w-16 h-8 rounded-full bg-purple-600">
                    <div className="absolute w-6 h-6 bg-white rounded-full top-1 translate-x-9"></div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* AI Assistant Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-purple-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-gray-800/30"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <i className="fas fa-brain mr-3 text-purple-500 dark:text-purple-300"></i>
                AI Assistant Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Response Style</label>
                  <select className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm">
                    <option value="balanced">Balanced (Recommended)</option>
                    <option value="creative">Creative</option>
                    <option value="precise">Precise</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-600 dark:text-purple-200/70 text-sm font-medium mb-2">Max Response Length</label>
                  <select className="w-full px-4 py-2 bg-white/50 dark:bg-purple-900/30 border border-gray-300/50 dark:border-purple-400/30 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm">
                    <option value="medium">Medium (Recommended)</option>
                    <option value="short">Short (up to 150 words)</option>
                    <option value="long">Long (up to 500 words)</option>
                  </select>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:bg-purple-900/20 border border-purple-300/50 dark:border-purple-400/20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-gray-700 dark:text-purple-200/80 text-sm">
                    <i className="fas fa-magic mr-2 text-purple-500 dark:text-purple-300"></i>
                    Flamingo AI automatically selects the best model for your conversations using our intelligent routing system.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-600/20 dark:to-red-800/20 backdrop-blur-xl border border-red-300/50 dark:border-red-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-red-700 dark:text-white mb-6 flex items-center">
                <i className="fas fa-exclamation-triangle mr-3 text-red-500 dark:text-red-300"></i>
                Danger Zone
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-white">Clear All Chat History</h3>
                    <p className="text-red-600 dark:text-red-200/70 text-sm">This will permanently delete all your conversations</p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Clear History
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-white">Delete Account</h3>
                    <p className="text-red-600 dark:text-red-200/70 text-sm">Permanently delete your account and all data</p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end"
            >
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="save-settings"
              >
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}