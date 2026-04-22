// ─── src/components/About.tsx ────────────────────────────────────────────────
// Two-column about section. Left: section label + Bebas Neue pull quote.
// Right: staggered body paragraphs. Bottom: stats strip in JetBrains Mono.
// Scroll-triggered via useScrollReveal. All copy from content.ts.

import { motion, useReducedMotion } from 'framer-motion';
import { about } from '../data/content';
import { slideLeft, fadeUp, lineReveal, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const leftReveal  = useScrollReveal(0.15);
  const rightReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.2);
  const lineRef     = useScrollReveal(0.1);

  const slideVariant = shouldReduceMotion ? opacityOnly : slideLeft;
  const fadeVariant  = shouldReduceMotion ? opacityOnly : fadeUp;

  return (
    <section
      id="about"
      className="bg-bg px-6 lg:px-12 py-24 lg:py-32"
      aria-label="About Aryan Kumar"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Top divider line ─────────────────────────────────────────────── */}
        <div ref={lineRef.ref} className="overflow-hidden mb-16 lg:mb-20">
          <motion.div
            className="divider-line h-px bg-[color:var(--border)] w-full"
            variants={shouldReduceMotion ? opacityOnly : lineReveal}
            initial="hidden"
            animate={lineRef.isInView ? 'visible' : 'hidden'}
          />
        </div>

        {/* ── Two-column grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 lg:mb-28">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────────── */}
          <motion.div
            ref={leftReveal.ref}
            variants={slideVariant}
            initial="hidden"
            animate={leftReveal.isInView ? 'visible' : 'hidden'}
          >
            <p className="font-sans text-[11px] uppercase tracking-[3px] text-[color:var(--text-secondary)] mb-8">
              ABOUT —
            </p>

            <div
              className="font-display text-[clamp(2.8rem,5vw,4rem)] leading-[1.0]"
              aria-label={about.pullQuote.join(' ')}
            >
              {about.pullQuote.map((line) => {
                const isAccentLine = line === about.accentWord;
                return (
                  <div
                    key={line}
                    className={isAccentLine
                      ? 'text-[color:var(--accent)]'
                      : 'text-[color:var(--text-primary)]'}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
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
                custom={i}
                style={shouldReduceMotion ? {} : { transitionDelay: `${i * 0.08}s` }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* ── Bottom divider before stats ────────────────────────────────────── */}
        <motion.div
          className="divider-line h-px bg-[color:var(--border)] w-full mb-8"
          variants={shouldReduceMotion ? opacityOnly : lineReveal}
          initial="hidden"
          animate={statsReveal.isInView ? 'visible' : 'hidden'}
        />

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
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
                <span aria-hidden="true" className="font-mono text-[11px] text-[color:var(--border)]">
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
