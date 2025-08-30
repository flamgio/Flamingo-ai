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
      className="fixed inset-0 z-50 bg-gradient-to-br from-white via-blue-50 to-red-50 dark:from-gray-900 dark:via-blue-900 dark:to-red-900 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Train Animation - Upper left to lower right diagonal */}
        <motion.div
          className="absolute"
          initial={{ 
            x: '-20vw', 
            y: '-20vh',
            rotate: 25 
          }}
          animate={{ 
            x: '120vw', 
            y: '120vh',
            rotate: 25
          }}
          transition={{ 
            duration: 4,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          {/* Train with enhanced design */}
          <div className="relative">
            <motion.div
              className="w-32 h-16 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-xl shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              {/* Train body with metallic gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-xl"></div>
              
              {/* Windows */}
              <div className="absolute top-2 left-3 w-4 h-4 bg-white/80 rounded-md"></div>
              <div className="absolute top-2 left-9 w-4 h-4 bg-white/80 rounded-md"></div>
              <div className="absolute top-2 right-3 w-4 h-4 bg-white/80 rounded-md"></div>
              
              {/* Front light */}
              <div className="absolute top-6 right-1 w-3 h-3 bg-yellow-300 rounded-full shadow-lg"></div>
              
              {/* Wheels */}
              <div className="absolute -bottom-2 left-2 w-4 h-4 bg-gray-700 rounded-full shadow-md"></div>
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gray-700 rounded-full shadow-md"></div>
              <div className="absolute -bottom-2 right-2 w-4 h-4 bg-gray-700 rounded-full shadow-md"></div>
              
              {/* White + light-red glow blend in middle - Human curated effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-xl"
                initial={{ 
                  x: '-150%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(255,200,200,0.6), transparent)'
                }}
                animate={{ 
                  x: '150%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(255,200,200,0.6), transparent)'
                }}
                transition={{ 
                  duration: 2,
                  ease: 'easeInOut',
                  delay: 1.5
                }}
              />
              
              {/* Steam effect */}
              <motion.div
                className="absolute -top-2 left-4 w-2 h-6 bg-white/40 rounded-full"
                animate={{ 
                  scaleY: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Human Made Badge */}
        <motion.div
          className="absolute bottom-8 right-8 flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Human Curated
          </span>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="absolute bottom-1/3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Flamingo AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl font-light">
            Intelligent AI • Human Crafted • No Clones
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}