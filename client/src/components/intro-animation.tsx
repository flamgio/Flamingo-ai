import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles } from 'lucide-react';
import '../styles/intro-animation.css';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const droppingLogoRef = useRef<HTMLDivElement>(null);
  const attachingLogoRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Enhanced exit animation
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete
        });
      }
    });

    // Dropping Logo Animation - Big logo dropping from middle
    tl.fromTo(".dropping-logo", 
      { scale: 3, y: -400, rotation: 180, opacity: 1 },
      { 
        scale: 1, 
        y: 0, 
        rotation: 0, 
        opacity: 1,
        duration: 2.5, 
        ease: "bounce.out" 
      }
    )
    // Enhanced entrance animations with GSAP
    .fromTo(".flamingo-main-title", 
      { opacity: 0, y: 100, scale: 0.5 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "backOut" },
      "-=1"
    )
    .fromTo(".intro-text-subtitle", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    )
    // Small logo dropping and attaching to Flamingo AI text
    .fromTo(".attaching-logo", 
      { scale: 0, x: 0, y: -300, opacity: 0 },
      { 
        scale: 0.4, 
        x: 20, 
        y: 0, 
        opacity: 1,
        duration: 1.2,
        ease: "bounce.out" 
      },
      "-=0.5"
    )
    .fromTo(".particle", 
      { opacity: 0, scale: 0 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5,
        stagger: 0.1,
        ease: "backOut" 
      },
      "-=1"
    );

    // Wait for 5 seconds total, then complete
    tl.to({}, { duration: 2 });
  }, [onComplete]);

  useEffect(() => {
    // Fallback timer in case GSAP fails
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden">
      {/* Black and White Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent"></div>
      </div>

      {/* Dropping Logo Animation */}
      <div ref={droppingLogoRef} className="dropping-logo absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-purple-400/30">
          <Sparkles className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center justify-center space-y-8">
        
        {/* Large Character with Text in Hand */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="character-background animate-character-float animate-character-sway">
            <div className="character-silhouette">
              {/* Character Body */}
              <div className="character-body-bg">
                <div className="character-torso-bg"></div>
                <div className="character-head-bg">
                  <div className="character-eyes-bg">
                    <div className="eye-bg left-eye-bg"></div>
                    <div className="eye-bg right-eye-bg"></div>
                  </div>
                </div>
                <div className="character-arms-bg">
                  <div className="arm-bg left-arm-bg"></div>
                  <div className="arm-bg right-arm-bg">
                  </div>
                </div>
                <div className="character-legs-bg">
                  <div className="leg-bg left-leg-bg"></div>
                  <div className="leg-bg right-leg-bg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="loader relative z-10">
          <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
            <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
              <linearGradient
                className="s-xJBuHA073rTt"
                gradientUnits="userSpaceOnUse"
                y2="2"
                x2="0"
                y1="62"
                x1="0"
                id="b"
              >
                <stop className="s-xJBuHA073rTt" stopColor="#ffffff"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#f0f0f0" offset="1.5"></stop>
              </linearGradient>
              <linearGradient
                className="s-xJBuHA073rTt"
                gradientUnits="userSpaceOnUse"
                y2="0"
                x2="0"
                y1="64"
                x1="0"
                id="c"
              >
                <stop className="s-xJBuHA073rTt" stopColor="#ffffff"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#e0e0e0" offset="1"></stop>
                <animateTransform
                  repeatCount="indefinite"
                  keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                  keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                  dur="8s"
                  values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                  type="rotate"
                  attributeName="gradientTransform"
                ></animateTransform>
              </linearGradient>
              <linearGradient
                className="s-xJBuHA073rTt"
                gradientUnits="userSpaceOnUse"
                y2="2"
                x2="0"
                y1="62"
                x1="0"
                id="d"
              >
                <stop className="s-xJBuHA073rTt" stopColor="#f8f8f8"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#d0d0d0" offset="1.5"></stop>
              </linearGradient>
            </defs>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            width="100"
            height="100"
            className="inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#b)"
              d="M 20,20 L 80,20 
              L 80,27 L 27,27 L 27,50
              L 70,50 L 70,57 
              L 25,57 L 25,80 
              L 80,80 L 80,87 L 20,87 Z"
              className="dash"
              id="F"
              pathLength="360"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            style={{"--rotation-duration":"0ms", "--rotation-direction":"normal"} as React.CSSProperties}
            viewBox="0 0 100 100"
            width="100"
            height="100"
            className="inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="12"
              stroke="url(#d)"
              d="M 20,80 L 50,20 L 80,80"
              className="dash"
              id="A"
              pathLength="360"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            width="100"
            height="100"
            className="inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="11"
              stroke="url(#c)"
              d="M 50,15  
              A 35,35 0 0 1 85,50  
              A 35,35 0 0 1 50,85  
              A 35,35 0 0 1 15,50  
              A 35,35 0 0 1 50,15 Z"
              className="spin"
              id="o"
              pathLength="360"
            ></path>
          </svg>
        </div>

        {/* FLAMINGO AI Main Text */}
        <div ref={titleRef} className="intro-text-container relative z-20">
          <h1 className="flamingo-main-title text-white">
            <span className="title-word flamingo-word text-white">FLAMINGO</span>
            <span className="title-word ai-word text-white relative inline-flex items-center">
              AI
              {/* Small Logo Attaching to Flamingo AI */}
              <div ref={attachingLogoRef} className="attaching-logo absolute -right-8 top-1/2 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </span>
          </h1>
          <div className="intro-text-subtitle">
            <span className="text-stream text-white">The Evo<span className="evolution-text text-white">lution</span> of AI Assistance</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Particles */}
      <div ref={particlesRef} className="flamingo-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
      </div>
    </div>
  );
};

export default IntroAnimation;