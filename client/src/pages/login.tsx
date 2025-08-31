/** HUMAN-CRAFTED LOGIN PAGE - Original UI design by human developer */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, login, loginError, isLoginLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if already authenticated (use useEffect to avoid render issues)
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setLocation('/chat');
      }, 1500);
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMessage });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
                  <span className="text-white text-lg filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔥</span>
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
                <i className="fas fa-moon dark:hidden"></i>
                <i className="fas fa-sun hidden dark:inline"></i>
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

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 2
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-400"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-check text-white text-lg"></i>
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">Welcome Back! 🎉</h3>
                  <p className="text-green-100 text-sm">Login successful - redirecting...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-16 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your Flamgio AI account
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {(errors.submit || loginError) && (
                  <div className="text-red-500 text-sm text-center">
                    {errors.submit || (loginError as any)?.response?.data?.message || 'Login failed'}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-sign-in-alt mr-2"></i>
                  )}
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setLocation('/signup')}
                    className="text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-500 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Popup - Human crafted animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm mx-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Here you go!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome to Flamingo AI
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}