import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/video-landing.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function VideoLanding() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toggleTheme, theme } = useTheme();
  
  // GSAP refs for premium animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLNavElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const chatPreviewRef = useRef<HTMLDivElement>(null);

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

  // Premium GSAP animations on page load
  useGSAP(() => {
    if (!containerRef.current) return;

    // Main timeline for entrance animations
    const tl = gsap.timeline({ delay: 0.2 });

    // Navigation slide down with fade
    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )

    // Hero section staggered entrance
    .fromTo(".hero-title", 
      { opacity: 0, y: 80, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "back.out(1.7)" },
      "-=0.5"
    )
    .fromTo(".hero-description",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=1"
    )
    .fromTo(".hero-actions",
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.6"
    )
    .fromTo(".feature-pills",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )

    // Chat preview slide in from right
    .fromTo(chatPreviewRef.current,
      { opacity: 0, x: 150, rotationY: -20 },
      { opacity: 1, x: 0, rotationY: 0, duration: 1.2, ease: "power3.out" },
      "-=1.5"
    );

    // Scroll-triggered animations for features
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      
      gsap.fromTo(featureCards, 
        {
          opacity: 0,
          y: 100,
          rotationX: -15,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Floating animations for environment elements
    gsap.to(".cloud", {
      x: "random(-20, 20)",
      y: "random(-10, 10)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    gsap.to(".particle", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      rotation: "random(-180, 180)",
      duration: "random(4, 8)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

    // Premium button hover effects
    const buttons = document.querySelectorAll('.primary-cta, .secondary-cta, .card-button');
    buttons.forEach(button => {
      const element = button as HTMLElement;
      
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: 1.05,
          y: -3,
          boxShadow: "0 20px 40px rgba(120, 50, 190, 0.4)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          y: 0,
          boxShadow: "0 0 0 rgba(120, 50, 190, 0)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

  }, []);

  return (
    <div ref={containerRef} className="video-landing-container">
      {/* Navigation */}
      <nav ref={navRef} className="landing-nav">
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
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="title-line-1">Experience the</span>
            <span className="title-line-2">Future of AI</span>
            <span className="title-line-3">Chat Platform</span>
          </h1>

          <p className="hero-description">
            Discover seamless conversations with our intelligent AI platform. 
            Built with privacy-first design and cutting-edge technology for 
            the ultimate chat experience.
          </p>

          <div className="hero-actions">
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
          </div>

          {/* Feature Pills */}
          <div className="feature-pills">
            <div className="pill">🛡️ Secure & Private</div>
            <div className="pill">⚡ Lightning Fast</div>
            <div className="pill">🧠 AI-Powered</div>
          </div>
        </div>

        {/* Floating Chat Preview */}
        <div ref={chatPreviewRef} className="chat-preview">
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
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>

      {/* Features Section with Cards */}
      <section ref={featuresRef} className="features-section">
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
      </section>
    </div>
  );
}