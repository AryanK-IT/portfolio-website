// ─── src/components/Projects.tsx ─────────────────────────────────────────────
// Numbered full-width interactive rows — editorial, tabular (PRD §6.4).
// Each row expands on hover: description slides down, accent border animates in,
// row number turns accent, GitHub link becomes visible.
// All copy and data from content.ts. No inline strings.

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/content';
import { rowReveal, lineReveal, fadeUp, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── Type for a single project entry ─────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  link: string;
}

// ─── ProjectRow sub-component ─────────────────────────────────────────────────
// Isolated so each row manages its own hover state independently.
function ProjectRow({
  project,
  index,
  isInView,
  shouldReduceMotion,
}: {
  project: Project;
  index: number;
  isInView: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);

  const rowVariant = shouldReduceMotion ? opacityOnly : rowReveal;

  return (
    <motion.div
      // Scroll entrance — staggered 100ms per row (PRD §6.4)
      variants={rowVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
    >
      {/* ── Interactive row wrapper ─────────────────────────────────────── */}
      {/* Border-left animates in via inline style on hover.                */}
      {/* Background lifts to --bg-hover on hover.                         */}
      <div
        className="relative cursor-pointer py-6 px-4 lg:px-6 transition-colors duration-200"
        style={{
          backgroundColor: hovered ? 'var(--bg-hover)' : 'transparent',
          borderLeft: `2px solid ${hovered ? 'var(--accent)' : 'transparent'}`,
          transition: 'background-color 200ms ease, border-color 200ms ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        // Keyboard accessibility — treat as a link region
        role="article"
        aria-label={`Project: ${project.title}`}
      >
        {/* ── Main row: id / title / tags / github ──────────────────────── */}
        <div className="flex items-baseline gap-4 lg:gap-8">

          {/* Project number — transitions to --accent on hover (PRD §6.4) */}
          <span
            className="font-mono text-[12px] tracking-[1px] shrink-0 transition-colors duration-200"
            style={{ color: hovered ? 'var(--accent)' : 'var(--text-secondary)' }}
            aria-hidden="true"
          >
            {project.id}
          </span>

          {/* Project title */}
          <h3
            className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-none text-[color:var(--text-primary)] tracking-wide flex-1 min-w-0"
          >
            {project.title}
          </h3>

          {/* Tags — hidden on mobile to keep row clean, visible sm+ */}
          <div
            className="hidden sm:flex flex-wrap gap-2 flex-1 justify-start"
            aria-label="Technologies"
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-[color:var(--text-secondary)] tracking-[0.5px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* GitHub link — opacity 0→1 on hover (PRD §6.4) */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            className="shrink-0 flex items-center gap-1 font-sans text-[12px] font-normal uppercase tracking-[1px] transition-all duration-200"
            style={{
              opacity: hovered ? 1 : 0,
              color: 'var(--text-primary)',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
            // Stop row hover from toggling off when clicking link
            onMouseEnter={() => setHovered(true)}
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </a>
        </div>

        {/* ── Expandable description — slides down on hover (PRD §6.4) ───── */}
        {/* AnimatePresence handles mount/unmount. height 0→auto, opacity 0→1 */}
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              key="description"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              {/* Tags repeated on mobile inside the expanded description */}
              <div className="flex flex-wrap gap-2 mt-3 mb-2 sm:hidden">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] text-[color:var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-sans text-[13px] font-light leading-[1.7] text-[color:var(--text-secondary)] mt-3 pl-[calc(1.5rem+1.5rem)] lg:pl-[calc(1.5rem+2.5rem)] max-w-[600px]">
                {project.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Row bottom divider ───────────────────────────────────────────── */}
      <div className="h-px bg-[color:var(--border)] mx-4 lg:mx-6" aria-hidden="true" />
    </motion.div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────
export default function Projects() {
  const shouldReduceMotion = useReducedMotion();

  // Scroll reveal for the section header block
  const headerReveal = useScrollReveal(0.1);
  // Scroll reveal for the entire rows container
  const rowsReveal   = useScrollReveal(0.05);

  const fadeVariant = shouldReduceMotion ? opacityOnly : fadeUp;

  return (
    <section
      id="projects"
      className="px-6 lg:px-12 py-16 lg:py-24"
      aria-label="Projects"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Section header: label left, count right ───────────────────────── */}
        <div
          ref={headerReveal.ref}
          className="flex items-end justify-between mb-4"
        >
          <motion.h2
            className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-[color:var(--text-primary)] tracking-wide"
            variants={fadeVariant}
            initial="hidden"
            animate={headerReveal.isInView ? 'visible' : 'hidden'}
            custom={0}
          >
            PROJECTS —
          </motion.h2>

          {/* Project count badge */}
          <motion.span
            className="font-mono text-[13px] text-[color:var(--text-secondary)] tracking-[1px] mb-2"
            variants={fadeVariant}
            initial="hidden"
            animate={headerReveal.isInView ? 'visible' : 'hidden'}
            custom={1}
            aria-label={`${projects.length} projects`}
          >
            ({String(projects.length).padStart(2, '0')})
          </motion.span>
        </div>

        {/* ── Header divider line — scaleX 0→1 (PRD §6.4) ────────────────── */}
        <motion.div
          className="divider-line h-px bg-[color:var(--border)] w-full mb-2"
          variants={shouldReduceMotion ? opacityOnly : lineReveal}
          initial="hidden"
          animate={headerReveal.isInView ? 'visible' : 'hidden'}
        />

        {/* ── Project rows ──────────────────────────────────────────────────── */}
        {/* Top border of the list */}
        <div ref={rowsReveal.ref}>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              isInView={rowsReveal.isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
