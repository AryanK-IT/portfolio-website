// ─── src/components/About.tsx ────────────────────────────────────────────────
// Two-column about section. Left: section label + Bebas Neue pull quote.
// Right: staggered body paragraphs. Bottom: stats strip in JetBrains Mono.
// Scroll-triggered via useScrollReveal. All copy from content.ts.

import { motion, useReducedMotion } from 'framer-motion';
import { about } from '../data/content';
import { slideLeft, fadeUp, lineReveal, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── About component ──────────────────────────────────────────────────────────
export default function About() {
  const shouldReduceMotion = useReducedMotion();

  // ─── Separate scroll refs for each animated region ────────────────────────
  // Left column, right column, and stats strip each get their own observer
  // so they can trigger independently as the user scrolls.
  const leftReveal  = useScrollReveal(0.15);
  const rightReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.2);
  const lineRef     = useScrollReveal(0.1);

  // Choose variants based on reduced-motion preference
  const slideVariant = shouldReduceMotion ? opacityOnly : slideLeft;
  const fadeVariant  = shouldReduceMotion ? opacityOnly : fadeUp;

  return (
    <section
      id="about"
      className="bg-bg px-6 lg:px-12 py-24 lg:py-32"
      aria-label="About Aryan Kumar"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Top divider line — scaleX 0→1 from left (PRD §6.3) ─────────── */}
        <div ref={lineRef.ref} className="overflow-hidden mb-16 lg:mb-20">
          <motion.div
            className="divider-line h-px bg-[color:var(--border)] w-full"
            variants={shouldReduceMotion ? opacityOnly : lineReveal}
            initial="hidden"
            animate={lineRef.isInView ? 'visible' : 'hidden'}
          />
        </div>

        {/* ── Two-column grid: left label+quote / right paragraphs ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 lg:mb-28">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          {/* slideLeft on scroll enter (PRD §6.3) */}
          <motion.div
            ref={leftReveal.ref}
            variants={slideVariant}
            initial="hidden"
            animate={leftReveal.isInView ? 'visible' : 'hidden'}
          >
            {/* Section label */}
            <p className="font-sans text-[11px] uppercase tracking-[3px] text-[color:var(--text-secondary)] mb-8">
              ABOUT —
            </p>

            {/* Pull quote — Bebas Neue ~48px, line-height 1.0 (PRD §6.3) */}
            {/* The word matching accentWord is rendered in --accent color.  */}
            <div
              className="font-display text-[clamp(2.8rem,5vw,4rem)] leading-[1.0]"
              aria-label={about.pullQuote.join(' ')}
            >
              {about.pullQuote.map((line) => {
                // Check if this line IS the accent word line
                const isAccentLine = line === about.accentWord;

                if (isAccentLine) {
                  // Render "think." fully in accent
                  return (
                    <div key={line} className="text-[color:var(--accent)]">
                      {line}
                    </div>
                  );
                }

                // Non-accent lines rendered in text-primary
                return (
                  <div key={line} className="text-[color:var(--text-primary)]">
                    {line}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
          {/* Paragraphs stagger in: y:20→0, 80ms between each (PRD §6.3)    */}
          <div
            ref={rightReveal.ref}
            className="flex flex-col justify-center gap-5"
          >
            {about.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="font-sans text-[15px] font-light leading-[1.75] text-[color:var(--text-secondary)]"
                variants={fadeVariant}
                initial="hidden"
                animate={rightReveal.isInView ? 'visible' : 'hidden'}
                // 80ms stagger per paragraph, 200ms base delay (PRD §6.3)
                custom={i}
                style={shouldReduceMotion ? {} : { transitionDelay: `${i * 0.08}s` }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* ── Bottom divider before stats ──────────────────────────────────── */}
        <motion.div
          className="divider-line h-px bg-[color:var(--border)] w-full mb-8"
          variants={shouldReduceMotion ? opacityOnly : lineReveal}
          initial="hidden"
          animate={statsReveal.isInView ? 'visible' : 'hidden'}
        />

        {/* ── Stats strip (PRD §6.3) ───────────────────────────────────────── */}
        {/* JetBrains Mono, 11px, --text-secondary, separated by · in flex.   */}
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
              {/* Stat text */}
              <span className="font-mono text-[11px] tracking-[1px] text-[color:var(--text-secondary)] uppercase">
                {stat}
              </span>

              {/* Separator dot — not rendered after the last item */}
              {i < about.stats.length - 1 && (
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] text-[color:var(--border)]"
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
