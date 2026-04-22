// ─── src/components/ScrollTheater.tsx ────────────────────────────────────────
// Pinned 300vh scroll theater. The section sticks at the top while the user
// scrolls through it, revealing the pull-quote word by word.
// Logic mirrors the reference HTML's ScrollTrigger.create onUpdate exactly,
// re-implemented with Framer Motion useScroll + useMotionValueEvent.

import { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { about } from '../data/content';

export default function ScrollTheater() {
  const shouldReduceMotion = useReducedMotion();

  // Flatten all pull-quote lines into a single word list
  const words = about.pullQuote.join(' ').split(' ');

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track scroll progress over the full height of the wrapper div
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  type WS = { opacity: number };
  const dimAll  = (): WS[] => words.map(() => ({ opacity: 0.12 }));
  const fullAll = (): WS[] => words.map(() => ({ opacity: 1    }));

  const [wordStates, setWordStates] = useState<WS[]>(
    shouldReduceMotion ? fullAll() : dimAll()
  );

  // Mirror reference: dist = progress - threshold
  // dist >= -0.05 and <= 0.15  → opacity 1 (active)
  // dist > 0.15                → opacity 0.25 (passed)
  // else                       → opacity 0.12 (not yet)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (shouldReduceMotion) return;
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
  });

  useEffect(() => {
    if (shouldReduceMotion) setWordStates(fullAll());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  return (
    // Outer wrapper: 300vh gives scroll room for the pin effect
    <div
      ref={wrapperRef}
      style={{ height: shouldReduceMotion ? 'auto' : '300vh', position: 'relative' }}
    >
      {/* Sticky panel — sits fixed in viewport while wrapper scrolls past */}
      <div
        style={{
          position:       shouldReduceMotion ? 'relative' : 'sticky',
          top:            0,
          height:         '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
          zIndex:         1,
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize:   'clamp(3rem, 8vw, 8rem)',
            textAlign:  'center',
            lineHeight:  1,
            maxWidth:   '900px',
            padding:    '0 2rem',
          }}
          aria-label={about.pullQuote.join(' ')}
        >
          {words.map((word, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display:    'inline-block',
                marginRight: '0.22em',
                opacity:    wordStates[i]?.opacity ?? 0.12,
                color:      'var(--text-primary)',
                transition: shouldReduceMotion ? 'none' : 'opacity 0.1s',
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
