
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";
import IntroAnimation from "@/components/intro-animation";
import { ParallaxPageWrapper, ParallaxAnimation } from "@/components/parallax-animation";
import "../styles/new-theme-toggle.css";
import "../styles/landing-3d.css";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-800/30 rounded-lg flex items-center justify-center mb-6">
      <i className={`${icon} text-blue-600 dark:text-blue-400 text-xl`}></i>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const ChatPreview = () => (
  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Flamingo AI Chat</span>
      </div>
    </div>

    <div className="p-6 space-y-4 h-80 overflow-y-auto">
      <div className="flex justify-end">
        <div className="chat-message-user px-4 py-2 rounded-lg max-w-xs">
          <p className="text-sm">How does your agent system work?</p>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              Mixtral-8x7B
            </span>
          </div>
          <div className="chat-message-assistant px-4 py-3 rounded-lg max-w-sm">
            <p className="text-sm">
              <strong>Great question!</strong> Our system intelligently routes your prompts:
            </p>
            <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Short/simple → Local HF models</li>
              <li>Complex/long → Cloud models</li>
              <li>Automatic fallback for reliability</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="chat-message-assistant px-4 py-3 rounded-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro if not shown in this session
    return !sessionStorage.getItem('intro-shown');
  });
  
  // Initialize scroll animations
  useScrollAnimation();

  // Redirect logged in users using useEffect to prevent setState during render
  useEffect(() => {
    if (user && !showIntro) {
      setLocation('/dashboard');
    }
  }, [user, showIntro, setLocation]);

  const handleGetStarted = async () => {
    if (user) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  };

  const { toggleTheme, theme } = useTheme();

  // Show intro animation first
  if (showIntro) {
    return <IntroAnimation onComplete={() => {
      setShowIntro(false);
      sessionStorage.setItem('intro-shown', 'true');
    }} />;
  }

  return (
    <ParallaxPageWrapper>
      <div className="landing-3d-container min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        
        {/* Enhanced 3D Background Elements */}
        <div className="bg-gradient-layer bg-gradient-layer-1"></div>
        <div className="bg-gradient-layer bg-gradient-layer-2"></div>
        <div className="bg-gradient-layer bg-gradient-layer-3"></div>
        
        {/* Floating orbs with enhanced depth */}
        <div className="bg-3d-element floating-orb floating-orb-1"></div>
        <div className="bg-3d-element floating-orb floating-orb-2"></div>
        <div className="bg-3d-element floating-orb floating-orb-3"></div>
        <div className="bg-3d-element floating-orb floating-orb-4"></div>
        <div className="bg-3d-element floating-orb floating-orb-5"></div>
        
        {/* Enhanced background spheres */}
        <div className="bg-3d-element bg-sphere-1"></div>
        <div className="bg-3d-element bg-sphere-2"></div>
        <div className="bg-3d-element bg-sphere-3"></div>
        <div className="bg-3d-element bg-sphere-4"></div>
        
        {/* Enhanced geometric shapes */}
        <div className="floating-shape bg-3d-element bg-cube"></div>
        <div className="floating-shape bg-3d-element bg-diamond"></div>
        <div className="floating-shape bg-3d-element bg-hexagon"></div>
        <div className="bg-3d-element bg-triangle"></div>
        <div className="floating-shape bg-3d-element bg-rectangle"></div>

        {/* Water Elements - Waterfalls */}
        <div className="waterfall-element waterfall-1"></div>
        <div className="waterfall-element waterfall-2"></div>
        <div className="waterfall-element waterfall-3"></div>
        <div className="waterfall-element waterfall-4"></div>

        {/* Enhanced Mountain Silhouettes - Multiple Layers */}
        <div className="mountain-silhouette">
          <div className="mountain-layer-1"></div>
          <div className="mountain-layer-2"></div>
          <div className="mountain-layer-3"></div>
        </div>

        {/* Flying Birds */}
        <div className="bird-element bird-1"></div>
        <div className="bird-element bird-2"></div>
        <div className="bird-element bird-3"></div>

        {/* Water Ripple Effect */}
        <div className="water-ripple"></div>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                {/* Updated Logo matching chat page */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 touch-manipulation">
                  <span className="text-white font-bold text-sm sm:text-base">FA</span>
                </div>
                <button
                  onClick={() => setLocation('/')}
                  className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300 touch-manipulation"
                >
                  <span className="hidden sm:inline">Flamingo AI</span>
                  <span className="sm:hidden">Flamingo</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* New Switch Theme Toggle */}
              <label className="switch" data-testid="theme-toggle">
                <input 
                  type="checkbox" 
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>

              <Button
                data-testid="nav-chat-btn"
                onClick={handleGetStarted}
                disabled={isLoading}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] touch-manipulation"
              >
                {isLoading ? 'Loading...' : (
                  <>
                    <span className="hidden sm:inline">Start Chatting</span>
                    <span className="sm:hidden">Chat</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="parallax-section relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 gradient-bg-primary"></div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="space-y-8 scroll-element-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-glow load-3d"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-sky-400">Modern</span>{' '}
                  <span className="text-blue-400">
                    AI Platform
                  </span>{' '}
                  <span className="text-cyan-400">Experience</span>
                </motion.h1>
                <motion.div
                  className="text-bg-glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p className="text-lg sm:text-xl leading-relaxed text-white">
                    Experience seamless interactions with our <span className="text-white font-semibold">intelligent AI platform</span>.
                    Built with <span className="text-white font-semibold">privacy-first design</span> and <span className="text-white font-semibold">cutting-edge technology</span>.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    data-testid="get-started-btn"
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white px-6 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 button-glow min-h-[56px] touch-manipulation w-full sm:w-auto"
                  >
                    <i className="fas fa-rocket mr-2 sm:mr-3"></i>
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    data-testid="watch-demo-btn"
                    variant="outline"
                    className="border-2 border-blue-400 text-blue-600 dark:text-blue-300 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 min-h-[56px] touch-manipulation w-full sm:w-auto"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {[
                  { icon: 'fas fa-shield-alt', text: 'Secure & Private', style: 'text-white font-semibold' },
                  { icon: 'fas fa-bolt', text: 'Fast & Reliable', style: 'text-white font-semibold' },
                  { icon: 'fas fa-cogs', text: 'Smart AI Features', style: 'text-white font-semibold' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg text-bg-gradient backdrop-blur-sm border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-lg flex items-center justify-center glow-effect">
                      <i className={`${feature.icon} text-white text-glow-blue`}></i>
                    </div>
                    <span className={`font-bold ${feature.style}`}>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative scroll-element-right"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="card-3d"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <ChatPreview />
              </motion.div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sky-300/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="parallax-section py-20 bg-gray-50 dark:bg-gray-800 gradient-bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16 scroll-element"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-bg-floating">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-sky-400">Powerful Features</span> for{' '}
                <span className="text-blue-400">Modern AI</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-white">
                Discover <span className="text-white font-semibold">innovative AI features</span> designed for{' '}
                <span className="text-white font-semibold">seamless user experience</span>, <span className="text-white font-semibold">performance</span>, and{' '}
                <span className="text-white font-semibold">reliability</span>.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Model Selection Card */}
            <div className="card w-full">
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-brain text-white text-sm"></i>
                  </div>
                  <h3 className="card_title">
                    <span className="letter-animation">A</span>
                    <span className="letter-animation">I</span>
                    <span className="letter-animation"> </span>
                    <span className="letter-animation">M</span>
                    <span className="letter-animation">o</span>
                    <span className="letter-animation">d</span>
                    <span className="letter-animation">e</span>
                    <span className="letter-animation">l</span>
                    <span className="letter-animation"> </span>
                    <span className="letter-animation text-neon-cyan">S</span>
                    <span className="letter-animation text-neon-cyan">e</span>
                    <span className="letter-animation text-neon-cyan">l</span>
                    <span className="letter-animation text-neon-cyan">e</span>
                    <span className="letter-animation text-neon-cyan">c</span>
                    <span className="letter-animation text-neon-cyan">t</span>
                    <span className="letter-animation text-neon-cyan">i</span>
                    <span className="letter-animation text-neon-cyan">o</span>
                    <span className="letter-animation text-neon-cyan">n</span>
                  </h3>
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
              <button className="button">Explore Now</button>
            </div>

            {/* PostgreSQL Memory Card */}
            <div className="card w-full">
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
              <button className="button">Explore Now</button>
            </div>

            {/* User Settings Card */}
            <div className="card w-full">
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
              <button className="button">Explore Now</button>
            </div>

            {/* Mobile Responsive Card */}
            <div className="card w-full">
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-white text-sm"></i>
                  </div>
                  <h3 className="card_title text-fire">Mobile Responsive</h3>
                </div>
                <p className="card_paragraph">Perfect on all devices</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Mobile-first design</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Touch interactions</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Responsive layout</span>
                </li>
              </ul>
              <button className="button">Explore Now</button>
            </div>

            {/* Privacy Security Card */}
            <div className="card w-full">
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-shield-alt text-white text-sm"></i>
                  </div>
                  <h3 className="card_title text-glow-purple">Privacy Security</h3>
                </div>
                <p className="card_paragraph">Your data stays private</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Secure authentication</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Encrypted storage</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Private conversations</span>
                </li>
              </ul>
              <button className="button">Explore Now</button>
            </div>

            {/* Markdown Support Card */}
            <div className="card w-full">
              <div className="card__border"></div>
              <div className="card_title__container">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-code text-white text-sm"></i>
                  </div>
                  <h3 className="card_title text-chrome">Markdown Support</h3>
                </div>
                <p className="card_paragraph">Rich text formatting</p>
              </div>
              <hr className="line" />
              <ul className="card__list">
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Code blocks</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Lists & formatting</span>
                </li>
                <li className="card__list_item">
                  <span className="check">
                    <svg className="check_svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="list_text">Highlighted content</span>
                </li>
              </ul>
              <button className="button">Explore Now</button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </ParallaxPageWrapper>
  );
}