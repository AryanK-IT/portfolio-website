// ─── src/components/Skills.tsx ───────────────────────────────────────────────
// Compact skill chip grid — grouped by category, monospaced, factual.
// Three columns desktop / two columns tablet / one column mobile (PRD §6.5).
// No progress bars. Chips stagger in via scaleIn on scroll enter.
// All data from content.ts. No inline strings.

import { motion, useReducedMotion } from 'framer-motion';
import { skills } from '../data/content';
import { scaleIn, fadeUp, lineReveal, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── Skills component ─────────────────────────────────────────────────────────
export default function Skills() {
  const shouldReduceMotion = useReducedMotion();

  // Scroll reveal refs — header and grid trigger independently
  const headerReveal = useScrollReveal(0.1);
  const gridReveal   = useScrollReveal(0.05);

  const fadeVariant  = shouldReduceMotion ? opacityOnly : fadeUp;
  const chipVariant  = shouldReduceMotion ? opacityOnly : scaleIn;

  // Flatten all skill categories into an ordered array for rendering
  const categories = Object.entries(skills);

  // Build a flat chip index counter so stagger is global across all columns
  // Each chip gets a unique i that increments across category boundaries.
  let globalChipIndex = 0;

  return (
    <section
      id="skills"
      className="bg-bg px-6 lg:px-12 py-16 lg:py-24"
      aria-label="Technical Skills"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Section header ────────────────────────────────────────────────── */}
        <div ref={headerReveal.ref} className="mb-4">
          <motion.h2
            className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[color:var(--text-primary)] tracking-wide"
            variants={fadeVariant}
            initial="hidden"
            animate={headerReveal.isInView ? 'visible' : 'hidden'}
            custom={0}
          >
            TECHNICAL SKILLS —
          </motion.h2>
        </div>

        {/* ── Header divider line ───────────────────────────────────────────── */}
        <motion.div
          className="divider-line h-px bg-[color:var(--border)] w-full mb-16 lg:mb-20"
          variants={shouldReduceMotion ? opacityOnly : lineReveal}
          initial="hidden"
          animate={headerReveal.isInView ? 'visible' : 'hidden'}
        />

        {/* ── Three-column chip grid ────────────────────────────────────────── */}
        {/* grid-cols-1 mobile / grid-cols-2 tablet / grid-cols-3 desktop      */}
        <div
          ref={gridReveal.ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16"
        >
          {categories.map(([category, chipList]) => (
            <div key={category} className="flex flex-col gap-4">

              {/* ── Column header ──────────────────────────────────────────── */}
              {/* DM Sans 11px, uppercase, letter-spacing 2px, --text-secondary */}
              <motion.h3
                className="font-sans text-[11px] font-normal uppercase tracking-[2px] text-[color:var(--text-secondary)] pb-3 border-b border-[color:var(--border)]"
                variants={fadeVariant}
                initial="hidden"
                animate={gridReveal.isInView ? 'visible' : 'hidden'}
                custom={0}
              >
                {category}
              </motion.h3>

              {/* ── Chip list ──────────────────────────────────────────────── */}
              <div
                className="flex flex-wrap gap-2"
                role="list"
                aria-label={`${category} skills`}
              >
                {chipList.map((skill) => {
                  // Capture current global index before incrementing
                  const chipIndex = globalChipIndex;
                  globalChipIndex += 1;

                  return (
                    <motion.a
                      key={skill.name}
                      href={skill.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="listitem"
                      // skill-chip class provides border, bg, hover styles from globals.css
                      className="skill-chip px-3 py-1.5 rounded-sm"
                      variants={chipVariant}
                      initial="hidden"
                      animate={gridReveal.isInView ? 'visible' : 'hidden'}
                      // Global stagger: 40ms per chip across all columns (PRD §6.5)
                      custom={chipIndex}
                    >
                      {skill.name}
                    </motion.a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom divider ────────────────────────────────────────────────── */}
        <motion.div
          className="divider-line h-px bg-[color:var(--border)] w-full mt-10 lg:mt-14"
          variants={shouldReduceMotion ? opacityOnly : lineReveal}
          initial="hidden"
          animate={gridReveal.isInView ? 'visible' : 'hidden'}
        />

      </div>
    </section>
  );
}
