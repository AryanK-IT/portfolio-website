import type { Config } from 'tailwindcss';

// ─── Tailwind v3 configuration ────────────────────────────────────────────────
// Extends the default theme with CSS variable tokens defined in globals.css.
// This allows writing e.g. `bg-bg`, `text-accent`, `border-border` in JSX
// while the actual values remain in one place (the CSS variables).
const config: Config = {
  // Scan all source files for class usage — enables JIT purging
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  theme: {
    extend: {
      // ─── Color tokens — all map to CSS variables ────────────────────
      colors: {
        bg:             'var(--bg)',
        'bg-card':      'var(--bg-card)',
        'bg-hover':     'var(--bg-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        accent:         'var(--accent)',
        border:         'var(--border)',
      },

      // ─── Font families matching Google Fonts loaded in index.html ───
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      // ─── Custom screen breakpoints per PRD §8 ──────────────────────
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },

  plugins: [],
};

export default config;
