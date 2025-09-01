
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import SuccessPopup from "@/components/success-popup";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<string[]>([]);

  const { login, isLoginLoading, loginError } = useAuth();

  useEffect(() => {
    const theme = localStorage.getItem('flamgio-theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.email.includes('@')) newErrors.push("Please enter a valid email");
    if (!formData.password) newErrors.push("Password is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Login error:', error);
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
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to continue your AI journey
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">{error}</p>
                  ))}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-login"
              >
                {isLoginLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </>
                )}
              </Button>

              {/* Server Error */}
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{loginError.message}</p>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setLocation('/signup')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
