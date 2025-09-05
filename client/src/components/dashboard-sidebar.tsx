import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.png';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function DashboardSidebar({ isCollapsed, onToggle, className }: DashboardSidebarProps) {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const navigation = [
    {
      name: 'Chat',
      icon: 'fas fa-comments',
      path: '/chat',
      active: location.startsWith('/chat')
    },
    {
      name: 'Premium',
      icon: 'fas fa-crown',
      path: '/pricing',
      active: location === '/pricing'
    },
    {
      name: 'Dashboard',
      icon: 'fas fa-home',
      path: '/dashboard',
      active: location === '/dashboard'
    },
    {
      name: 'Screen Time Analysis',
      icon: 'fas fa-chart-line',
      path: '/screen-time',
      active: location === '/screen-time'
    },
    {
      name: 'Settings',
      icon: 'fas fa-cog',
      path: '/settings',
      active: location === '/settings'
    },
    {
      name: 'Help',
      icon: 'fas fa-question-circle',
      path: '/help',
      active: location === '/help'
    }
  ];

  return (
    <div className={cn(
      "h-screen bg-gradient-to-b from-black via-purple-900/20 to-black border-r border-purple-500/20 backdrop-blur-xl transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-purple-500/20">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-full"
            data-testid="logo-btn"
          >
            <img 
              src={logoImg} 
              alt="Flamingo AI" 
              className="h-8 w-8 rounded-lg shadow-lg shadow-white/20" 
            />
            {!isCollapsed && (
              <span className="text-white text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Flamingo AI
              </span>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            data-testid="sidebar-toggle"
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setLocation(item.path)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                item.active 
                  ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-400/30 shadow-lg" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              data-testid={`nav-${item.name.toLowerCase()}`}
            >
              <i className={`${item.icon} text-lg ${item.active ? 'text-purple-300' : 'text-white/70 group-hover:text-white'}`}></i>
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Social Media Links */}
        <div className="px-4 py-3 border-t border-purple-500/20">
          {!isCollapsed && (
            <div className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">
              Connect With Us
            </div>
          )}
          <div className={cn("flex gap-3", isCollapsed ? "justify-center" : "justify-start")}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-pink-500/30"
              data-testid="instagram-link"
              title="Follow us on Instagram"
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a
              href="https://github.com/flamgio/Flamingo-ai.git"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-gray-500/30"
              data-testid="github-link"
              title="View source on GitHub"
            >
              <i className="fab fa-github text-sm"></i>
            </a>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-500/20">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            data-testid="logout-btn"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}