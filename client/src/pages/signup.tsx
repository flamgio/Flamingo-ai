import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SuccessPopup from "@/components/success-popup";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('flamgio-theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSignup = async () => {
    try {
      // Show success popup first
      setShowSuccess(true);
      
      // Redirect to login endpoint after a short delay
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'flamgio-theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccess} 
        onComplete={() => {
          setShowSuccess(false);
          setLocation('/dashboard');
        }} 
      />

      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                    <span className="text-white font-bold text-sm">FA</span>
                  </div>
                  <button
                    onClick={() => setLocation('/')}
                    className="text-xl font-bold text-gray-900 dark:text-white hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors"
                  >
                    Flamgio AI
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleThemeToggle}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  🌙
                </button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/')}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 space-y-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl"
              >
                <span className="text-white font-bold text-xl" style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)'
                }}>
                  FA
                </span>
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Join Flamgio AI
              </h2>
              <p className="text-gray-400">
                Create your account and start your AI journey
              </p>
            </div>

            <div className="space-y-6">
              <Button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-signup"
              >
                Sign Up with Replit
              </Button>

              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setLocation('/login')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}