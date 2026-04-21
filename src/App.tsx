// ─── src/App.tsx ──────────────────────────────────────────────────────────────
// Root component. Assembles all sections in order. Mounts the custom cursor.
// No logic lives here beyond layout assembly and cursor tracking.
// Section order: Navbar → Hero → About → Projects → Skills → Contact → Footer.

import { useEffect, useRef, useCallback } from 'react';
import Navbar   from './components/Navbar';
import Hero     from './components/Hero';
import About    from './components/About';
import Projects from './components/Projects';
import Skills   from './components/Skills';
import Contact  from './components/Contact';
import Footer   from './components/Footer';

// ─── Custom cursor component (PRD §7) ────────────────────────────────────────
// A small 8px dot that follows the mouse via CSS transform.
// Scales to 32px ring on hover over interactive elements.
// CSS transform only — no layout impact. Respects prefers-reduced-motion
// by checking the media query directly (cursor is outside Framer Motion).
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference once on mount
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Track mouse position via requestAnimationFrame for performance ─────────
  // Using RAF prevents layout thrashing from rapid mousemove events.
  const rafId = useRef<number>(0);
  const pos   = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(calc(${pos.current.x}px - 50%), calc(${pos.current.y}px - 50%))`;
      }
    });
  }, []);

  // ── Scale cursor on hover over interactive elements ────────────────────────
  const onMouseEnter = useCallback(() => {
    cursorRef.current?.classList.add('cursor-hover');
  }, []);

  const onMouseLeave = useCallback(() => {
    cursorRef.current?.classList.remove('cursor-hover');
  }, []);

  useEffect(() => {
    // Skip custom cursor entirely if user prefers reduced motion
    if (prefersReduced) return;

    // Interactive elements that trigger the expanded cursor ring
    const interactives = document.querySelectorAll(
      'a, button, [role="article"], input, textarea'
    );

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [prefersReduced, onMouseMove, onMouseEnter, onMouseLeave]);

  // Don't render the cursor element at all if reduced motion is preferred
  if (prefersReduced) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
    />
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* ── Custom dot cursor — rendered outside main for fixed stacking ──── */}
      <CustomCursor />

      {/* ── Fixed navbar — sits above all sections ───────────────────────── */}
      <Navbar />

      {/* ── Page sections — single scrollable column ─────────────────────── */}
      <main>
        {/* Full-viewport hero with name reveal and marquee */}
        <Hero />

        {/* Two-column about with pull quote and stats */}
        <About />

        {/* Numbered editorial project rows */}
        <Projects />

        {/* Three-column skill chip grid */}
        <Skills />

        {/* Two-column contact with Formspree form */}
        <Contact />
      </main>

      {/* ── Footer — outside <main> per HTML semantics ───────────────────── */}
      <Footer />
    </>
  );
}
