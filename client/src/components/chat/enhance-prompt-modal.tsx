import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';

interface EnhancePromptModalProps {
  isVisible: boolean;
  originalPrompt: string;
  enhancedPrompt: string;
  isEnhancing: boolean;
  onClose: () => void;
}

export function EnhancePromptModal({ 
  isVisible, 
  originalPrompt, 
  enhancedPrompt, 
  isEnhancing,
  onClose 
}: EnhancePromptModalProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  duration: 0.5
                }
              }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header with AI Face */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  {/* AI Assistant Face */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: 1, 
                      rotate: 0,
                      transition: { delay: 0.2, type: "spring", bounce: 0.4 }
                    }}
                    className="w-16 h-16 relative"
                  >
                    <motion.div
                      animate={isEnhancing ? {
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      } : {
                        scale: [1, 1.05, 1]
                      }}
                      transition={isEnhancing ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      } : {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Bot className="w-8 h-8 text-purple-600" />
                    </motion.div>
                    
                    {/* Sparkles around AI face */}
                    {isEnhancing && (
                      <>
                        <motion.div
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0
                          }}
                          className="absolute -top-2 -right-2"
                        >
                          <Sparkles className="w-4 h-4 text-yellow-300" />
                        </motion.div>
                        <motion.div
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, -180]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.5
                          }}
                          className="absolute -bottom-2 -left-2"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-200" />
                        </motion.div>
                        <motion.div
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 90]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 1
                          }}
                          className="absolute top-0 -left-3"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                  
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.3 }
                      }}
                      className="text-2xl font-bold"
                    >
                      {isEnhancing ? "Enchanting prompt..." : "Enchanted Prompt"}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.4 }
                      }}
                      className="text-white/90"
                    >
                      AI Assistant Enhancement
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Original Prompt */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.5 }
                  }}
                >
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Original Prompt
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <p className="text-gray-700 dark:text-gray-300">{originalPrompt}</p>
                  </div>
                </motion.div>

                {/* Enhanced Prompt */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.6 }
                  }}
                >
                  <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Enhanced Prompt</span>
                  </h4>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    {isEnhancing ? (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center space-x-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6"
                        >
                          <Sparkles className="w-full h-full text-purple-500" />
                        </motion.div>
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          Enhancing your prompt with AI magic...
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{enhancedPrompt}</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 0.7 }
                }}
                className="p-6 bg-gray-50 dark:bg-gray-900 flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}