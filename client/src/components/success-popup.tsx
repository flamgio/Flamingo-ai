
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessPopupProps {
  show: boolean;
  onComplete: () => void;
  message?: string;
  duration?: number;
}

export default function SuccessPopup({ 
  show, 
  onComplete, 
  message = "Success!", 
  duration = 2000 
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
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-400"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
            <button
              onClick={onComplete}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-green-300 rounded-b-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
