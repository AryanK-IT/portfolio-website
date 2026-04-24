// ─── src/App.tsx ──────────────────────────────────────────────────────────────
// Root component. Assembles all sections in order. Mounts the custom cursor.
// HeroGrid is rendered at root level as a fixed full-page background canvas.
// Section order: Navbar → Hero → About → Projects → Skills → Contact → Footer.

import { useEffect, useRef, useCallback } from 'react';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import About         from './components/About';
import Projects      from './components/Projects';
import Skills        from './components/Skills';
import Contact       from './components/Contact';
import Footer        from './components/Footer';
import HeroGrid      from './components/HeroGrid';

// ─── Custom cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const onMouseEnter = useCallback(() => {
    cursorRef.current?.classList.add('cursor-hover');
  }, []);

  const onMouseLeave = useCallback(() => {
    cursorRef.current?.classList.remove('cursor-hover');
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;
    if (prefersReduced) return;

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

  if (prefersReduced) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Fixed full-page grid background — sits behind everything */}
      <HeroGrid />

      <CustomCursor />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
