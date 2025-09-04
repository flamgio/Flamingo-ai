import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show "FLAM" text effect after flamingo starts running
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 3000);

    // Start the logo fade-in after 5 seconds of flamingo running
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 5000);

    // Complete the animation after total duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Realistic flamingo silhouette SVG
  const FlamingoSilhouette = () => (
    <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flamingo body */}
      <ellipse cx="60" cy="120" rx="25" ry="35" fill="url(#flamingoBodyGradient)"/>
      
      {/* Flamingo neck - curved elegant line */}
      <path d="M60 85C60 85 70 60 85 45C100 30 120 25 140 35" 
            stroke="url(#neckGradient)" strokeWidth="8" strokeLinecap="round" fill="none"/>
      
      {/* Flamingo head */}
      <ellipse cx="140" cy="35" rx="8" ry="12" fill="url(#headGradient)"/>
      
      {/* Beak */}
      <path d="M148 35C148 35 155 32 160 35C155 38 148 35 148 35Z" fill="#FFB347"/>
      
      {/* Eye */}
      <circle cx="142" cy="32" r="2" fill="#000"/>
      
      {/* Wing - elegant curve */}
      <path d="M40 110C35 105 32 95 35 85C38 75 45 70 55 75C65 80 70 90 65 100C60 110 50 115 40 110Z" 
            fill="url(#wingGradient)"/>
      
      {/* Legs - realistic proportions */}
      <motion.line 
        x1="50" y1="155" x2="45" y2="175" 
        stroke="url(#legGradient)" strokeWidth="4" strokeLinecap="round"
        animate={{ 
          x2: [45, 40, 45],
          y2: [175, 170, 175]
        }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      <motion.line 
        x1="70" y1="155" x2="75" y2="175" 
        stroke="url(#legGradient)" strokeWidth="4" strokeLinecap="round"
        animate={{ 
          x2: [75, 80, 75],
          y2: [175, 170, 175]
        }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
      />
      
      {/* Feet */}
      <motion.ellipse 
        cx="45" cy="175" rx="8" ry="3" fill="#FFB347"
        animate={{ 
          cx: [45, 40, 45],
          scaleX: [1, 1.2, 1]
        }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      <motion.ellipse 
        cx="75" cy="175" rx="8" ry="3" fill="#FFB347"
        animate={{ 
          cx: [75, 80, 75],
          scaleX: [1, 1.2, 1]
        }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
      />
      
      <defs>
        <linearGradient id="flamingoBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FF69B4', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#FF1493', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#DC143C', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="neckGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#FFB6C1', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FF69B4', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFB6C1', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FF69B4', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FF1493', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: '#DC143C', stopOpacity: 0.6}} />
        </linearGradient>
        <linearGradient id="legGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFB347', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 dark:from-slate-900 dark:via-orange-900/20 dark:to-red-900/10 flex items-center justify-center overflow-hidden">
      {/* Realistic savanna sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200/60 via-yellow-100/40 to-green-200/50 dark:from-slate-800/70 dark:via-orange-800/30 dark:to-green-800/20"></div>
      
      {/* Sun */}
      <div className="absolute top-12 right-16 w-20 h-20 bg-yellow-300 dark:bg-yellow-200 rounded-full blur-sm opacity-80"></div>
      
      {/* Distant mountains */}
      <svg className="absolute bottom-32 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1200 200">
        <path d="M0,200 L0,150 Q200,100 400,120 Q600,80 800,110 Q1000,90 1200,130 L1200,200 Z" 
              fill="url(#mountainGradient)" opacity="0.6"/>
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#8B7355', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#A0522D', stopOpacity: 0.4}} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Savanna ground with grass texture */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-green-400/70 via-yellow-300/50 to-transparent dark:from-green-700/60 dark:via-yellow-600/30"></div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-500/60 to-transparent dark:from-green-600/40"></div>
      
      {/* Scattered grass blades */}
      <motion.div
        className="absolute bottom-8 left-1/4 w-1 h-8 bg-green-600 dark:bg-green-400"
        animate={{ scaleY: [1, 1.1, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-12 right-1/3 w-1 h-6 bg-green-500 dark:bg-green-300"
        animate={{ scaleY: [1, 0.9, 1], rotate: [0, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      
      {/* Fire approaching from behind - starts after 1 second */}
      <motion.div
        className="absolute left-0 bottom-16"
        initial={{ x: '-50vw', opacity: 0 }}
        animate={{ 
          x: '40vw', 
          opacity: [0, 1, 1, 0.8],
          scale: [0.5, 1, 1.2, 1.5]
        }}
        transition={{
          duration: 5,
          delay: 1,
          ease: "easeInOut"
        }}
      >
        {/* Fire effects */}
        <div className="relative">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-12 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full"
              style={{ 
                left: `${i * 8}px`,
                filter: 'blur(2px)',
                zIndex: 10 - i
              }}
              animate={{
                height: [48, 32, 56, 40],
                scaleY: [1, 1.2, 0.8, 1],
                opacity: [1, 0.8, 1, 0.9],
                y: [0, -4, 2, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
          {/* Smoke effects */}
          <motion.div
            className="absolute -top-8 left-0 w-20 h-16 bg-gray-600/40 dark:bg-gray-400/30 rounded-full blur-lg"
            animate={{
              scale: [1, 1.3, 1.1],
              opacity: [0.4, 0.2, 0.4],
              y: [-10, -20, -15]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Animated realistic flamingo running from fire */}
      <motion.div
        className="absolute"
        initial={{ x: '-20vw', y: 20 }}
        animate={{ 
          x: '120vw', 
          y: [20, 10, 20, 15, 20, 10, 25, 15],
          rotateZ: [0, -5, 2, -3, 0, -4, 1, 0]
        }}
        transition={{
          duration: 5,
          delay: 0.5,
          ease: "easeOut",
          y: { duration: 0.4, repeat: 12, ease: "easeInOut" },
          rotateZ: { duration: 0.6, repeat: 8, ease: "easeInOut" }
        }}
        style={{ 
          filter: 'drop-shadow(8px 8px 16px rgba(0,0,0,0.5))',
          scale: 1.4,
          transformStyle: 'preserve-3d'
        }}
      >
        <FlamingoSilhouette />
        
        {/* Enhanced dust cloud behind running flamingo */}
        <motion.div
          className="absolute -left-16 bottom-2 w-20 h-10 bg-yellow-400/40 dark:bg-yellow-600/30 rounded-full blur-lg"
          animate={{ 
            scaleX: [1, 2, 1.5, 2.2, 1],
            scaleY: [1, 0.6, 1.2, 0.8, 1],
            opacity: [0.4, 0.8, 0.6, 0.9, 0.4],
            x: [-5, -10, -8, -12, -5]
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        
        {/* Additional dirt particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-600/60 rounded-full"
            style={{ left: `-${(i + 1) * 6}px`, bottom: `${8 + i * 2}px` }}
            animate={{
              x: [-20, -40, -30],
              y: [0, -10, 5],
              opacity: [0.8, 0.3, 0],
              scale: [1, 0.5, 0]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              delay: i * 0.1 
            }}
          />
        ))}
      </motion.div>

      {/* "FLAM" text effect coming from behind - much larger and more dramatic */}
      {showText && (
        <motion.div
          className="absolute"
          initial={{ x: '-250vw', opacity: 0, scale: 0.3, rotateY: -90 }}
          animate={{ 
            x: '0vw', 
            opacity: [0, 1, 1, 0.7, 0], 
            scale: [0.3, 1.5, 2, 2.5, 3],
            rotateY: [-90, 0, 0, 0, 90]
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            opacity: { duration: 3 },
            scale: { duration: 3 }
          }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <h2 
            className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-red-500 via-pink-400 to-orange-500 bg-clip-text text-transparent tracking-wider"
            style={{ 
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: '8px 8px 16px rgba(255,69,0,0.4), 4px 4px 8px rgba(255,105,180,0.3)',
              WebkitTextStroke: '2px rgba(255,69,0,0.3)'
            }}
          >
            FLAM
          </h2>
        </motion.div>
      )}

      {/* Logo fade-in after flamingo passes - professional quality */}
      {showLogo && (
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.2, y: 150, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 2.5,
            ease: "easeOut",
            type: "spring",
            stiffness: 80
          }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative">
            {/* Elegant logo with flamingo silhouette */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-pink-500 via-red-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 10C35 15 40 20 42 25C44 30 43 35 40 38C37 41 32 42 28 40C24 38 22 34 23 30C24 26 27 23 30 20C33 17 35 14 35 10C35 6 33 3 30 2C27 3 25 6 25 10C25 14 27 17 30 20" 
                      fill="white" opacity="0.9"/>
                <circle cx="42" cy="18" r="2" fill="white"/>
                <path d="M44 18L48 16" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </motion.div>

            <motion.h1 
              className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-600 via-red-500 to-orange-600 bg-clip-text text-transparent mb-6"
              style={{ 
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
                WebkitTextStroke: '1px rgba(255,69,0,0.2)'
              }}
              initial={{ letterSpacing: '0.8em', opacity: 0 }}
              animate={{ letterSpacing: '0.1em', opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              FLAMINGO
            </motion.h1>
            <motion.div
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.5 }}
            >
              AI ASSISTANT
            </motion.div>
            
            {/* Enhanced sparkle effects */}
            <motion.div
              className="absolute -top-8 -right-8 text-yellow-400 text-3xl"
              animate={{ 
                scale: [1, 1.5, 1], 
                rotate: [0, 180, 360],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-8 -left-8 text-pink-400 text-2xl"
              animate={{ 
                scale: [1, 1.3, 1], 
                rotate: [0, -180, -360],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.7 }}
            >
              💫
            </motion.div>
            <motion.div
              className="absolute top-4 right-4 text-orange-400 text-xl"
              animate={{ 
                scale: [1, 1.4, 1], 
                rotate: [0, 90, 180],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 1.2 }}
            >
              ⭐
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IntroAnimation;