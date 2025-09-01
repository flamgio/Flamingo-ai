import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(() => {
    // Check if animation has been shown in this session
    return !sessionStorage.getItem('flamgio-intro-shown');
  });
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showFire, setShowFire] = useState(false);

  useEffect(() => {
    // If animation shouldn't show, complete immediately
    if (!showAnimation) {
      onComplete();
      return;
    }

    // Mark animation as shown for this session
    sessionStorage.setItem('flamgio-intro-shown', 'true');

    // Logo appears first
    const logoTimer = setTimeout(() => setShowLogo(true), 500);

    // Text appears after logo
    const textTimer = setTimeout(() => setShowText(true), 1500);

    // Fire animation starts
    const fireTimer = setTimeout(() => setShowFire(true), 2500);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(fireTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, showAnimation]);

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
              <span className="text-white font-bold text-4xl" style={{
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)'
              }}>FA</span>
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

        {/* Simple Fire Effect */}
        {showFire && (
          <>
            {/* Main fire overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Fire particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-red-500 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${60 + Math.random() * 30}%`
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [1, 0],
                  scale: [1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}