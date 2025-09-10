import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  useEffect(() => {
    // Show intro animation for 10 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/30 to-indigo-600/20 animate-pulse"></div>
          
          {/* Floating Particles */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
          
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-70"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full blur-xl opacity-60"
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-white">
                  Welcome To
                </span>
                <br />
                <span className="text-white">
                  Flamingo AI
                </span>
              </h1>
            </motion.div>

            {/* Subtitle Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5, duration: 2, ease: "easeOut" }}
            >
              <p className="text-2xl md:text-4xl font-semibold text-white">
                The Evolution of AI Assistant
              </p>
            </motion.div>

            {/* Animated Lines */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 5.5, duration: 2 }}
              className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto mt-8 max-w-md rounded-full"
            />

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7, duration: 1 }}
              className="mt-12 flex items-center justify-center space-x-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Final Fade Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 8.5, duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 relative overflow-hidden">
      {/* Background Mountains and Shapes */}
      <div className="absolute inset-0">
        {/* Mountain Shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mountain1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="mountain2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7"/>
            </linearGradient>
          </defs>
          <polygon fill="url(#mountain1)" points="0,400 300,200 600,350 900,150 1200,300 1200,800 0,800"/>
          <polygon fill="url(#mountain2)" points="200,450 500,250 800,400 1200,200 1200,800 0,800"/>
        </svg>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-sm">FA</span>
              </div>
              <span className="text-xl font-bold text-white">
                Flamingo AI
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-white/90 text-blue-600 hover:bg-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                {isLoading ? 'Loading...' : 'Start Chatting'}
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Powerful Features for
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Modern AI Experience
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            Discover cutting-edge AI capabilities with intelligent model selection, persistent memory, and seamless conversations powered by advanced technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Experience Next-Generation AI
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore our comprehensive suite of AI-powered features designed for seamless interaction and intelligent assistance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Model Selection Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-brain text-white text-sm"></i>
                  </div>
                  <h3 className="card_title">AI Model Selection</h3>
                </div>
                <p className="card_paragraph">Multiple AI models to choose from</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">GPT models</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Claude models</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Custom selection</span>
                </li>
              </ul>
              <button 
                className="button"
                onClick={() => setLocation('/signup')}
              >
                Explore Now
              </button>
            </motion.div>

            {/* PostgreSQL Memory Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-database text-white text-sm"></i>
                  </div>
                  <h3 className="card_title text-3d-gradient">PostgreSQL Memory</h3>
                </div>
                <p className="card_paragraph">Persistent conversation storage</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">User-specific storage</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Chat history</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Easy access</span>
                </li>
              </ul>
              <button 
                className="button"
                onClick={() => setLocation('/signup')}
              >
                Explore Now
              </button>
            </motion.div>

            {/* User Settings Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-cog text-white text-sm"></i>
                  </div>
                  <h3 className="card_title text-holographic">User Settings</h3>
                </div>
                <p className="card_paragraph">Customize your experience</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Personal settings</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Model preferences</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Chat customization</span>
                </li>
              </ul>
              <button 
                className="button"
                onClick={() => setLocation('/signup')}
              >
                Explore Now
              </button>
            </motion.div>

            {/* Premium Plan Card - Glass Effect */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-white/20 to-white/10 dark:from-purple-900/30 dark:to-pink-900/20 backdrop-blur-xl border border-white/30 dark:border-purple-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/25 dark:hover:bg-purple-900/40 hover:scale-105 max-w-80 cursor-pointer group"
            >
              {/* Premium Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                PREMIUM
              </div>
              
              {/* Glass Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 p-0.5 -z-10">
                <div className="w-full h-full bg-white/10 dark:bg-black/20 rounded-2xl"></div>
              </div>

              <div className="relative z-10">
                {/* Title Section */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-crown text-white text-lg animate-bounce"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                      Premium Access
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Unlock advanced AI capabilities
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mb-4"></div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3 group/item">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-300 transition-colors">
                      Unlimited conversations
                    </span>
                  </li>
                  <li className="flex items-center space-x-3 group/item">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-300 transition-colors">
                      Priority response speed
                    </span>
                  </li>
                  <li className="flex items-center space-x-3 group/item">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-300 transition-colors">
                      Advanced AI models
                    </span>
                  </li>
                </ul>

                {/* Premium Button */}
                <button 
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  onClick={() => setLocation('/pricing')}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <i className="fas fa-star text-yellow-300"></i>
                    <span>Get Premium</span>
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </button>
              </div>

              {/* Ambient Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity -z-20"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}