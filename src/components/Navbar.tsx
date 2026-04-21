// ─── src/components/Navbar.tsx ────────────────────────────────────────────────
// Fixed top navbar. Transparent by default, blurs on scroll > 60px.
// Desktop: monogram left, nav links + icon links right.
// Mobile (<768px): hamburger → full-screen AnimatePresence overlay.
// All copy from content.ts. No inline strings.

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, X, Menu } from 'lucide-react';
import { meta, navLinks } from '../data/content';
import {
  mobileMenuVariants,
  mobileNavLink,
  opacityOnly,
} from '../lib/variants';

// ─── Navbar component ─────────────────────────────────────────────────────────
export default function Navbar() {
  // Track scroll position to apply backdrop blur after 60px (PRD §6.1)
  const [scrolled, setScrolled] = useState(false);

  // Mobile menu open/closed state
  const [menuOpen, setMenuOpen] = useState(false);

  // Respect prefers-reduced-motion — strip transforms when true
  const shouldReduceMotion = useReducedMotion();

  // ─── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Lock body scroll when mobile menu is open ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ─── Close menu on anchor click ───────────────────────────────────────────
  const handleNavClick = () => setMenuOpen(false);

  // ─── Choose variants based on reduced-motion preference ───────────────────
  const menuVariants   = shouldReduceMotion ? opacityOnly : mobileMenuVariants;
  const linkVariants   = shouldReduceMotion ? opacityOnly : mobileNavLink;

  return (
    <>
      {/* ── Fixed navbar bar ──────────────────────────────────────────────── */}
      <header
        style={{
          // Smooth 300ms transition on background/backdrop per PRD §6.1
          transition: 'background 300ms ease, backdrop-filter 300ms ease',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        }}
        className="fixed top-0 left-0 right-0 z-40 h-[72px] flex items-center"
      >
        <nav className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* ── Left: AK monogram (PRD §6.1) ───────────────────────────── */}
          <a
            href="#hero"
            aria-label="Aryan Kumar — back to top"
            className="font-display text-[22px] tracking-[2px] text-[color:var(--text-primary)] hover:text-[color:var(--accent)] transition-colors duration-200"
            onClick={handleNavClick}
          >
            AK
          </a>

          {/* ── Desktop right: nav links + icon links ───────────────────── */}
          <div className="hidden md:flex items-center gap-8">

            {/* Nav anchor links */}
            <ul className="flex items-center gap-6" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-[13px] font-normal uppercase tracking-[1.5px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Vertical divider */}
            <span
              aria-hidden="true"
              className="w-px h-4 bg-[color:var(--border)]"
            />

            {/* GitHub icon link */}
            <a
              href={meta.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
            >
              <Github size={16} strokeWidth={1.5} />
            </a>

            {/* LinkedIn icon link */}
            <a
              href={meta.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
            >
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
          </div>

          {/* ── Mobile: hamburger button ─────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="md:hidden text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200 z-[60] relative"
          >
            {/* Show X when open, Menu when closed */}
            {menuOpen
              ? <X size={22} strokeWidth={1.5} />
              : <Menu size={22} strokeWidth={1.5} />
            }
          </button>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay (PRD §6.1) ───────────────────────────── */}
      {/* AnimatePresence handles mount/unmount animation on open/close.         */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="mobile-menu-overlay"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-modal="true"
            role="dialog"
            aria-label="Navigation menu"
          >
            {/* Centered vertical nav links */}
            <ul className="flex flex-col items-center gap-8" role="list">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className="font-display text-[clamp(2.5rem,8vw,4rem)] text-[color:var(--text-primary)] hover:text-[color:var(--accent)] transition-colors duration-200 tracking-widest"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Social icons at bottom of mobile menu */}
            <motion.div
              className="absolute bottom-12 flex items-center gap-6"
              custom={navLinks.length}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                onClick={handleNavClick}
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
              >
                <Github size={20} strokeWidth={1.5} />
              </a>
              <a
                href={meta.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                onClick={handleNavClick}
                className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
