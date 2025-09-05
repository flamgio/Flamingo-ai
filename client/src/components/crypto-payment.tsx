import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CryptoPaymentProps {
  onPaymentSelect: (method: string, details: any) => void;
}

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({ onPaymentSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const cryptoMethods = [
    {
      id: 'litecoin',
      name: 'Litecoin (LTC)',
      address: 'LNnHqLTiyQNTsbrSfFEjqMdoKwQuEfk1ra',
      icon: '₿',
      color: 'from-blue-500 to-cyan-500',
      description: 'Fast and secure Litecoin payments'
    },
    {
      id: 'ethereum',
      name: 'Ethereum (ETH)',
      address: '0xF3191e7C53e0dC03D0Faf5CDd3DfDE05a099B5eb',
      icon: 'Ξ',
      color: 'from-purple-500 to-pink-500',
      description: 'Smart contract powered payments'
    }
  ];

  const otherMethods = [
    {
      id: 'nowpayments',
      name: 'NowPayments',
      description: 'Multiple crypto options',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'buymeacoffee',
      name: 'Buy Me A Coffee',
      description: 'Support with coffee',
      icon: '☕',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Payment Method
        </motion.h2>
        <motion.p 
          className="text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Secure, fast, and anonymous payments
        </motion.p>
      </div>

      {/* Crypto Payments Section */}
      <div className="space-y-4">
        <motion.h3 
          className="text-xl font-semibold text-white flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Bitcoin className="w-5 h-5 text-orange-500 animate-pulse" />
          Cryptocurrency Payments
          <Sparkles className="w-4 h-4 text-yellow-400 animate-bounce" />
        </motion.h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {cryptoMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedMethod(method.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className={`text-2xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent font-bold`}>
                        {method.icon}
                      </span>
                      {method.name}
                    </CardTitle>
                    <Badge className={`bg-gradient-to-r ${method.color} text-white border-0`}>
                      Instant
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Wallet Address:</p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-gray-300 font-mono break-all">
                          {method.address}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(method.address);
                          }}
                          className="ml-2 text-blue-400 hover:text-blue-300"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white border-0 font-semibold`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPaymentSelect('crypto', {
                            method: method.id,
                            address: method.address,
                            currency: method.id === 'litecoin' ? 'LTC' : 'ETH'
                          });
                        }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          {method.icon}
                        </motion.div>
                        Pay with {method.name}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Other Payment Methods */}
      <div className="space-y-4">
        <motion.h3 
          className="text-xl font-semibold text-white flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <DollarSign className="w-5 h-5 text-green-500" />
          Alternative Payment Methods
        </motion.h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {otherMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className={`bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                      {method.icon}
                    </span>
                    {method.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white border-0 font-semibold`}
                      onClick={() => onPaymentSelect('external', {
                        method: method.id,
                        name: method.name
                      })}
                    >
                      <span className="mr-2">{method.icon}</span>
                      Pay with {method.name}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Bitcoin Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-10 right-10 text-6xl text-orange-500/10"
        >
          ₿
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [360, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 left-10 text-4xl text-purple-500/10"
        >
          Ξ
        </motion.div>
      </div>
    </div>
  );
};