import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  show: boolean;
  onComplete: () => void;
  message?: string;
  duration?: number;
}

export default function SuccessPopup({ 
  show, 
  onComplete, 
  message = "Here you go!", 
  duration = 3000 
}: SuccessPopupProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onComplete}
          >
            {/* Popup Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  duration: 0.6,
                  bounce: 0.3
                }
              }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* AI Face Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { delay: 0.2, type: "spring", bounce: 0.5 }
                }}
                className="w-20 h-20 mx-auto mb-6 relative"
              >
                {/* AI Face Circle */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center"
                >
                  {/* AI Eyes */}
                  <div className="flex space-x-2">
                    <motion.div 
                      animate={{ scaleY: [1, 0.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <motion.div 
                      animate={{ scaleY: [1, 0.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                </motion.div>
                
                {/* Success Checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: { delay: 0.4, type: "spring" }
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.6 }
                }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Here you go! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {message}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}