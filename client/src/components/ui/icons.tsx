// Custom icons - Human curated design system
import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8'
};

export const FlamingoIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-pink-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg ${className}`}>
    <span className="text-white text-xs font-bold">F</span>
  </div>
);

export const ChatIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}>
    <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  </div>
);

export const AIIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}>
    <svg className="w-3 h-3 text-white group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

export const SecurityIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}>
    <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  </div>
);

export const SparkleIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse ${className}`}>
    <svg className="w-3 h-3 text-white group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  </div>
);

export const HumanMadeIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group relative ${className}`}>
    <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
  </div>
);