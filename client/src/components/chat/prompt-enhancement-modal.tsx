import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptEnhancementModalProps {
  isOpen: boolean;
  originalPrompt: string;
  enhancedPrompt: string;
  onUseEnhanced: () => void;
  onUseOriginal: () => void;
  onClose: () => void;
  isEnhancing: boolean;
}

export default function PromptEnhancementModal({
  isOpen,
  originalPrompt,
  enhancedPrompt,
  onUseEnhanced,
  onUseOriginal,
  onClose,
  isEnhancing
}: PromptEnhancementModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
          className="w-full max-w-2xl relative"
        >
          {/* Floating particles */}
          <div className="absolute -inset-4 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
          <Card className="shadow-2xl border border-white/20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.05), rgba(236,72,153,0.1))",
                  "linear-gradient(90deg, rgba(147,51,234,0.1), rgba(236,72,153,0.05), rgba(59,130,246,0.1))",
                  "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(59,130,246,0.05), rgba(147,51,234,0.1))"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: isEnhancing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isEnhancing ? Infinity : 0 }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                >
                  <i className="fas fa-magic text-white text-sm"></i>
                </motion.div>
                <span className="text-lg text-gray-900 dark:text-white">
                  {isEnhancing ? "Enhancing your prompt..." : "Enhanced Prompt Ready"}
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isEnhancing ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <div className="relative">
                      {/* Outer pulsing ring */}
                      <motion.div
                        className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {/* Main AI brain */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <i className="fas fa-brain text-white text-2xl"></i>
                        </motion.div>
                        {/* Floating sparkles around AI */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${50 + 30 * Math.cos(i * Math.PI / 2)}%`,
                              top: `${50 + 30 * Math.sin(i * Math.PI / 2)}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.4
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <motion.p 
                      className="text-gray-700 dark:text-gray-300 font-medium text-lg"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🧠✨ Gemini is enhancing your prompt...
                    </motion.p>
                    <motion.p 
                      className="text-gray-500 dark:text-gray-400 text-sm mt-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      Making it smarter for better AI responses
                    </motion.p>
                  </motion.div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <i className="fas fa-user text-blue-500 mr-2"></i>
                        Original Prompt
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-gray-300 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                          {originalPrompt}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <i className="fas fa-magic text-purple-500 mr-2"></i>
                        Enhanced Prompt
                      </h4>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-gradient-to-b from-blue-400 to-purple-500">
                        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                          {enhancedPrompt}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200/50 dark:border-gray-600/50">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        data-testid="use-original-btn"
                        variant="outline"
                        onClick={onUseOriginal}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-gray-300 hover:border-gray-400 transition-all duration-200"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Use Original
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        data-testid="use-enhanced-btn"
                        onClick={onUseEnhanced}
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                        <i className="fas fa-magic mr-2 relative z-10"></i>
                        <span className="relative z-10">Use Enhanced ✨</span>
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}