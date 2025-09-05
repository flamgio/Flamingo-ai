import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import SuccessPopup from "@/components/success-popup";
import { motion } from "framer-motion";
import { ParallaxPageWrapper, ParallaxAnimation } from "@/components/parallax-animation";
import "../styles/auth.css";
import "../styles/new-theme-toggle.css";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, isLoginLoading, loginError } = useAuth();

  useEffect(() => {
    const theme = localStorage.getItem('flamgio-theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const checkbox = document.querySelector('.toggle-input') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = document.documentElement.classList.contains('dark');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      if (result) {
        setShowSuccess(true);
        // Shorter delay for faster redirect
        setTimeout(() => {
          setLocation('/dashboard');
        }, 800);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flamgio-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flamgio-theme', 'dark');
    }
  };

  return (
    <ParallaxPageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/30 to-black relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccess} 
        message="Welcome back! Successfully logged in."
        onComplete={() => {
          setShowSuccess(false);
          setLocation('/dashboard');
        }} 
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <button
              onClick={() => setLocation('/')}
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Flamingo AI
            </button>
            <div className="flex items-center space-x-1 ml-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Running</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="toggle-cont-small">
              <input type="checkbox" className="toggle-input" onChange={handleThemeToggle} />
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
            <button
              onClick={() => setLocation('/')}
              className="text-white/70 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <motion.div 
          className="login-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Logo */}
            <div className="logo">
              <div className="user"></div>
            </div>
            
            {/* Header */}
            <div className="header">
              Welcome Back
            </div>
            <div className="subtitle">
              Sign in to continue your AI journey
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="input"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email}</p>
              )}
              
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="input"
                required
              />
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="button sign-in"
              >
                {isLoginLoading ? "Signing In..." : "Sign In"}
              </button>

              {/* Error Message */}
              {loginError && (
                <div className="text-red-400 text-xs text-center">
                  {loginError.message || loginError}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="footer">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation('/signup');
                }}
                className="link"
              >
                Join Flamingo AI
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </ParallaxPageWrapper>
  );
}