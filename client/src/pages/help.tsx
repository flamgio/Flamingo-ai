import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useState } from "react";

export default function Help() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');

  if (!user) {
    setLocation('/login');
    return null;
  }

  const faqData = [
    {
      question: "How do I start a conversation?",
      answer: "Click on 'Chat Premium' in the sidebar to start chatting with our AI. You can ask questions, request assistance, or have casual conversations."
    },
    {
      question: "What AI models are available?",
      answer: "Flamingo AI uses intelligent routing between local Hugging Face models and cloud-based models including GPT, Claude, and Mixtral for optimal responses."
    },
    {
      question: "How does the pricing work?",
      answer: "We offer a free plan with basic features and a $5/month premium plan with unlimited conversations, advanced AI models, and priority support."
    },
    {
      question: "Is my data private?",
      answer: "Yes! Flamingo AI is privacy-first. Your conversations are stored securely and are never used to train other models or shared with third parties."
    },
    {
      question: "Can I delete my chat history?",
      answer: "Absolutely. Go to Settings and you can clear individual conversations or your entire chat history at any time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept traditional payment methods (cards, PayPal) and cryptocurrency (Bitcoin, Ethereum, Litecoin) for maximum flexibility."
    }
  ];

  const troubleshootingData = [
    {
      issue: "AI not responding",
      solution: "Check your internet connection and try refreshing the page. If the issue persists, the AI service may be temporarily unavailable."
    },
    {
      issue: "Messages not saving",
      solution: "Ensure you're logged in and have a stable connection. Messages are automatically saved when sent successfully."
    },
    {
      issue: "Dark mode not working",
      solution: "Try toggling the theme switch in Settings or the navigation bar. Clear your browser cache if the issue continues."
    },
    {
      issue: "Payment not processing",
      solution: "Verify your payment details and ensure you have sufficient funds. For crypto payments, check the transaction on the blockchain."
    }
  ];

  const contactInfo = [
    {
      title: "Email Support",
      description: "Get help via email",
      contact: "support@flamingo-ai.com",
      icon: "fas fa-envelope"
    },
    {
      title: "Community Discord",
      description: "Join our community",
      contact: "discord.gg/flamingo-ai",
      icon: "fab fa-discord"
    },
    {
      title: "GitHub",
      description: "Report bugs or contribute",
      contact: "github.com/flamingo-ai",
      icon: "fab fa-github"
    }
  ];

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-purple-500/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-purple-100/70 mt-1">Find answers and get support</p>
            </div>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="back-to-dashboard"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Help Content */}
        <div className="relative z-10 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="max-w-4xl mx-auto">
            
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              {[
                { id: 'faq', name: 'FAQ', icon: 'fas fa-question-circle' },
                { id: 'troubleshooting', name: 'Troubleshooting', icon: 'fas fa-tools' },
                { id: 'contact', name: 'Contact Us', icon: 'fas fa-headset' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-purple-600/20 text-purple-200 hover:bg-purple-600/30'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {faqData.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <i className="fas fa-question text-purple-300 mr-3"></i>
                      {faq.question}
                    </h3>
                    <p className="text-purple-100/80 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Troubleshooting Tab */}
            {activeTab === 'troubleshooting' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {troubleshootingData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <i className="fas fa-exclamation-triangle text-yellow-400 mr-3"></i>
                      {item.issue}
                    </h3>
                    <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                      <h4 className="text-green-300 font-medium mb-2 flex items-center">
                        <i className="fas fa-lightbulb mr-2"></i>
                        Solution:
                      </h4>
                      <p className="text-green-100/90">{item.solution}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-6 text-center hover:scale-105 transition-transform"
                    >
                      <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className={`${contact.icon} text-purple-300 text-2xl`}></i>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{contact.title}</h3>
                      <p className="text-purple-100/70 text-sm mb-4">{contact.description}</p>
                      <div className="bg-purple-900/30 rounded-lg p-3">
                        <p className="text-purple-200 font-mono text-sm">{contact.contact}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg p-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <i className="fas fa-paper-plane mr-3 text-purple-300"></i>
                    Send us a Message
                  </h3>
                  
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200/70 text-sm font-medium mb-2">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-purple-900/30 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-purple-200/70 text-sm font-medium mb-2">Email</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-2 bg-purple-900/30 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-purple-200/70 text-sm font-medium mb-2">Subject</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-purple-900/30 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="What can we help you with?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-purple-200/70 text-sm font-medium mb-2">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-2 bg-purple-900/30 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe your issue or question in detail..."
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                      data-testid="send-message"
                    >
                      <i className="fas fa-send mr-2"></i>
                      Send Message
                    </Button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}