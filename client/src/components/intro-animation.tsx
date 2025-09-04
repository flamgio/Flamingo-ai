
import React, { useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    // Complete the animation after 6 seconds to allow for the full text animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Animated Text Loader */}
      <div className="flamingo-text-loader">
        <div className="text-loader">
          <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
            <defs xmlns="http://www.w3.org/2000/svg">
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="2"
                x2="0"
                y1="62"
                x1="0"
                id="flamingo-gradient-1"
              >
                <stop stopColor="#ec4899"></stop>
                <stop stopColor="#f97316" offset="1.5"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="0"
                x2="0"
                y1="64"
                x1="0"
                id="flamingo-gradient-2"
              >
                <stop stopColor="#ec4899"></stop>
                <stop stopColor="#f97316" offset="1"></stop>
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
                gradientUnits="userSpaceOnUse"
                y2="2"
                x2="0"
                y1="62"
                x1="0"
                id="flamingo-gradient-3"
              >
                <stop stopColor="#06b6d4"></stop>
                <stop stopColor="#3b82f6" offset="1.5"></stop>
              </linearGradient>
            </defs>
          </svg>

          {/* G */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 75,25 A 25,25 0 0 0 25,25 A 25,25 0 0 0 25,75 A 25,25 0 0 0 50,75 L 50,50 L 65,50"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* E */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,20 L 80,20 L 80,27 L 27,27 L 27,50 L 70,50 L 70,57 L 25,57 L 25,80 L 80,80 L 80,87 L 20,87 Z"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* T */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,20 L 80,20 M 50,20 L 50,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* Space */}
          <div className="letter-svg inline-block"></div>

          {/* S */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 70,30 A 15,15 0 0 0 40,30 A 15,15 0 0 0 55,45 A 15,15 0 0 1 70,60 A 15,15 0 0 1 40,60"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* T */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,20 L 80,20 M 50,20 L 50,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* A */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,80 L 50,20 L 80,80 M 30,60 L 70,60"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* R */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,20 L 20,80 M 20,20 L 60,20 A 15,15 0 0 1 60,50 L 20,50 M 50,50 L 75,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* T */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,20 L 80,20 M 50,20 L 50,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* E */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,20 L 80,20 L 80,27 L 27,27 L 27,50 L 70,50 L 70,57 L 25,57 L 25,80 L 80,80 L 80,87 L 20,87 Z"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* D */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 20,20 L 20,80 M 20,20 L 60,20 A 20,20 0 0 1 60,80 L 20,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* Space */}
          <div className="letter-svg inline-block"></div>

          {/* W */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 15,20 L 25,80 L 40,40 L 50,80 L 60,40 L 75,80 L 85,20"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* I */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 30,20 L 70,20 M 50,20 L 50,80 M 30,80 L 70,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* T */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 20,20 L 80,20 M 50,20 L 50,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* H */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 25,20 L 25,80 M 75,20 L 75,80 M 25,50 L 75,50"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* Space */}
          <div className="letter-svg inline-block"></div>

          {/* F */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,20 L 20,80 M 20,20 L 75,20 M 20,50 L 65,50"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* L */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 25,20 L 25,80 L 75,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* A */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,80 L 50,20 L 80,80 M 30,60 L 70,60"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* M */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,80 L 20,20 L 50,50 L 80,20 L 80,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* I */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 30,20 L 70,20 M 50,20 L 50,80 M 30,80 L 70,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* N */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 20,80 L 20,20 L 80,80 L 80,20"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* G */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-1)"
              d="M 75,25 A 25,25 0 0 0 25,25 A 25,25 0 0 0 25,75 A 25,25 0 0 0 50,75 L 50,50 L 65,50"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* O */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-2)"
              d="M 50,15 A 35,35 0 0 1 85,50 A 35,35 0 0 1 50,85 A 35,35 0 0 1 15,50 A 35,35 0 0 1 50,15 Z"
              className="spin"
              pathLength="360"
            ></path>
          </svg>

          {/* Space */}
          <div className="letter-svg inline-block"></div>

          {/* A */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 20,80 L 50,20 L 80,80 M 30,60 L 70,60"
              className="dash"
              pathLength="360"
            ></path>
          </svg>

          {/* I */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 100 100"
            className="letter-svg inline-block"
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="8"
              stroke="url(#flamingo-gradient-3)"
              d="M 30,20 L 70,20 M 50,20 L 50,80 M 30,80 L 70,80"
              className="dash"
              pathLength="360"
            ></path>
          </svg>
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
