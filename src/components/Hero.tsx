// ─── src/components/Hero.tsx ──────────────────────────────────────────────────
// Full-viewport hero section. No photo — the name dominates and crops past
// the right edge for editorial tension (PRD §6.2).
// Animations fire on mount (not scroll-triggered).
// All copy from content.ts. No inline strings.
// HeroGrid is now fixed/global (rendered in App.tsx) — not a child of this section.

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { hero } from '../data/content';
import { clipReveal, fadeUp, opacityOnly } from '../lib/variants';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const nameVariant = shouldReduceMotion ? opacityOnly : clipReveal;
  const fadeVariant = shouldReduceMotion ? opacityOnly : fadeUp;

  return (
    <section
      id="hero"
      className="grain-overlay relative min-h-screen flex flex-col justify-between overflow-hidden bg-bg"
      aria-label="Hero — Aryan Kumar introduction"
      style={{ zIndex: 1 }}
    >
      {/* ── Main hero content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 pt-[72px]">

        <motion.p
          className="font-mono text-[11px] tracking-[2px] uppercase text-[color:var(--text-secondary)] mb-6 lg:mb-8"
          variants={fadeVariant}
          initial="hidden"
          animate="visible"
          custom={0}
          style={shouldReduceMotion ? {} : { transitionDelay: '400ms' }}
        >
          {hero.label}
        </motion.p>

        <div
          className="flex flex-col leading-none mb-8 lg:mb-10"
          aria-label="Aryan Kumar"
        >
          {hero.nameLines.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.span
                className="block font-display text-[22vw] sm:text-[20vw] lg:text-[18vw] leading-[0.9] tracking-[-1px] text-[color:var(--text-primary)] whitespace-nowrap"
                variants={nameVariant}
                initial="hidden"
                animate="visible"
                custom={i}
                style={
                  shouldReduceMotion
                    ? {}
                    : { transitionDelay: `${200 + i * 150}ms` }
                }
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Descriptors">
            {hero.chips.map((chip, i) => (
              <motion.span
                key={chip}
                role="listitem"
                className="font-sans text-[12px] font-normal text-[color:var(--text-secondary)] border border-[color:var(--border)] rounded-full px-3 py-1"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                custom={i}
                style={
                  shouldReduceMotion
                    ? {}
                    : { transitionDelay: `${600 + i * 80}ms` }
                }
              >
                {chip}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="animate-bounce-y text-[color:var(--text-secondary)]"
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            custom={hero.chips.length}
            aria-hidden="true"
          >
            <ArrowDown size={18} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* ── Marquee ticker strip ─────────────────────────────────────────────── */}
      <div
        className="marquee-wrapper overflow-hidden border-t border-[color:var(--border)] py-3"
        aria-hidden="true"
      >
        <div className="marquee-track">
          <span className="font-mono text-[11px] tracking-[1.5px] text-[color:var(--text-secondary)] pr-8">
            {hero.marquee}
          </span>
          <span className="font-mono text-[11px] tracking-[1.5px] text-[color:var(--text-secondary)] pr-8">
            {hero.marquee}
          </span>
        </div>
      </div>
    </section>
  );
}
