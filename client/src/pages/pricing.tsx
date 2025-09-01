import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const handleBackToDashboard = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Back Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Dashboard
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your AI Plan
          </h1>
          <p className="text-white/70 text-lg">
            Unlock the power of artificial intelligence
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card">
              <div className="title">Free Plan</div>
              <div className="pricing">
                $0<span className="pricing-time">/month</span>
              </div>
              <div className="sub-title">Perfect for getting started</div>
              <ul className="list">
                <li className="list-item">
                  <span className="check">✓</span>
                  Basic AI chat conversations
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Quick responses for simple questions
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Limited daily conversations
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Standard response quality
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Basic text generation
                </li>
              </ul>
              <button className="button" onClick={() => setLocation('/dashboard')}>
                <span className="text-button">Current Plan</span>
              </button>
            </div>
          </motion.div>

          {/* Paid Plan */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card">
              <div className="title">Premium Plan</div>
              <div className="pricing">
                $19<span className="pricing-time">/month</span>
              </div>
              <div className="sub-title">For power users and professionals</div>
              <ul className="list">
                <li className="list-item">
                  <span className="check">✓</span>
                  Unlimited AI conversations
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Advanced AI reasoning and analysis
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Priority response speed
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Enhanced creativity and writing
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Complex problem solving
                </li>
                <li className="list-item">
                  <span className="check">✓</span>
                  Premium support
                </li>
              </ul>
              <button className="button" onClick={() => alert('Upgrade coming soon!')}>
                <span className="text-button">Upgrade Now</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}