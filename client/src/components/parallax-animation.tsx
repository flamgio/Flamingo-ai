import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxAnimationProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxAnimation: React.FC<ParallaxAnimationProps> = ({
  children,
  className = "",
  speed = 0.5,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = () => {
    const movement = speed * 100;
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [movement, -movement]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-movement, movement]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [movement, -movement]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-movement, movement]);
      default:
        return useTransform(scrollYProgress, [0, 1], [movement, -movement]);
    }
  };

  const transform = getTransform();

  const getMotionStyle = () => {
    if (direction === 'left' || direction === 'right') {
      return { x: transform };
    }
    return { y: transform };
  };

  return (
    <motion.div
      ref={ref}
      className={`parallax-element ${className}`}
      style={getMotionStyle()}
    >
      {children}
    </motion.div>
  );
};

// Background Particles Component with Parallax
export const ParallaxParticles: React.FC = () => {
  return (
    <div className="flamingo-particles">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <ParallaxAnimation
          key={i}
          speed={0.2 + (i * 0.1)}
          direction={i % 2 === 0 ? 'up' : 'down'}
          className={`particle particle-${i}`}
        >
          <div></div>
        </ParallaxAnimation>
      ))}
    </div>
  );
};

// Parallax Background Elements
export const ParallaxBackground: React.FC = () => {
  return (
    <>
      <ParallaxAnimation speed={0.3} direction="up" className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse">
        <div></div>
      </ParallaxAnimation>
      <ParallaxAnimation speed={0.4} direction="down" className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse">
        <div></div>
      </ParallaxAnimation>
      <ParallaxAnimation speed={0.2} direction="left" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent">
        <div></div>
      </ParallaxAnimation>
    </>
  );
};

// Enhanced Page Wrapper with Parallax
export const ParallaxPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="parallax-container flamingo-container">
      <ParallaxBackground />
      {children}
      <ParallaxParticles />
    </div>
  );
};