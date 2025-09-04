import React, { useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    // Complete the animation after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* 3D Animated Logo Container */}
      <div className="flamingo-3d-container">
        {/* Main 3D Logo */}
        <div className="flamingo-3d-logo">
          <div className="flamingo-logo-face flamingo-logo-front">
            <span className="flamingo-text">FA</span>
          </div>
          <div className="flamingo-logo-face flamingo-logo-back">
            <span className="flamingo-text">AI</span>
          </div>
          <div className="flamingo-logo-face flamingo-logo-right"></div>
          <div className="flamingo-logo-face flamingo-logo-left"></div>
          <div className="flamingo-logo-face flamingo-logo-top"></div>
          <div className="flamingo-logo-face flamingo-logo-bottom"></div>
        </div>
        
        {/* Brand Text */}
        <div className="flamingo-brand-text">
          <h1 className="flamingo-title">FLAMINGO</h1>
          <p className="flamingo-subtitle">AI Assistant</p>
        </div>
      </div>
      
      {/* Floating Particles */}
      <div className="flamingo-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </div>
  );
};

export default IntroAnimation;