// ─── src/components/About.tsx ────────────────────────────────────────────────
// About section with sticky scroll theater.
// The entire section pins to the viewport while the left pull-quote words
// highlight one by one as the user scrolls. The right column (paragraphs)
// is fully visible and static throughout. Once all words are highlighted,
// the whole section unpins and scrolls away as one unit.
// Stats strip sits outside the sticky panel and scrolls normally.
//
// WHY JS-DRIVEN FIXED POSITIONING (not CSS position:sticky):
// globals.css declares `overflow-x: hidden` on both `html` and `body`.
// In all major browsers, overflow:hidden on a scroll-container ancestor
// breaks position:sticky — the element behaves like position:relative and
// scrolls with the page. Since globals.css must not be modified (PRD §Files),
// we use a JS approach: track the wrapper's position via getBoundingClientRect
// on scroll events, and toggle the panel between position:fixed (pinned)
// and position:absolute (released) manually. This is 100% reliable regardless
// of overflow settings on ancestors.
//
// PRD §Bug-2: ScrollTheater removed; this component owns the animation.

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { about } from '../data/content';
import { fadeUp, lineReveal, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Navbar height — keeps pinned panel below the fixed bar
const NAVBAR_H = 72;

// How many vh of scroll room the wrapper provides (controls pin duration)
const WRAPPER_VH = 300;

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const statsReveal = useScrollReveal(0.2);

  // Flatten pull-quote into individual words
  const words = about.pullQuote.join(' ').split(' ');

  type WS = { opacity: number };
  const dimAll  = (): WS[] => words.map(() => ({ opacity: 0.12 }));
  const fullAll = (): WS[] => words.map(() => ({ opacity: 1    }));

  const [wordStates, setWordStates] = useState<WS[]>(
    shouldReduceMotion ? fullAll() : dimAll()
  );

  // ── JS-driven pin state ─────────────────────────────────────────────────────
  // 'before'  — wrapper not yet in view; panel sits at top of wrapper (absolute)
  // 'pinned'  — panel is fixed to viewport while user scrolls through wrapper
  // 'after'   — user has scrolled past wrapper; panel sits at bottom (absolute)
  type PinState = 'before' | 'pinned' | 'after';
  const [pinState, setPinState] = useState<PinState>('before');

  const updatePin = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const { top, height } = wrapper.getBoundingClientRect();
    const panelH = window.innerHeight - NAVBAR_H;

    // top < NAVBAR_H  → wrapper top edge has scrolled past navbar → pin
    // top < NAVBAR_H - (height - panelH) → wrapper bottom edge is at navbar → release
    const pinStart = NAVBAR_H;
    const pinEnd   = NAVBAR_H - (height - panelH);

    if (top >= pinStart) {
      setPinState('before');
    } else if (top <= pinEnd) {
      setPinState('after');
    } else {
      setPinState('pinned');
    }

    // Also update word highlights from scroll progress
    if (!shouldReduceMotion) {
      // progress: 0 when pinning starts, 1 when pinning ends
      const scrolled  = pinStart - top;               // px scrolled into the pin zone
      const pinLength = height - panelH;              // total px the pin lasts
      const p = Math.min(1, Math.max(0, scrolled / Math.max(1, pinLength)));

      setWordStates(
        words.map((_, i) => {
          const threshold = i / Math.max(words.length - 1, 1);
          const dist = p - threshold;
          let opacity: number;
          if (dist >= -0.05) {
            opacity = dist > 0.15 ? 0.25 : 1;
          } else {
            opacity = 0.12;
          }
          return { opacity };
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion, words.length]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setWordStates(fullAll());
      return;
    }

    window.addEventListener('scroll', updatePin, { passive: true });
    // Run once on mount so initial state is correct
    updatePin();

    return () => window.removeEventListener('scroll', updatePin);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion, updatePin]);

  const fadeVariant = shouldReduceMotion ? opacityOnly : fadeUp;

  // ── Reduced motion: plain static layout ──────────────────────────────────────
  if (shouldReduceMotion) {
    return (
      <section
        id="about"
        className="px-6 lg:px-12 py-24 lg:py-32"
        aria-label="About Aryan Kumar"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-[1400px] mx-auto">

          <div className="overflow-hidden mb-16 lg:mb-20">
            <motion.div
              className="divider-line h-px bg-[color:var(--border)] w-full"
              variants={opacityOnly}
              initial="hidden"
              animate="visible"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 lg:mb-28">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[3px] text-[color:var(--text-secondary)] mb-8">
                ABOUT —
              </p>
              <div
                className="font-display text-[clamp(2.8rem,5vw,4rem)] leading-[1.0]"
                aria-label={about.pullQuote.join(' ')}
              >
                {about.pullQuote.map((line) => (
                  <div
                    key={line}
                    style={{ color: line === about.accentWord ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5">
              {about.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className="font-sans text-[15px] font-light leading-[1.75] text-[color:var(--text-secondary)]"
                  variants={opacityOnly}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            className="divider-line h-px bg-[color:var(--border)] w-full mb-8"
            variants={opacityOnly}
            initial="hidden"
            animate={statsReveal.isInView ? 'visible' : 'hidden'}
          />

          <motion.div
            ref={statsReveal.ref}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
            variants={opacityOnly}
            initial="hidden"
            animate={statsReveal.isInView ? 'visible' : 'hidden'}
            custom={0}
            aria-label="Education details"
          >
            {about.stats.map((stat, i) => (
              <div key={stat} className="flex items-center gap-6">
                <span className="font-mono text-[11px] tracking-[1px] text-[color:var(--text-secondary)] uppercase">
                  {stat}
                </span>
                {i < about.stats.length - 1 && (
                  <span aria-hidden="true" className="font-mono text-[11px] text-[color:var(--border)]">·</span>
                )}
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    );
  }

  // ── Full sticky layout ────────────────────────────────────────────────────────
  // Outer wrapper is tall so the user scrolls through it while the panel is pinned.
  // The panel uses JS-driven fixed/absolute positioning (see file header comment).
  const panelH = `calc(100vh - ${NAVBAR_H}px)`;

  // Panel style changes based on pin state:
  // before  → absolute, top:0 (sits at the top of the wrapper, scrolls with it until triggered)
  // pinned  → fixed, top:NAVBAR_H (locked to viewport)
  // after   → absolute, bottom:0 (sits at the bottom of the wrapper, scrolls with it after release)
  const panelStyle: React.CSSProperties =
    pinState === 'pinned'
      ? {
          position:   'fixed',
          top:         NAVBAR_H,
          left:        0,
          right:       0,
          height:      panelH,
          zIndex:      1,
          background: 'rgba(10, 10, 10, 0.88)',
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        }
      : pinState === 'after'
      ? {
          position:   'absolute',
          bottom:      0,
          left:        0,
          right:       0,
          height:      panelH,
          zIndex:      1,
          background: 'rgba(10, 10, 10, 0.88)',
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        }
      : {
          position:   'absolute',
          top:         0,
          left:        0,
          right:       0,
          height:      panelH,
          zIndex:      1,
          background: 'rgba(10, 10, 10, 0.88)',
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        };

  return (
    <>
      {/* ── Tall wrapper — gives the panel scroll room ─────────────────────── */}
      {/* id="about" lives here so the nav anchor lands at the top of the pin  */}
      <div
        id="about"
        ref={wrapperRef}
        aria-label="About Aryan Kumar"
        style={{
          position: 'relative',
          zIndex:    1,
          height:   `${WRAPPER_VH}vh`,
        }}
      >
        {/* ── The panel itself — switches between fixed/absolute via JS ──── */}
        <div style={panelStyle}>
          <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">

            {/* Top divider */}
            <div className="overflow-hidden mb-16 lg:mb-20">
              <motion.div
                className="divider-line h-px bg-[color:var(--border)] w-full"
                variants={lineReveal}
                initial="hidden"
                animate="visible"
              />
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

              {/* LEFT: pull quote with word-by-word opacity animation */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[3px] text-[color:var(--text-secondary)] mb-8">
                  ABOUT —
                </p>
                <div
                  className="font-display text-[clamp(2.8rem,5vw,4rem)] leading-[1.05]"
                  aria-label={about.pullQuote.join(' ')}
                >
                  {words.map((word, i) => {
                    const cleanWord   = word.toLowerCase().replace(/[^a-z]/g, '');
                    const cleanAccent = about.accentWord.toLowerCase().replace(/[^a-z]/g, '');
                    const isAccent    = cleanWord === cleanAccent;
                    return (
                      <span
                        key={i}
                        aria-hidden="true"
                        style={{
                          display:     'inline-block',
                          marginRight: '0.2em',
                          opacity:     wordStates[i]?.opacity ?? 0.12,
                          color:       isAccent ? 'var(--accent)' : 'var(--text-primary)',
                          transition:  'opacity 0.1s',
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: paragraphs — fully visible, no animation dependency */}
              <div className="flex flex-col justify-center gap-5">
                {about.paragraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    className="font-sans text-[15px] font-light leading-[1.75] text-[color:var(--text-secondary)]"
                    variants={fadeVariant}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    style={{ transitionDelay: `${i * 0.08}s` }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Stats strip — outside the tall wrapper, scrolls normally after pin releases */}
      <div
        style={{
          position:   'relative',
          zIndex:      1,
          background: 'rgba(10, 10, 10, 0.88)',
        }}
        className="px-6 lg:px-12 py-12"
      >
        <div className="max-w-[1400px] mx-auto">

          <motion.div
            className="divider-line h-px bg-[color:var(--border)] w-full mb-8"
            variants={lineReveal}
            initial="hidden"
            animate={statsReveal.isInView ? 'visible' : 'hidden'}
          />

          <motion.div
            ref={statsReveal.ref}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
            variants={fadeVariant}
            initial="hidden"
            animate={statsReveal.isInView ? 'visible' : 'hidden'}
            custom={0}
            aria-label="Education details"
          >
            {about.stats.map((stat, i) => (
              <div key={stat} className="flex items-center gap-6">
                <span className="font-mono text-[11px] tracking-[1px] text-[color:var(--text-secondary)] uppercase">
                  {stat}
                </span>
                {i < about.stats.length - 1 && (
                  <span aria-hidden="true" className="font-mono text-[11px] text-[color:var(--border)]">·</span>
                )}
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </>
  );
}
