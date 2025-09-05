import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import SuccessPopup from "@/components/success-popup";
import { motion } from "framer-motion";
import { ParallaxPageWrapper, ParallaxAnimation } from "@/components/parallax-animation";
import "../styles/auth.css";
import "../styles/new-theme-toggle.css";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<string[]>([]);

  const { signup, isSignupLoading, signupError } = useAuth();
  const { toggleTheme, theme } = useTheme();

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
    const newErrors: string[] = [];

    if (!formData.firstName.trim()) newErrors.push("First name is required");
    if (!formData.lastName.trim()) newErrors.push("Last name is required");
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.email.includes('@')) newErrors.push("Please enter a valid email");
    if (formData.password.length < 6) newErrors.push("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) newErrors.push("Passwords do not match");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await signup({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
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
      console.error('Signup error:', error);
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
        message="Account created successfully! Welcome to Flamingo AI."
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
      <div className="container" style={{ '--form-width': '350px', '--aspect-ratio': '1.4' } as any}>
        <div className="login-box">
          <div className="form">
            {/* Logo */}
            <div className="logo">
              <div className="user"></div>
            </div>
            
            {/* Header */}
            <div className="header">
              Join Flamingo AI
            </div>
            <div className="subtitle">
              Create your account and start your AI journey
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="w-full space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="input flex-1"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="input flex-1"
                  required
                />
              </div>
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="input"
                required
              />
              
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password (min 6 characters)"
                className="input"
                required
              />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="input"
                required
              />

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-400 text-xs">{error}</p>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSignupLoading}
                className="button sign-in"
              >
                {isSignupLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Server Error */}
              {signupError && (
                <div className="text-red-400 text-xs text-center">
                  {signupError.message || signupError}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="footer">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation('/login');
                }}
                className="link"
              >
                Sign in here
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ParallaxPageWrapper>
  );
}