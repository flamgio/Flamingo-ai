import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomePopupProps {
  show: boolean;
  user?: {
    firstName: string;
    lastName: string;
    role?: string;
  };
  onClose: () => void;
}

export default function WelcomePopup({ show, user, onClose }: WelcomePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useGSAP(() => {
    if (show && popupRef.current && robotRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true)
      });

      // Robot entrance animation
      tl.fromTo(robotRef.current, 
        { 
          scale: 0, 
          rotation: -180, 
          y: 100,
          opacity: 0 
        },
        { 
          scale: 1, 
          rotation: 0, 
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)"
        }
      );

      // Robot idle animation
      tl.to(robotRef.current, {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      }, "-=0.5");

      // Sparkles animation
      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll('.sparkle');
        gsap.set(sparkles, { scale: 0, opacity: 0 });
        
        sparkles.forEach((sparkle, index) => {
          gsap.to(sparkle, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 1.5 + index * 0.1,
            ease: "back.out(1.7)"
          });
          
          gsap.to(sparkle, {
            rotation: 360,
            duration: 4,
            delay: 2,
            repeat: -1,
            ease: "none"
          });
        });
      }

      // Text reveal animation
      const textElements = popupRef.current.querySelectorAll('.reveal-text');
      textElements.forEach((element, index) => {
        tl.fromTo(element,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6,
            ease: "power2.out"
          },
          1.2 + index * 0.2
        );
      });
    }
  }, [show]);

  const handleClose = () => {
    if (popupRef.current) {
      gsap.to(popupRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    }
  };

  if (!show) return null;

  const getRoleMessage = (role?: string) => {
    switch (role) {
      case 'admin':
        return '🔑 Admin Dashboard Access Granted';
      case 'manager':
        return '📊 Manager Panel Ready';
      default:
        return '🚀 Ready for AI Conversations';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 via-orange-500 to-yellow-500';
      case 'manager':
        return 'from-blue-500 via-purple-500 to-indigo-500';
      default:
        return 'from-orange-500 via-pink-500 to-purple-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      >
        <motion.div
          ref={popupRef}
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 300,
            duration: 0.8 
          }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full opacity-20 blur-3xl`}></div>
            <div className={`absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full opacity-20 blur-2xl`}></div>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
            data-testid="button-close-welcome"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* AI Robot */}
            <div className="relative mb-6">
              <div
                ref={robotRef}
                className={`w-20 h-20 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden`}
              >
                <span className="text-white font-bold text-3xl z-10">🤖</span>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>

              {/* Floating Sparkles */}
              <div ref={sparklesRef} className="absolute inset-0">
                <Sparkles className="sparkle absolute -top-2 -left-2 w-4 h-4 text-yellow-400" />
                <Star className="sparkle absolute -top-1 right-0 w-3 h-3 text-pink-400" />
                <Zap className="sparkle absolute -bottom-2 left-2 w-4 h-4 text-blue-400" />
                <Sparkles className="sparkle absolute -bottom-1 -right-2 w-3 h-3 text-purple-400" />
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h2 className={`reveal-text text-3xl font-bold bg-gradient-to-r ${getRoleColor(user?.role)} bg-clip-text text-transparent`}>
                Here you go 👋
              </h2>
              
              <div className="reveal-text">
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
                  Welcome back, {user?.firstName}!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getRoleMessage(user?.role)}
                </p>
              </div>

              {/* Role Badge */}
              {user?.role && (
                <div className="reveal-text">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getRoleColor(user?.role)} text-white text-sm font-semibold shadow-lg`}>
                    <span className="mr-1">
                      {user.role === 'admin' ? '👑' : user.role === 'manager' ? '📊' : '🚀'}
                    </span>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
                  </div>
                </div>
              )}

              {/* Action Message */}
              <div className="reveal-text pt-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Your AI-powered workspace is ready to use. Start exploring the enhanced features and enjoy the premium experience!
                </p>
              </div>

              {/* Continue Button */}
              <div className="reveal-text pt-4">
                <Button
                  onClick={handleClose}
                  className={`bg-gradient-to-r ${getRoleColor(user?.role)} hover:shadow-xl text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105`}
                  data-testid="button-continue-welcome"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Animated Border */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getRoleColor(user?.role)} opacity-20 animate-pulse pointer-events-none`}></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}