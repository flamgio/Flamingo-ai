import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/pricing-section";
import logoImg from "@/assets/logo.png";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleStartChat = () => {
    setLocation('/chat');
  };

  const handleAdminAccess = () => {
    setLocation('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Logout Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </Button>
      </div>

      {/* Logo - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <img 
          src={logoImg} 
          alt="Flamingo AI" 
          className="h-12 w-12 rounded-lg shadow-lg shadow-white/20" 
        />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Glowing Start Chat Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-16"
        >
          <div 
            onClick={handleStartChat}
            className="group relative cursor-pointer"
          >
            {/* Outer Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-purple-500/20 to-white/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 group-hover:scale-110 animate-pulse"></div>
            
            {/* Inner Box */}
            <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl p-12 hover:scale-105 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-white/15 group-hover:to-white/10">
              {/* Animated Border */}
              <div className="absolute -inset-px bg-gradient-to-r from-white/50 via-transparent to-white/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative text-center">
                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/30 group-hover:scale-110 transition-all duration-500">
                  <i className="fas fa-comments text-4xl text-white group-hover:text-white/90 transition-colors duration-300"></i>
                </div>
                
                {/* Text with Enchanted Animation */}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
                  <span className="inline-block animate-pulse bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent bg-300% animate-shimmer">
                    Start Chat
                  </span>
                </h2>
                
                <p className="text-white/70 text-lg font-light">
                  Begin your AI journey
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Banner Space */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl"
        >
          <PricingSection />
        </motion.div>
      </div>

    </div>
  );
}