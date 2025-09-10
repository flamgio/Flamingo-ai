/**
 * Flamingo AI Design Tokens - S-Tier Neon-Dark Theme
 * Based on reference design with #0c0c0c background and neon green accents
 */

export const designTokens = {
  // Base Colors - Neon Dark Theme
  colors: {
    // Core dark theme
    dark: {
      900: '#0c0c0c', // Primary background
      800: '#1a1a1a', // Card backgrounds
      700: '#2a2a2a', // Elevated surfaces
      600: '#3a3a3a', // Borders, dividers
      500: '#4a4a4a', // Subtle elements
      400: '#6a6a6a', // Muted text
      300: '#8a8a8a', // Secondary text
      200: '#aaaaaa', // Disabled states
      100: '#cccccc', // Light text on dark
      50: '#ffffff'   // Primary text, pure white
    },
    
    // Neon Green - Primary accent color
    neonGreen: {
      900: '#1a5c1a', // Dark green
      800: '#2d7a2d', // 
      700: '#3d9a3d', // 
      600: '#4ade80', // Medium green
      500: '#22c55e', // Main neon green
      400: '#4ade80', // Bright green
      300: '#86efac', // Light green
      200: '#bbf7d0', // Very light green
      100: '#dcfce7', // Pale green
      50: '#f0fdf4'   // Almost white green
    },
    
    // Supporting colors
    accent: {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      red: '#ef4444',
      yellow: '#eab308'
    },
    
    // Status colors with glow
    status: {
      success: '#22c55e',
      warning: '#eab308', 
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // Typography System
  typography: {
    fonts: {
      primary: '"Inter", "Plus Jakarta Sans", "Work Sans", system-ui, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace'
    },
    
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // Spacing System (8px base)
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem'      // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px'
  },

  // Shadows & Glows - Key for neon effect
  shadows: {
    // Standard shadows
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Neon glow effects
    neonSm: '0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.1)',
    neonMd: '0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)',
    neonLg: '0 0 15px rgba(34, 197, 94, 0.5), 0 0 30px rgba(34, 197, 94, 0.3)',
    neonXl: '0 0 25px rgba(34, 197, 94, 0.6), 0 0 50px rgba(34, 197, 94, 0.4)',
    
    // Inner glows
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    innerGlowNeon: 'inset 0 1px 0 rgba(34, 197, 94, 0.2)'
  },

  // Animation Settings
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms', 
      slow: '500ms',
      slower: '750ms',
      slowest: '1000ms'
    },
    
    easing: {
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)', 
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elasticOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Component Tokens
  components: {
    button: {
      // Neon button (like "View Full Report" in reference)
      neon: {
        bg: 'transparent',
        border: '1px solid #22c55e',
        text: '#22c55e',
        shadow: '0 0 10px rgba(34, 197, 94, 0.3)',
        hoverBg: 'rgba(34, 197, 94, 0.1)',
        hoverShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
        padding: '12px 24px',
        borderRadius: '8px'
      },
      
      // Primary solid button
      primary: {
        bg: '#22c55e',
        text: '#0c0c0c', 
        shadow: '0 0 15px rgba(34, 197, 94, 0.4)',
        hoverShadow: '0 0 25px rgba(34, 197, 94, 0.6)'
      }
    },
    
    card: {
      // Analytics card (like reference image)
      analytics: {
        bg: '#1a1a1a',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        padding: '24px',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
      }
    },
    
    input: {
      bg: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid #3a3a3a',
      focusBorder: '1px solid #22c55e',
      focusGlow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
      text: '#ffffff'
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export default designTokens;