import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation presets for consistent premium feel
export const animations = {
  // Fade and slide animations
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "power2.out" }
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "power2.out" }
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "power2.out" }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "backOut" }
  },

  // Button hover effects
  buttonHover: {
    whileHover: { 
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },

  // Card animations
  cardHover: {
    whileHover: { 
      y: -5,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    },
    transition: { duration: 0.3, ease: "power2.out" }
  },

  // Message animations
  messageSlideIn: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.4, ease: "power2.out" }
  }
};

// GSAP helper functions
export const gsapUtils = {
  // Typing indicator animation
  typingIndicator: (element: HTMLElement) => {
    const dots = element.querySelectorAll('.typing-dot');
    const tl = gsap.timeline({ repeat: -1 });
    
    dots.forEach((dot, index) => {
      tl.to(dot, {
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      }, index * 0.15)
      .to(dot, {
        y: 0,
        duration: 0.3,
        ease: "power2.in"
      }, index * 0.15 + 0.3);
    });
    
    return tl;
  },

  // Navbar scroll animation
  navbarScroll: (element: HTMLElement) => {
    gsap.to(element, {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      scrollTrigger: {
        trigger: "body",
        start: "100px top",
        end: "bottom bottom",
        toggleActions: "play none none reverse"
      }
    });
  },

  // Theme transition animation
  themeTransition: (isDark: boolean) => {
    const tl = gsap.timeline();
    
    // Create overlay for smooth transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${isDark ? '#1a1a1a' : '#ffffff'};
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    tl.to(overlay, {
      opacity: 0.8,
      duration: 0.2,
      ease: "power2.out"
    })
    .call(() => {
      // Apply theme change here
      document.documentElement.classList.toggle('dark', isDark);
    })
    .to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => overlay.remove()
    });
    
    return tl;
  },

  // Card entrance animation with stagger
  staggerCards: (cards: NodeListOf<Element> | Element[]) => {
    gsap.fromTo(cards, 
      { 
        opacity: 0, 
        y: 50, 
        scale: 0.9 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  },

  // Text reveal animation
  textReveal: (element: HTMLElement) => {
    const text = element.textContent;
    const chars = text?.split('') || [];
    element.innerHTML = chars.map(char => 
      `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    const spans = element.querySelectorAll('span');
    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.02,
      ease: "power2.out"
    });
  },

  // Glow effect animation
  glowEffect: (element: HTMLElement) => {
    gsap.set(element, {
      filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))"
    });
    
    gsap.to(element, {
      filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))",
      duration: 0.3,
      ease: "power2.out",
      paused: true
    });
  }
};

// Utility for creating smooth page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "power2.inOut" }
};

// Loading animation utilities
export const loadingAnimations = {
  spinnerRotation: (element: HTMLElement) => {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: "none"
    });
  },
  
  pulseGlow: (element: HTMLElement) => {
    gsap.to(element, {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }
};