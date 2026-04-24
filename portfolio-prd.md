# Product Requirements Document
## Aryan Kumar — Portfolio Website Bug Fixes
**Version:** 1.0  
**Date:** April 24, 2026  
**Project:** `AryanK-IT/portfolio-website`  
**Stack:** React 18 · TypeScript · Vite · Tailwind CSS v3 · Framer Motion v11  
**Deployment Target:** Vercel (SSR-incompatible APIs must not be used; all scroll/DOM logic must be client-safe)

---

## Guiding Principle

Only the three bugs described in this document should be addressed. Every other component — `Hero`, `Navbar`, `Projects`, `Skills`, `Contact`, `Footer`, `HeroGrid`, `globals.css`, `variants.ts`, `content.ts`, and all animation logic outside the About section — must remain completely untouched. The goal is surgical fixes, not a refactor.

---

## Bug 1 — Remove the Standalone `ScrollTheater` Component

### Current Behaviour
A separate `ScrollTheater` component exists between the `Hero` and `About` sections in `App.tsx`. It renders a `300vh`-tall wrapper `div` containing a `position: sticky` panel that displays the pull quote "I BUILD THINGS THAT SCALE AND THINK." word by word as the user scrolls. This component is broken — the sticky pinning does not work (the text scrolls away instead of staying fixed), and the `300vh` wrapper leaves a massive blank void on the page after the text has scrolled off.

### Root Cause
The `300vh` outer div has no background, so the sticky text visually bleeds over the Hero section and Navbar. More critically, `overflow-x: hidden` is declared on both `html` and `body` in `globals.css`. In most browsers, `overflow: hidden` on a scroll container ancestor breaks `position: sticky`, causing it to behave like `position: relative` — meaning the text scrolls with the page instead of pinning. The net result is a broken animation and ~900px of dead empty space.

Additionally, the text content in `ScrollTheater` is a duplicate of the `About` section's pull quote, which means the same phrase appears twice on the page — once broken and once in the About layout — which is a content and design error.

### What Must Be Done

**Step 1 — Delete `ScrollTheater.tsx` entirely.**  
Remove the file `src/components/ScrollTheater.tsx` from the project. Do not repurpose or modify it — delete it completely.

**Step 2 — Remove all references to `ScrollTheater` in `App.tsx`.**  
Remove the import line:
```tsx
import ScrollTheater from './components/ScrollTheater';
```
Remove the JSX usage:
```tsx
<ScrollTheater />
```
The section order in `App.tsx` after the fix should be:
`Navbar → Hero → About → Projects → Skills → Contact → Footer`

**Step 3 — Do not touch anything else in `App.tsx`.**  
The `HeroGrid`, `CustomCursor`, `Navbar`, and all other sections must remain exactly as they are.

### Acceptance Criteria
- The `ScrollTheater.tsx` file no longer exists in the project.
- No import or JSX reference to `ScrollTheater` exists anywhere in the codebase.
- Scrolling from the Hero section flows directly and cleanly into the About section with no blank gap between them.
- The page has no unexplained empty vertical space in the Hero → About transition.
- The site builds and deploys on Vercel without errors.

---

## Bug 2 — About Section: Sticky Scroll with Word-Highlight Animation

### Current Behaviour
The About section (`src/components/About.tsx`) currently renders as a straightforward two-column layout. The left column contains a pull quote ("I BUILD THINGS THAT SCALE AND THINK.") and the right column contains body paragraphs. Both columns appear and scroll normally — there is no sticky/pinning behavior and no word-highlight animation. The section looks fine visually in isolation, but it is missing its intended interaction entirely.

### Desired Behaviour
When the user scrolls into the About section, the **entire section pins itself to the viewport** — both columns become fixed in place. While the section is pinned:

- The **left column pull quote** animates word by word — as the user scrolls, each word transitions from a dim, low-opacity state to full brightness/full opacity, progressing from the first word ("I") to the last ("THINK.") sequentially.
- The **right column** (paragraphs, body text) is **fully visible and static** from the moment the section enters the viewport. It does not animate and does not wait for the word highlight to complete. It simply sits there, visible, as a counterpart to the animated left column.
- Both columns are locked together as one visual unit during the pinned period — the user sees the complete About section layout at all times during the animation.

Once all words in the pull quote have been fully highlighted, the pin releases and the **entire About section — both columns together — scrolls away naturally** as the user continues to scroll down. It must feel like one cohesive component exiting the screen, not two independent elements.

