

/** Human-made Flamingo AI - Original work, not generated. Do not remove this signature. */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showFire, setShowFire] = useState(false);

  useEffect(() => {
    // Logo appears first
    const logoTimer = setTimeout(() => setShowLogo(true), 500);
    
    // Text appears after logo
    const textTimer = setTimeout(() => setShowText(true), 1500);
    
    // Fire animation starts from top
    const fireTimer = setTimeout(() => setShowFire(true), 2500);
    
    // Complete animation
    const completeTimer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(fireTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!showAnimation) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-pink-200 via-red-300 to-orange-400 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Logo */}
        {showLogo && (
          <motion.div
            className="relative z-20 mb-8"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center border-2 border-gray-600 shadow-2xl">
              <span className="text-white text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">🔥</span>
            </div>
          </motion.div>
        )}

        {/* Logo Text */}
        {showLogo && (
          <motion.h1
            className="relative z-20 text-5xl font-bold text-white text-center mb-2 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Flamingo
          </motion.h1>
        )}

        {/* Welcome Text */}
        {showText && (
          <motion.p
            className="relative z-20 text-2xl text-white text-center drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Flamgio AI
          </motion.p>
        )}

        {/* Fire Animation from Top */}
        {showFire && (
          <>
            {/* Main fire curtain from top */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400"
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Paper burning effect lines */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent"
                style={{
                  top: `${10 + i * 7}%`,
                  left: '0%',
                  right: '0%'
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: [0, 1, 1],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Falling fire particles */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-t from-red-500 to-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '0%'
                }}
                animate={{
                  y: [0, window.innerHeight],
                  opacity: [1, 0.8, 0],
                  scale: [1, 0.8, 0.3]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}

            {/* Fire sparks */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1 + Math.random() * 2
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

