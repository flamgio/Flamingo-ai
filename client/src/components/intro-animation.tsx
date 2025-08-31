
/** Human-made Flamingo AI - Original work, not generated. Do not remove this signature. */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Show animation for 5 seconds then complete
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showAnimation) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Logo in center */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Logo Box with Fire Background */}
          <motion.div
            className="relative w-32 h-32 bg-black rounded-xl shadow-2xl border-2 border-white/20 flex items-center justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Fire effect inside logo */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-xl"
                initial={{ scaleY: 0, transformOrigin: "bottom" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
              
              {/* Animated flames */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-8 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-full"
                  style={{
                    left: `${10 + i * 10}%`,
                    bottom: '0%'
                  }}
                  animate={{
                    scaleY: [0.8, 1.2, 0.9, 1.1, 0.8],
                    opacity: [0.7, 1, 0.8, 1, 0.7],
                    x: [0, 2, -1, 1, 0]
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: 2 + i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Box and Fire icons in white */}
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <i className="fas fa-cube text-white text-2xl"></i>
              <i className="fas fa-fire text-white text-2xl"></i>
            </div>
          </motion.div>

          {/* Logo Text */}
          <motion.h1
            className="text-4xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            Flamingo
          </motion.h1>

          {/* Welcome Text */}
          <motion.p
            className="text-xl text-gray-300 text-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            Welcome to Flamgio AI
          </motion.p>
        </motion.div>

        {/* Burning Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-orange-500/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
        />

        {/* Fire particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-t from-red-500 to-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${80 + Math.random() * 20}%`
            }}
            animate={{
              y: [-50, -200],
              opacity: [1, 0],
              scale: [1, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: 2 + Math.random() * 3
            }}
          />
        ))}

        {/* Burning screen effect at the end */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"
          initial={{ scaleY: 0, transformOrigin: "bottom" }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 4 }}
        />
      </div>
    </motion.div>
  );
}
