import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import SuccessPopup from "@/components/success-popup";
import "../styles/auth.css";
import "../styles/theme-toggle.css";

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
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1500);
      }
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
            <label className="switch">
              <input type="checkbox" id="input" onChange={handleThemeToggle} />
              <span className="slider round">
                <div className="sun-moon">
                  <div className="stars">
                    <svg className="star" id="star-1" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="star" id="star-2" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="star" id="star-3" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="moon-dot" id="moon-dot-1"></div>
                  <div className="moon-dot" id="moon-dot-2"></div>
                  <div className="moon-dot" id="moon-dot-3"></div>
                </div>
              </span>
            </label>
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
        <div className="login-box">
          <div className="form">
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
          </div>
        </div>
      </div>
    </div>
  );
}