// ─── src/components/Contact.tsx ──────────────────────────────────────────────
// Two-column contact section. Left: large Bebas Neue CTA + subtext + email +
// social links. Right: Formspree-powered form with Name, Email, Message fields.
// Scroll-triggered animations. All copy from content.ts. No inline strings.

import { useState, FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { meta, contact } from '../data/content';
import { slideLeft, fadeUp, lineReveal, opacityOnly } from '../lib/variants';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── Form state type ──────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Contact component ────────────────────────────────────────────────────────
export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  // Scroll reveal refs — left column and right form trigger independently
  const headerReveal = useScrollReveal(0.1);
  const leftReveal   = useScrollReveal(0.1);
  const rightReveal  = useScrollReveal(0.1);

  // Form state
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name:    '',
    email:   '',
    message: '',
  });

  // Choose variants based on reduced-motion preference
  const slideVariant = shouldReduceMotion ? opacityOnly : slideLeft;
  const fadeVariant  = shouldReduceMotion ? opacityOnly : fadeUp;

  // ─── Handle input changes ──────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Handle form submission via Formspree ─────────────────────────────────
  // Client-side only — no backend. Endpoint from VITE_FORMSPREE_URL env var.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Fallback: if no endpoint configured, open mailto directly
    if (!meta.formspreeEndpoint) {
      const subject = encodeURIComponent(`Portfolio contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );
      window.open(`mailto:${meta.email}?subject=${subject}&body=${body}`);
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch(meta.formspreeEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="px-6 lg:px-12 py-16 lg:py-24"
      aria-label="Contact Aryan Kumar"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Section top divider ───────────────────────────────────────────── */}
        <div ref={headerReveal.ref}>
          <motion.div
            className="divider-line h-px bg-[color:var(--border)] w-full mb-16 lg:mb-20"
            variants={shouldReduceMotion ? opacityOnly : lineReveal}
            initial="hidden"
            animate={headerReveal.isInView ? 'visible' : 'hidden'}
          />
        </div>

        {/* ── Two-column grid: CTA left / form right ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── LEFT COLUMN — CTA + subtext + email + social ────────────────── */}
          <motion.div
            ref={leftReveal.ref}
            className="flex flex-col justify-between gap-10"
            variants={slideVariant}
            initial="hidden"
            animate={leftReveal.isInView ? 'visible' : 'hidden'}
          >
            {/* Large CTA headline — Bebas Neue ~8vw (PRD §6.6) */}
            {/* "SOMETHING." rendered in --accent color           */}
            <div>
              <h2
                className="font-display leading-[0.92] tracking-wide"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
                aria-label={contact.ctaLines.join(' ')}
              >
                {contact.ctaLines.map((line) => (
                  <div
                    key={line}
                    style={{
                      color: line === contact.accentWord
                        ? 'var(--accent)'
                        : 'var(--text-primary)',
                    }}
                  >
                    {line}
                  </div>
                ))}
              </h2>

              {/* Subtext paragraph */}
              <p className="font-sans text-[14px] font-light leading-[1.75] text-[color:var(--text-secondary)] mt-6 max-w-[380px]">
                {contact.subtext}
              </p>
            </div>

            {/* Email + social links block */}
            <div className="flex flex-col gap-5">
              {/* Email address */}
              <a
                href={`mailto:${meta.email}`}
                className="font-mono text-[13px] tracking-[0.5px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200 w-fit"
              >
                {meta.email}
              </a>

              {/* Social icon links */}
              <div className="flex items-center gap-4">
                <a
                  href={meta.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="flex items-center gap-1.5 font-sans text-[12px] font-normal uppercase tracking-[1px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
                >
                  <Github size={14} strokeWidth={1.5} />
                  GitHub
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </a>

                <span aria-hidden="true" className="text-[color:var(--border)]">·</span>

                <a
                  href={meta.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="flex items-center gap-1.5 font-sans text-[12px] font-normal uppercase tracking-[1px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors duration-200"
                >
                  <Linkedin size={14} strokeWidth={1.5} />
                  LinkedIn
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN — Contact form ──────────────────────────────────── */}
          {/* fadeUp with 200ms delay (PRD §6.6)                                */}
          <motion.div
            ref={rightReveal.ref}
            variants={fadeVariant}
            initial="hidden"
            animate={rightReveal.isInView ? 'visible' : 'hidden'}
            custom={0}
            style={shouldReduceMotion ? {} : { transitionDelay: '200ms' }}
          >
            {/* ── Success state ──────────────────────────────────────────────── */}
            {formStatus === 'success' ? (
              <div className="flex flex-col gap-4 py-12">
                <p className="font-display text-[2rem] text-[color:var(--text-primary)]">
                  MESSAGE SENT.
                </p>
                <p className="font-sans text-[14px] font-light text-[color:var(--text-secondary)]">
                  Thanks for reaching out — I'll get back to you soon.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="font-sans text-[12px] uppercase tracking-[1px] text-[color:var(--accent)] hover:opacity-75 transition-opacity duration-200 w-fit mt-2"
                >
                  Send another →
                </button>
              </div>
            ) : (
              // ── Form ─────────────────────────────────────────────────────────
              // HTML5 required + email validation. No JS validation library.
              // Formspree submission via fetch in handleSubmit.
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-8"
                aria-label="Contact form"
              >
                {/* Name field */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-name"
                    className="font-mono text-[10px] uppercase tracking-[2px] text-[color:var(--text-secondary)]"
                  >
                    {contact.fields.name}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={contact.fields.name}
                    required
                    autoComplete="name"
                    // form-field class from globals.css — borderless except bottom
                    className="form-field"
                    aria-required="true"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-email"
                    className="font-mono text-[10px] uppercase tracking-[2px] text-[color:var(--text-secondary)]"
                  >
                    {contact.fields.email}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={contact.fields.email}
                    required
                    autoComplete="email"
                    className="form-field"
                    aria-required="true"
                  />
                </div>

                {/* Message textarea */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-message"
                    className="font-mono text-[10px] uppercase tracking-[2px] text-[color:var(--text-secondary)]"
                  >
                    {contact.fields.message}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={contact.fields.message}
                    required
                    rows={5}
                    className="form-field resize-none"
                    aria-required="true"
                  />
                </div>

                {/* Error message */}
                {formStatus === 'error' && (
                  <p
                    className="font-sans text-[12px] text-[color:var(--accent)]"
                    role="alert"
                  >
                    {meta.formspreeEndpoint
                      ? 'Something went wrong — please try again or email directly.'
                      : 'Form endpoint not configured. Please set VITE_FORMSPREE_URL.'}
                  </p>
                )}

                {/* Submit button — full width, --accent bg, scale hover (PRD §6.6) */}
                <motion.button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 font-sans text-[13px] font-medium uppercase tracking-[2px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--accent)' }}
                  // scale + brightness on hover (PRD §6.6)
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : { scale: 1.02, filter: 'brightness(1.12)' }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Submit contact form"
                >
                  {formStatus === 'submitting' ? 'SENDING…' : contact.submitLabel}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
