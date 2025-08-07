import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-gradient-to-br from-flamingo-100 to-flamingo-200 dark:from-flamingo-900/30 dark:to-flamingo-800/30 rounded-lg flex items-center justify-center mb-6">
      <i className={`${icon} text-flamingo-600 dark:text-flamingo-400 text-xl`}></i>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const ChatPreview = () => (
  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Flamgio AI Chat</span>
      </div>
    </div>
    
    <div className="p-6 space-y-4 h-80 overflow-y-auto">
      <div className="flex justify-end">
        <div className="chat-message-user px-4 py-2 rounded-lg max-w-xs">
          <p className="text-sm">How does your agent system work?</p>
        </div>
      </div>
      
      <div className="flex justify-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              Mixtral-8x7B
            </span>
          </div>
          <div className="chat-message-assistant px-4 py-3 rounded-lg max-w-sm">
            <p className="text-sm">
              <strong>Great question!</strong> Our system intelligently routes your prompts:
            </p>
            <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Short/simple → Local HF models</li>
              <li>Complex/long → Cloud models</li>
              <li>Automatic fallback for reliability</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-start">
        <div className="chat-message-assistant px-4 py-3 rounded-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    if (user) {
      setLocation('/chat');
    } else {
      setIsLoading(true);
      try {
        await login();
        setLocation('/chat');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'flamgio-theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-flamingo-400 to-flamingo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">FA</span>
                </div>
                <button 
                  onClick={() => setLocation('/')}
                  className="text-xl font-bold text-gray-900 dark:text-white hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors"
                >
                  Flamgio AI
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                data-testid="theme-toggle"
                onClick={handleThemeToggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-moon dark:hidden"></i>
                <i className="fas fa-sun hidden dark:inline"></i>
              </button>
              
              <Button
                data-testid="nav-chat-btn"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700 text-white"
              >
                {isLoading ? 'Loading...' : 'Start Chatting'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 flamingo-gradient"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Privacy-First{' '}
                  <span className="bg-gradient-to-r from-flamingo-500 to-flamingo-600 bg-clip-text text-transparent">
                    AI Chat
                  </span>{' '}
                  Platform
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Intelligent agent system combining local Hugging Face models with cloud AI. 
                  Your conversations stay private with our advanced memory system.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  data-testid="get-started-btn"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-flamingo-500 to-flamingo-600 hover:from-flamingo-600 hover:to-flamingo-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  {isLoading ? 'Loading...' : 'Get Started Free'}
                </Button>
                <Button
                  data-testid="watch-demo-btn"
                  variant="outline"
                  size="lg"
                  className="border-2 border-flamingo-500 text-flamingo-600 dark:text-flamingo-400 px-8 py-4 text-lg font-semibold hover:bg-flamingo-50 dark:hover:bg-flamingo-900/20"
                >
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </Button>
              </div>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {[
                  { icon: 'fas fa-shield-alt', text: 'Privacy First' },
                  { icon: 'fas fa-brain', text: 'Smart Routing' },
                  { icon: 'fas fa-memory', text: 'Persistent Memory' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-flamingo-100 dark:bg-flamingo-900/30 rounded-lg flex items-center justify-center">
                      <i className={`${feature.icon} text-flamingo-600 dark:text-flamingo-400`}></i>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <ChatPreview />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-flamingo-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-flamingo-300/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of AI chat with intelligent routing, persistent memory, and privacy-first design.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="fas fa-route"
              title="Smart Agent Routing"
              description="Automatically routes prompts between local Hugging Face models and cloud services for optimal performance and cost efficiency."
            />
            <FeatureCard
              icon="fas fa-database"
              title="PostgreSQL Memory"
              description="User-specific conversation storage with PostgreSQL ensures your chat history is preserved and easily accessible."
            />
            <FeatureCard
              icon="fas fa-tachometer-alt"
              title="Admin Dashboard"
              description="Comprehensive admin panel with user logs, model usage statistics, and system monitoring capabilities."
            />
            <FeatureCard
              icon="fas fa-mobile-alt"
              title="Mobile Responsive"
              description="Seamlessly designed for all devices with a mobile-first approach and intuitive touch interactions."
            />
            <FeatureCard
              icon="fas fa-lock"
              title="Privacy Security"
              description="Your data stays private with secure authentication and encrypted storage for all conversations."
            />
            <FeatureCard
              icon="fas fa-code"
              title="Markdown Support"
              description="Rich text formatting with embedded markdown rendering for code blocks, lists, and highlighted content."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
