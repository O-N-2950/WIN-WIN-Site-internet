/**
 * Configurations d'animations réutilisables avec Framer Motion
 * Optimisées pour la performance et l'accessibilité
 */

// Variants pour les animations d'entrée
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
  viewport: { once: true, margin: "-100px" }
};

// Container avec stagger pour animer les enfants séquentiellement
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerContainerFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Animations de hover pour les cartes
export const cardHover = {
  rest: { scale: 1, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  hover: { 
    scale: 1.03, 
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const cardHoverSubtle = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Animations de hover pour les boutons
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

export const buttonGlow = {
  rest: { boxShadow: "0 0 0 0 rgba(49, 118, 166, 0)" },
  hover: { 
    boxShadow: "0 0 20px 5px rgba(49, 118, 166, 0.3)",
    transition: { duration: 0.3 }
  }
};

// Animations d'icônes
export const iconFloat = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const iconRotate = {
  rest: { rotate: 0 },
  hover: { 
    rotate: 360,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

export const iconBounce = {
  rest: { scale: 1 },
  hover: { 
    scale: [1, 1.2, 1],
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// Animations de page
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }
};

// Animations de loading
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spinAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Animations de scroll reveal
export const revealFromBottom = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  viewport: { once: true, margin: "-50px" }
};

export const revealFromLeft = {
  initial: { opacity: 0, x: -100 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  viewport: { once: true, margin: "-50px" }
};

export const revealFromRight = {
  initial: { opacity: 0, x: 100 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  viewport: { once: true, margin: "-50px" }
};

// Animations de parallaxe (à utiliser avec useScroll de Framer Motion)
export const parallaxConfig = {
  slow: { y: [0, -50] },
  medium: { y: [0, -100] },
  fast: { y: [0, -150] }
};

// Animation de compteur (pour AnimatedCounter)
export const counterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Animations de badge/tag
export const badgePulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Animations de liste (pour items dans une liste)
export const listItemVariant = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

// Configuration pour respecter prefers-reduced-motion
export const getAnimationConfig = () => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 }
      };
    }
  }
  return null;
};
