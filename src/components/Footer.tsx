// ─── src/components/Footer.tsx ───────────────────────────────────────────────
// Minimal single-strip footer. Copyright left, social icons right (PRD §6.7).
// DM Sans 12px, --text-secondary. All links open in new tab with noopener.

import { Github, Linkedin } from 'lucide-react';
import { footer, meta } from '../data/content';

export default function Footer() {
  return (
    <footer
      className="w-full px-6 lg:px-12 py-8"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">

        {/* Copyright text — DM Sans 12px, --text-secondary (PRD §6.7) */}
        <p
          className="font-sans text-[12px] font-light tracking-wide"
          style={{ color: 'var(--text-secondary)' }}
        >
          {footer.copy}
        </p>

        {/* Social icon links — GitHub + LinkedIn (PRD §6.7) */}
        <div className="flex items-center gap-4">
          <a
            href={meta.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <Github size={15} strokeWidth={1.5} />
          </a>
          <a
            href={meta.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <Linkedin size={15} strokeWidth={1.5} />
          </a>
        </div>

      </div>
    </footer>
  );
}
