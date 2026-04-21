// ─── src/lib/variants.ts ─────────────────────────────────────────────────────
// Shared Framer Motion animation variants used across all components.
// Named exports only — components import exactly what they need.
// All variants accept a custom delay index `i` for staggered animations.
// PRD §7: useReducedMotion() is applied in each component; when true,
// these variants are replaced with opacityOnly (defined below).

import type { Variants } from 'framer-motion';

// ─── fadeUp ──────────────────────────────────────────────────────────────────
// Standard upward reveal with opacity. Used for paragraphs, chips, labels.
// `i` = stagger index (0, 1, 2 …) — each adds 100ms of delay.
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// ─── clipReveal ──────────────────────────────────────────────────────────────
// Clip-path reveal from bottom — used for Hero name lines (ARYAN / KUMAR.)
// Creates the "text wipes in from below" editorial effect (PRD §6.2).
// `i` = stagger index — each line adds 150ms of delay.
export const clipReveal: Variants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    y: 20,
  },
  visible: (i: number = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// ─── slideLeft ───────────────────────────────────────────────────────────────
// Horizontal slide from left + fade in. Used for left-column content
// in About and Contact sections (PRD §6.3, §6.6).
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

// ─── scaleIn ─────────────────────────────────────────────────────────────────
// Scale + opacity reveal — used for skill chips (PRD §6.5).
// `i` = stagger index — 40ms between each chip.
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.04,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// ─── rowReveal ───────────────────────────────────────────────────────────────
// Project row entrance — y slide + opacity, staggered 100ms per row (PRD §6.4).
export const rowReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// ─── lineReveal ──────────────────────────────────────────────────────────────
// Horizontal divider line animates scaleX 0 → 1 from the left (PRD §6.4).
export const lineReveal: Variants = {
  hidden: {
    scaleX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ─── mobileMenuVariants ──────────────────────────────────────────────────────
// Full-screen mobile nav overlay open/close (PRD §6.1).
export const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

// ─── mobileNavLink ───────────────────────────────────────────────────────────
// Individual nav link stagger inside mobile overlay.
export const mobileNavLink: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1 + i * 0.08,
      ease: 'easeOut',
    },
  }),
};

// ─── opacityOnly ─────────────────────────────────────────────────────────────
// Reduced-motion fallback — used in every component when useReducedMotion()
// returns true. Strips all x/y/scale transforms; opacity only (PRD §7).
export const opacityOnly: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
    },
  }),
};