### Technical Implementation Requirements

#### Scroll Container Fix (Critical for Vercel Deployment)
The root cause of sticky failures in this codebase is `overflow-x: hidden` on `html` and `body` in `globals.css`. This must be worked around without modifying those global rules (as changing them could break the Hero's overflow behavior).

The fix must be implemented at the component level. The About section's outer wrapper must establish its own scroll context. The recommended approach is to implement the sticky behavior using Framer Motion's `useScroll` with a `ref` target pointing to the About section's outer container, tracking `offset: ['start start', 'end end']` over a tall wrapper div. This is the same pattern attempted in the removed `ScrollTheater` but must now be implemented correctly and within the About section itself.

#### Structure
The About section must be restructured as follows:

```
<div ref={wrapperRef} style={{ height: 'Xvh', position: 'relative' }}>
  <!-- Tall wrapper gives scroll room for the pin -->
  
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
    <!-- Sticky panel — both columns live here -->
    
    <div class="two-column-grid">
      <!-- LEFT: Pull quote with word-highlight animation -->
      <!-- RIGHT: Body paragraphs, fully visible, no animation dependency -->
    </div>
    
  </div>
</div>
```

The height of the outer wrapper `div` controls how long the section stays pinned. It should be tall enough to allow all words to be highlighted comfortably — a value in the range of `250vh` to `350vh` is appropriate, tuned so the animation feels neither rushed nor excessively slow.

#### Word Highlight Logic
- Flatten the `about.pullQuote` array (from `content.ts`) into a single space-separated string, then split by spaces to get individual words.
- Use `useMotionValueEvent` on `scrollYProgress` (from `useScroll`) to update the opacity of each word in real time as the user scrolls.
- Each word `i` has a threshold of `i / (totalWords - 1)`. The opacity logic per word:
  - If scroll progress is more than ~0.05 behind the word's threshold → opacity `0.12` (not yet reached)
  - If scroll progress is within the word's active window → opacity `1.0` (active / highlighted)
  - If scroll progress has passed the word's window by more than ~0.15 → opacity `0.25` (passed)
- The accent word ("think.") must retain its accent color (`var(--accent)`) when highlighted, matching the existing About section design in `content.ts`.
- Transitions on opacity should be short (around `0.1s`) so the effect feels responsive to scroll speed.

#### Sticky Panel Positioning
- The sticky panel must account for the fixed navbar height of `72px`. Use `top: 72px` and `height: calc(100vh - 72px)` on the sticky div to ensure the content is not hidden behind the navbar and is perfectly centered in the visible viewport area.
- The two-column layout inside the sticky panel must match the existing About layout exactly: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24`.

#### Reduced Motion
- If `useReducedMotion()` returns `true`, the section must not use the sticky/pinning structure. Instead, render a normal static layout with all words at full opacity. The outer wrapper should have `height: auto` and the panel should use `position: relative`.

#### Preservation of Existing About Content
The following elements from the current `About.tsx` must be preserved exactly and must remain visible during and after the sticky animation:
- Section label ("ABOUT —")
- Pull quote text and accent word styling
- All four body paragraphs (right column)
- The divider lines (top and bottom)
- The stats strip at the bottom (B.Tech · IT · KIIT, Bhubaneswar · 2023–2027 · Backend Specialist)

The stats strip and the bottom divider line sit below the sticky panel and scroll normally — they are not part of the pinned experience.

#### Vercel Compatibility
- No `window` or `document` access outside of `useEffect` or event handlers — Vite/Vercel performs no SSR here but it is best practice.
- All scroll hooks (`useScroll`, `useMotionValueEvent`) are Framer Motion client-side APIs and are safe.
- No new dependencies may be added. The fix must use only existing packages: `framer-motion`, React, and Tailwind.
- The build command `tsc && vite build` must complete without TypeScript errors.

### Acceptance Criteria
- Scrolling into the About section causes the entire section (both columns) to pin to the viewport.
- The right column body paragraphs are fully visible immediately when the section enters view.
- Words in the left pull quote highlight sequentially from first to last as the user scrolls through the pinned section.
- Once all words are highlighted, continuing to scroll causes the entire About section to scroll away as one unit.
- The stats strip below appears naturally as the About section scrolls away.
- No blank gap exists between the About section and the Projects section.
- Reduced motion users see a static layout with all content visible.
- The site deploys and runs correctly on Vercel.

---

## Bug 3 — Remove Blank Gaps Between Sections

### Current Behaviour
There are two large, unexplained empty spaces visible on the page:
1. A blank gap between the **About section** and the **Projects section**.
2. A blank gap between the **Skills section** and the **Contact section**.

These gaps are not intentional padding or spacing — they are empty voids that make the page feel broken and unfinished.

### Root Cause
Both gaps are caused by the residual layout footprint of the `ScrollTheater` component. The `300vh` wrapper div from `ScrollTheater` pushes all subsequent sections downward in the document flow. Because `ScrollTheater` sits between Hero and About in `App.tsx`, its height bleeds into the spacing between all subsequent sections. The gaps after About and after Skills are a downstream consequence of this single broken component occupying space it should not.

A secondary contributing factor may be excessive `padding-top` or `margin-top` values on individual section components that were added to compensate for the `ScrollTheater` height during development.

### What Must Be Done

**Step 1 — Removing `ScrollTheater` (covered in Bug 1) resolves the primary cause.**  
Once the `300vh` wrapper is gone, the downstream layout displacement is eliminated.

**Step 2 — Audit section spacing after the fix.**  
After `ScrollTheater` is removed, visually verify that:
- The gap between About and Projects is only the intended `py-24 lg:py-32` padding already defined in `Projects.tsx`.
- The gap between Skills and Contact is only the intended `py-24 lg:py-32` padding already defined in `Contact.tsx`.

If any unexpected blank space remains after the ScrollTheater removal, inspect the affected section component for any hardcoded `margin-top`, `padding-top`, or `min-height` values that were added as a workaround and remove them.

**Step 3 — Do not modify section padding that is part of the intended design.**  
The `py-24 lg:py-32` vertical padding on each section is intentional and must not be removed. Only remove spacing that exists solely as a compensatory workaround.

### Acceptance Criteria
- No blank gaps exist between the About → Projects sections.
- No blank gaps exist between the Skills → Contact sections.
- All section-to-section transitions feel natural and consistent with the intended `py-24 lg:py-32` spacing rhythm.
- No sections overlap or have insufficient spacing between them.
- The fix holds correctly on Vercel's production build (not just local dev).

---

## Vercel Deployment Checklist

All three fixes must satisfy the following before being considered complete:

| Requirement | Detail |
|---|---|
| `tsc && vite build` passes | No TypeScript errors or type violations introduced |
| No new npm dependencies | All fixes use existing packages only |
| No SSR-incompatible code | No bare `window`/`document` access at module level |
| `position: sticky` works in production | Must be tested in Vercel preview, not just local dev — Vite's dev server and Vercel's production build can behave differently with scroll contexts |
| Reduced motion respected | `useReducedMotion()` checked in all animated components |
| No regressions | Hero, Navbar, Projects, Skills, Contact, Footer, HeroGrid all render and function identically to before |

---

## Files to Be Modified

| File | Change |
|---|---|
| `src/components/ScrollTheater.tsx` | **Delete entirely** |
| `src/App.tsx` | Remove `ScrollTheater` import and JSX usage |
| `src/components/About.tsx` | Rewrite to include sticky scroll + word-highlight animation |

**No other files should be modified.**

---

## Files That Must Not Be Modified

| File | Reason |
|---|---|
| `src/components/Hero.tsx` | Working correctly, no changes needed |
| `src/components/Navbar.tsx` | Working correctly, no changes needed |
| `src/components/Projects.tsx` | Working correctly, no changes needed |
| `src/components/Skills.tsx` | Working correctly, no changes needed |
| `src/components/Contact.tsx` | Working correctly, no changes needed |
| `src/components/Footer.tsx` | Working correctly, no changes needed |
| `src/components/HeroGrid.tsx` | Working correctly, no changes needed |
| `src/data/content.ts` | Single source of truth — must not be altered |
| `src/styles/globals.css` | Global styles — must not be altered |
| `src/lib/variants.ts` | Shared animation variants — must not be altered |
| `src/hooks/useScrollReveal.ts` | Working hook — must not be altered |
| `tailwind.config.ts` | Design token config — must not be altered |
| `vite.config.ts` | Build config — must not be altered |
| `vercel.json` | Deployment config — must not be altered |
