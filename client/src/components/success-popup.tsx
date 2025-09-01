import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SuccessPopupProps {
  show: boolean;
  onComplete: () => void;
}

export default function SuccessPopup({ show, onComplete }: SuccessPopupProps) {
  const [showRobot, setShowRobot] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (show) {
      const robotTimer = setTimeout(() => setShowRobot(true), 300);
      const textTimer = setTimeout(() => setShowText(true), 800);
      const completeTimer = setTimeout(onComplete, 3000);

      return () => {
        clearTimeout(robotTimer);
        clearTimeout(textTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-center max-w-md mx-4"
          >
            {/* Outer Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl blur-xl animate-pulse"></div>
            
            <div className="relative">
              {/* AI Robot Animation */}
              <AnimatePresence>
                {showRobot && (
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mb-6"
                  >
                    <div className="relative inline-block">
                      {/* Robot Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-blue-500/50 rounded-full blur-lg animate-pulse"></div>
                      
                      {/* Robot Icon */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V9H21ZM17 5V9H7V5H17Z"/>
                        </svg>
                        
                        {/* Eyes Animation */}
                        <div className="absolute top-4 left-6">
                          <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                        </div>
                        <div className="absolute top-4 right-6">
                          <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enchanted Time Text Effect */}
              <AnimatePresence>
                {showText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl font-bold mb-4">
                      <span className="inline-block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent animate-shimmer">
                        Here you go ✨
                      </span>
                    </h2>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/80 text-lg"
                    >
                      Welcome to Flamingo AI!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}