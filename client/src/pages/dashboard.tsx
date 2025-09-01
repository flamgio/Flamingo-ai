import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
        {/* Custom Start Chat Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-16"
        >
          <button
            onClick={handleStartChat}
            className="button"
          >
            <div className="wrap">
              <p>
                <i className="fas fa-comments"></i>
                <span>Start Chat</span>
                <span>Begin Journey</span>
              </p>
            </div>
          </button>
        </motion.div>

        {/* Explore Upgrade Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl flex justify-center"
        >
          <button
            onClick={() => setLocation('/pricing')}
            className="button"
          >
            <div className="wrap">
              <p>
                <i className="fas fa-rocket"></i>
                <span>Explore Upgrade Now</span>
                <span>Unlock Premium Features</span>
              </p>
            </div>
          </button>
        </motion.div>
      </div>

    </div>
  );
}