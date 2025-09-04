import React, { useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    // Complete the animation after 6 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center justify-center space-y-8">
        
        {/* 3D Character holding Flamingo */}
        <div className="relative animate-character-entrance">
          {/* Character Container with 3D effects */}
          <div className="character-3d-container">
            <div className="character-3d-model">
              {/* Character Body */}
              <div className="character-body">
                <div className="character-torso"></div>
                <div className="character-head">
                  <div className="character-eyes">
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                  </div>
                  <div className="character-mouth"></div>
                </div>
                <div className="character-arms">
                  <div className="arm left-arm"></div>
                  <div className="arm right-arm">
                    {/* Flamingo in hand */}
                    <div className="flamingo-pet">
                      <div className="flamingo-body"></div>
                      <div className="flamingo-neck"></div>
                      <div className="flamingo-head"></div>
                      <div className="flamingo-beak"></div>
                      <div className="flamingo-legs">
                        <div className="leg"></div>
                        <div className="leg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Animation with your provided code */}
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
                <stop className="s-xJBuHA073rTt" stopColor="#0369a1"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#67e8f9" offset="1.5"></stop>
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
                <stop className="s-xJBuHA073rTt" stopColor="#0369a1"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#22d3ee" offset="1"></stop>
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
                <stop className="s-xJBuHA073rTt" stopColor="#38bdf8"></stop>
                <stop className="s-xJBuHA073rTt" stopColor="#075985" offset="1.5"></stop>
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
              id="E"
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
              d="M 20,20 L 50,80 L 80,20"
              className="dash"
              id="v"
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

        {/* Animated Text */}
        <div className="intro-text-container">
          <h1 className="intro-text-main animate-text-glow">
            Get Started With FLAMINGO AI
          </h1>
          <div className="intro-text-subtitle animate-pulse-text">
            <span className="text-stream">Your AI Journey Begins Here</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Particles */}
      <div className="flamingo-particles">
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