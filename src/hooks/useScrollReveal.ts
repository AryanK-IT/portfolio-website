// ─── src/hooks/useScrollReveal.ts ────────────────────────────────────────────
// Thin wrapper around Framer Motion's useInView hook.
// Returns a ref to attach to the watched element and a boolean isInView.
// `once: true` — animation fires once and stays visible (no re-trigger on scroll up).
// `amount` — fraction of the element that must be visible before triggering.
// Mirrors the exact signature specified in PRD §7.

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}
