import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoImg from "@/assets/logo.png";
import { ParallaxPageWrapper, ParallaxAnimation } from "@/components/parallax-animation";
import { CryptoPayment } from "@/components/crypto-payment";

export default function Pricing() {
  const [, setLocation] = useLocation();
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
              <div className="space-y-3">
                <button className="button" onClick={handleUpgradeClick}>
                  <span className="text-button">Choose Payment Method</span>
                </button>
                <button 
                  className="crypto-btc-button w-full"
                  onClick={() => setShowCryptoModal(true)}
                >
                  <span className="box">
                    Buy BTC
                    <div className="star-1">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                    <div className="star-2">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                    <div className="star-3">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                    <div className="star-4">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                    <div className="star-5">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                    <div className="star-6">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>bitcoin</title><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>
                    </div>
                  </span>
                </button>
              </div>
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