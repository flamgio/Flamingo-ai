import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Check if animation has been shown before
    const hasShownIntro = localStorage.getItem('flamingo-intro-shown');
    
    if (hasShownIntro) {
      setShowAnimation(false);
      onComplete();
      return;
    }

    // Show animation and mark as shown
    const timer = setTimeout(() => {
      localStorage.setItem('flamingo-intro-shown', 'true');
      setShowAnimation(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showAnimation) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full max-w-2xl mx-auto px-8">
        {/* Train Animation */}
        <motion.div
          className="relative h-32 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 2,
              ease: 'easeInOut',
              delay: 0.5
            }}
          >
            {/* Train with glow effect */}
            <div className="relative">
              <motion.div
                className="w-20 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {/* Train body */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"></div>
                
                {/* Windows */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-blue-200 rounded-sm opacity-80"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-200 rounded-sm opacity-80"></div>
                
                {/* Wheels */}
                <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 via-red-200/50 to-transparent rounded-lg"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 1.5,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text Animation */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Flamingo AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Intelligent AI Routing • Human Curated
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}