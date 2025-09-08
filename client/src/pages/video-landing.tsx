import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";
import "../styles/video-landing.css";

export default function VideoLanding() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toggleTheme, theme } = useTheme();

  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleGetStarted = () => {
    if (user) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  };

  return (
    <div className="video-landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo-container" onClick={() => setLocation('/')} style={{cursor: 'pointer'}}>
              <div className="logo-icon">
                <span>FA</span>
              </div>
              <span className="brand-text">Flamingo</span>
            </div>
          </div>
          
          <div className="nav-right">
            <label className="theme-switch">
              <input 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span className="theme-slider"></span>
            </label>
            
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="nav-cta-btn"
            >
              {isLoading ? 'Loading...' : 'Start Chatting'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Background Environment */}
      <div className="environment-container">
        {/* Sky and Atmosphere */}
        <div className="sky-layer"></div>
        <div className="clouds-layer">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        {/* Mountain Ranges - Multiple Layers for Depth */}
        <div className="mountains-container">
          <div className="mountain-range mountain-back"></div>
          <div className="mountain-range mountain-mid"></div>
          <div className="mountain-range mountain-front"></div>
        </div>

        {/* Waterfalls */}
        <div className="waterfalls-container">
          <div className="waterfall waterfall-main">
            <div className="water-stream"></div>
            <div className="water-splash"></div>
          </div>
          <div className="waterfall waterfall-side">
            <div className="water-stream"></div>
            <div className="water-splash"></div>
          </div>
        </div>

        {/* Birds Flying */}
        <div className="birds-container">
          <div className="bird-group group-1">
            <div className="bird bird-1"></div>
            <div className="bird bird-2"></div>
            <div className="bird bird-3"></div>
          </div>
          <div className="bird-group group-2">
            <div className="bird bird-4"></div>
            <div className="bird bird-5"></div>
          </div>
        </div>

        {/* Particles and Atmosphere */}
        <div className="particles-container">
          <div className="particle-mist"></div>
          <div className="floating-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <span className="title-line-1">Experience the</span>
            <span className="title-line-2">Future of AI</span>
            <span className="title-line-3">Chat Platform</span>
          </motion.h1>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Discover seamless conversations with our intelligent AI platform. 
            Built with privacy-first design and cutting-edge technology for 
            the ultimate chat experience.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              size="lg"
              className="primary-cta"
            >
              <span>🚀</span>
              {isLoading ? 'Loading...' : 'Get Started'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="secondary-cta"
            >
              <span>▶️</span>
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            className="feature-pills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="pill">🛡️ Secure & Private</div>
            <div className="pill">⚡ Lightning Fast</div>
            <div className="pill">🧠 AI-Powered</div>
          </motion.div>
        </motion.div>

        {/* Floating Chat Preview */}
        <motion.div 
          className="chat-preview"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="chat-window">
            <div className="chat-header">
              <div className="window-controls">
                <div className="control red"></div>
                <div className="control yellow"></div>
                <div className="control green"></div>
              </div>
              <span className="chat-title">Flamingo AI Chat</span>
            </div>
            
            <div className="chat-messages">
              <div className="message user-message">
                <div className="message-content">
                  How does your AI system work?
                </div>
              </div>
              
              <div className="message ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>Great question! Our intelligent platform routes conversations to the most suitable AI models for optimal responses.</p>
                  <ul>
                    <li>🎯 Smart model selection</li>
                    <li>⚡ Real-time processing</li>
                    <li>🔒 Privacy protected</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>

      {/* Features Section with Cards */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="features-container">
          <motion.div 
            className="features-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="features-title">
              <span className="gradient-text">Powerful Features</span> for
              <br />
              <span className="gradient-text-alt">Modern AI Experience</span>
            </h2>
            <p className="features-description">
              Discover innovative AI features designed for seamless user experience,
              performance, and reliability in every conversation.
            </p>
          </motion.div>

          <div className="features-grid">
            {/* AI Model Selection Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: 5,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon brain-icon">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3 className="card-title">Model Selection</h3>
                </div>
                <p className="card-description">Multiple intelligent models to choose from</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Advanced models</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Premium models</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Custom selection</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* PostgreSQL Memory Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: -5,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon database-icon">
                    <i className="fas fa-database"></i>
                  </div>
                  <h3 className="card-title">PostgreSQL Memory</h3>
                </div>
                <p className="card-description">Persistent conversation storage</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>User-specific storage</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Chat history</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Easy access</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* User Settings Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: 8,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon settings-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h3 className="card-title">User Settings</h3>
                </div>
                <p className="card-description">Customize your experience</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Personal preferences</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Theme options</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Privacy controls</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* Real-time Chat Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: -6,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon chat-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <h3 className="card-title">Real-time Chat</h3>
                </div>
                <p className="card-description">Instant intelligent conversations</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Lightning fast responses</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Multi-turn conversations</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Smart context awareness</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* Security & Privacy Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: 10,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon security-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="card-title">Security & Privacy</h3>
                </div>
                <p className="card-description">Your data, protected always</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>End-to-end encryption</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Privacy-first design</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Secure authentication</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* Analytics & Insights Card */}
            <motion.div 
              className="feature-card card-3d"
              initial={{ opacity: 0, y: 60, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                rotateY: -4,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon analytics-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="card-title">Analytics & Insights</h3>
                </div>
                <p className="card-description">Track your AI interactions</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Usage statistics</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Performance metrics</span>
                  </li>
                  <li>
                    <span className="feature-check">✓</span>
                    <span>Detailed reports</span>
                  </li>
                </ul>
                <button className="card-button">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>

            {/* Glassmorphism Highlight Card */}
            <motion.div 
              className="feature-card glassmorphism-card"
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -15, 
                scale: 1.05,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="glass-backdrop"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon premium-icon">
                    <i className="fas fa-crown"></i>
                  </div>
                  <h3 className="card-title premium-title">Premium Experience</h3>
                </div>
                <p className="card-description">Unlock the full potential of AI</p>
                <div className="card-divider glass-divider"></div>
                <ul className="card-features">
                  <li>
                    <span className="feature-check premium-check">✨</span>
                    <span>Advanced AI models</span>
                  </li>
                  <li>
                    <span className="feature-check premium-check">✨</span>
                    <span>Priority processing</span>
                  </li>
                  <li>
                    <span className="feature-check premium-check">✨</span>
                    <span>Unlimited conversations</span>
                  </li>
                </ul>
                <button className="card-button premium-button">
                  <span>Get Premium</span>
                  <i className="fas fa-sparkles"></i>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}