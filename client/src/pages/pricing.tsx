import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import logoImg from "@/assets/logo.png";
import { ParallaxPageWrapper, ParallaxAnimation } from "@/components/parallax-animation";
import { CryptoPayment } from "@/components/crypto-payment";
import { Moon, Sun } from "lucide-react";
import "../styles/new-theme-toggle.css";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleBackToDashboard = () => {
    setLocation('/dashboard');
  };

  const handleUpgradeClick = () => {
    setShowPaymentOptions(true);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} address copied to clipboard!`);
  };

  return (
    <ParallaxPageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-black overflow-hidden relative">
      {/* Header Controls - Top Right */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
        <div className="toggle-cont-small">
          <input 
            type="checkbox" 
            className="toggle-input" 
            checked={theme === 'dark'}
            onChange={toggleTheme}
            data-testid="theme-toggle"
          />
          <label className="toggle-label-small">
            <div className="cont-icon">
              <div className="sparkle" style={{"--deg": "45", "--duration": "3"} as React.CSSProperties}></div>
              <div className="sparkle" style={{"--deg": "90", "--duration": "3"} as React.CSSProperties}></div>
              <div className="sparkle" style={{"--deg": "135", "--duration": "3"} as React.CSSProperties}></div>
              <div className="sparkle" style={{"--deg": "180", "--duration": "3"} as React.CSSProperties}></div>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            </div>
          </label>
        </div>
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
          data-testid="button-back"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Dashboard
        </Button>
      </div>

      {/* Logo - Top Left */}
      <button 
        onClick={() => setLocation('/')}
        className="fixed top-6 left-6 z-50 flex items-center space-x-3 hover:opacity-80 transition-opacity"
      >
        <img 
          src={logoImg} 
          alt="Flamingo" 
          className="h-12 w-12 rounded-lg shadow-lg shadow-white/20" 
        />
        <span className="text-white text-xl font-bold">Flamingo</span>
      </button>

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
            Choose Your Plan
          </h1>
          <p className="text-white/70 text-lg">
            Unlock the power of intelligent technology
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
                  Basic intelligent conversations
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
                $5<span className="pricing-time">/month</span>
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
              <button className="button" onClick={() => setShowCryptoModal(true)}>
                <span className="text-button">Choose Payment Method</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Crypto Payment Modal */}
        {showCryptoModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-purple-200 dark:border-purple-500/30">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <i className="fab fa-bitcoin text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Crypto Payment</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose your preferred cryptocurrency</p>
              </div>
              
              <div className="space-y-4">
                {/* Ethereum */}
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i className="fab fa-ethereum text-white text-sm"></i>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Ethereum</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ETH - $5.00</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('0xF3191e7C53e0dC03D0Faf5CDd3DfDE05a099B5eb', 'Ethereum')}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                    >
                      Copy Address
                    </button>
                  </div>
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-600 rounded text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                    0xF3191e7C53e0dC03D0Faf5CDd3DfDE05a099B5eb
                  </div>
                </div>

                {/* Litecoin */}
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">L</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Litecoin</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">LTC - $5.00</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('LNnHqLTiyQNTsbrSfFEjqMdoKwQuEfk1ra', 'Litecoin')}
                      className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-colors"
                    >
                      Copy Address
                    </button>
                  </div>
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-600 rounded text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                    LNnHqLTiyQNTsbrSfFEjqMdoKwQuEfk1ra
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowCryptoModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Options Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-purple-200 dark:border-purple-500/30">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Choose Payment Method</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setShowPaymentOptions(false);
                    setShowCryptoModal(true);
                  }}
                  className="w-full p-4 border-2 border-orange-200 dark:border-orange-500/30 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <i className="fab fa-bitcoin text-white animate-spin"></i>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">Cryptocurrency</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Bitcoin, Ethereum, Litecoin</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => alert('NowPayments integration coming soon!')}
                  className="w-full p-4 border-2 border-blue-200 dark:border-blue-500/30 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-credit-card text-white"></i>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">Traditional Payment</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Cards, PayPal, UPI</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowPaymentOptions(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </ParallaxPageWrapper>
  );
}