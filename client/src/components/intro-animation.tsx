import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'flamingo-run' | 'fade-logo' | 'complete'>('flamingo-run');

  useEffect(() => {
    // Phase 1: Flamingo running animation (5 seconds)
    const flamingoTimer = setTimeout(() => {
      setAnimationPhase('fade-logo');
    }, 5000);

    // Phase 2: Logo fade in (2 seconds after)
    const logoTimer = setTimeout(() => {
      setAnimationPhase('complete');
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(flamingoTimer);
      clearTimeout(logoTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
      
      {/* Phase 1: Flamingo Running Animation */}
      {animationPhase === 'flamingo-run' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* "Flam" text on the left */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/4 text-6xl md:text-8xl font-bold text-white/90"
          >
            Flam
          </motion.div>
          
          {/* Flamingo running across screen */}
          <motion.div
            initial={{ x: "25%", scale: 1, rotate: 0 }}
            animate={{ 
              x: ["25%", "45%", "65%", "85%"],
              scale: [1, 1.1, 1, 0.9],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 4.2,
              delay: 0.8,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
            className="absolute flex items-center justify-center z-20"
          >
            {/* Animated Flamingo */}
            <div className="relative">
              {/* Flamingo body */}
              <motion.div
                animate={{ 
                  scaleX: [1, 1.1, 1],
                  scaleY: [1, 0.95, 1]
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-16 h-20 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full relative shadow-lg"
              >
                {/* Flamingo neck and head */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -5, 0],
                    y: [0, -2, 2, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                >
                  <div className="w-3 h-12 bg-gradient-to-t from-pink-500 to-pink-300 rounded-full"></div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-300 rounded-full">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-orange-400 rounded-full"></div>
                  </div>
                </motion.div>

                {/* Running legs animation */}
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scaleY: [1, 1.2, 0.8, 1]
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-2 left-2 w-1 h-8 bg-pink-600 rounded-full"
                />
                <motion.div
                  animate={{ 
                    rotate: [0, -15, 15, 0],
                    scaleY: [1, 0.8, 1.2, 1]
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    delay: 0.15
                  }}
                  className="absolute -bottom-2 right-2 w-1 h-8 bg-pink-600 rounded-full"
                />

                {/* Wing animation */}
                <motion.div
                  animate={{ 
                    rotate: [0, -20, 20, 0],
                    scaleX: [1, 1.3, 0.7, 1]
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                  }}
                  className="absolute top-2 -right-1 w-4 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transform origin-center"
                />
              </motion.div>

              {/* Speed lines */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  x: [10, -20, -40]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
                className="absolute top-4 -left-8 flex flex-col space-y-1"
              >
                <div className="w-8 h-0.5 bg-white/50 rounded-full"></div>
                <div className="w-6 h-0.5 bg-white/40 rounded-full"></div>
                <div className="w-4 h-0.5 bg-white/30 rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Dust clouds behind flamingo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 1
            }}
            className="absolute left-1/3 top-3/4"
          >
            <div className="w-8 h-4 bg-white/20 rounded-full blur-sm"></div>
          </motion.div>
        </div>
      )}

      {/* Phase 2: Logo Fade In */}
      {animationPhase === 'fade-logo' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center z-30"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-black rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <motion.span
                className="text-white font-bold text-2xl"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(59,130,246,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                FA
              </motion.span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Flamingo AI
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl text-white/80 mb-8"
          >
            Privacy-First AI Chat Platform
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center items-center space-x-2"
          >
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}