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
      <button 
        onClick={() => setLocation('/')}
        className="fixed top-6 left-6 z-50 flex items-center space-x-3 hover:opacity-80 transition-opacity"
      >
        <img 
          src={logoImg} 
          alt="Flamingo AI" 
          className="h-12 w-12 rounded-lg shadow-lg shadow-white/20" 
        />
        <span className="text-white text-xl font-bold">Flamingo AI</span>
      </button>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Chat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative h-[18em] w-full border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] via-purple-700/80 to-[rgba(75,30,133,0.2)] text-white p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group/card hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
              <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
              <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
            </div>

            <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
              <h1 className="text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Chat
              </h1>
              <p className="text-[0.9em] text-purple-100/90 leading-relaxed font-light">
                Experience intelligent conversations with our advanced AI. Start your journey into seamless communication and discover the power of smart responses.
              </p>
            </div>

            <button
              onClick={handleStartChat}
              className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-300/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              <p className="relative z-10 font-medium tracking-wide">Begin Journey</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
          </motion.div>

          {/* Premium Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[18em] w-full border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] via-purple-700/80 to-[rgba(75,30,133,0.2)] text-white p-[1.5em] flex justify-center items-left flex-col gap-[1em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group/card hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>

            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
              <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
              <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
            </div>

            <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
              <h1 className="text-[2.2em] font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Premium
              </h1>
              <p className="text-[0.9em] text-purple-100/90 leading-relaxed font-light">
                Unlock unlimited potential with premium features. Enhanced models, priority support, and exclusive capabilities await your exploration.
              </p>
            </div>

            <button
              onClick={() => setLocation('/pricing')}
              className="relative h-fit w-fit px-[1.4em] py-[0.7em] mt-2 border-[1px] border-purple-300/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-purple-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              <p className="relative z-10 font-medium tracking-wide">Explore Now</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}