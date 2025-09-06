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
            <div className="logo-container">
              <div className="logo-icon">
                <span>FA</span>
              </div>
              <span className="brand-text">Flamingo AI</span>
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
    </div>
  );
}