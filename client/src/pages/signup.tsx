import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import SuccessPopup from "@/components/success-popup";
import "../styles/auth.css";
import "../styles/theme-toggle.css";

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
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1500);
      }
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
  );
}