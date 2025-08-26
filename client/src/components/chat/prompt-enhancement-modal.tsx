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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
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
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <i className="fas fa-sparkles text-white text-xl"></i>
                      </motion.div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Gemini is optimizing your prompt for better AI responses...
                    </p>
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
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      data-testid="use-original-btn"
                      variant="outline"
                      onClick={onUseOriginal}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Use Original
                    </Button>
                    <Button
                      data-testid="use-enhanced-btn"
                      onClick={onUseEnhanced}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Use Enhanced
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}