# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/frontchapter/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> **SOURCE OF TRUTH:** Extracted from the live FrontChapter codebase — do **not** regenerate
> colors/fonts via `ui-ux-pro-max` search defaults. Update this file when `src/config/theme.json`
> or `src/styles/theme.scss` change.

---

**Project:** FrontChapter  
**Generated:** 2026-08-03 (extracted from existing theme)  
**Category:** Frontend developer community (Iran) — conference, blog, speakers  
**Stack:** Next.js 14 · React 18 · Tailwind CSS 3 · SCSS · GSAP · RTL (fa/en)  
**Brand:** فرانت‌چپتر — warm orange carrot identity 🥕

**Carrot UI language:** See [`CARROT.md`](./CARROT.md) for mascot placement rules and `src/layouts/components/carrot/` primitives.

---

## Global Rules

### Color Palette (Light)

| Role | Hex | CSS / Tailwind |
|------|-----|----------------|
| Primary / CTA | `#fe6019` | `primary` · `theme.json` |
| On Primary | `#ffffff` | white text on buttons |
| Secondary / Peach | `#ffece4` | `border-secondary` · `--color-border-secondary` |
| Theme Accent | `#fff7f3` | `--color-theme-accent` |
| Theme Light | `#fffaf3` | `theme-light` · `--color-theme-light` |
| Background / Body | `#ffffff` | `body` · `--color-body` |
| Foreground / Heading | `#222222` | `dark` · `--color-heading` |
| Text | `#666666` | `text` · `--color-text` |
| Text Light | `#ceced0` | `light` |
| Muted | `#64748b` | `muted` · `--color-muted` |
| Subtle | `#94a3b8` | `subtle` · `--color-subtle` |
| Border | `#dee2e6` | `border` · `--color-border` |
| Theme Dark (static) | `#1a202c` | `theme-dark` |
| Header | `#ffffff` | `--color-header` |
| Surface | `rgba(255,255,255,0.5)` | `--color-surface` |
| Surface Solid | `#ffffff` | `--color-surface-solid` |
| Shadow | `rgba(32,45,73,0.1)` | `--color-shadow` |
| Nav Hover | `#ffece4` | `--color-nav-hover` |
| Primary glow | `rgba(254,96,25,0.12–0.25)` | timeline dots, social hover |

**Color Notes:** Brand is warm orange (`#fe6019`), not purple. Cream/peach surfaces (`#fffaf3`, `#ffece4`) support the carrot identity. Never introduce violet/indigo community defaults.

### Color Palette (Dark — `prefers-color-scheme: dark`)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Body / Header | `#0f1419` | `--color-body` · `--color-header` |
| Text | `#94a3b8` | `--color-text` |
| Heading | `#f1f5f9` | `--color-heading` |
| Border | `#2d3748` | `--color-border` |
| Border Secondary | `#3d2f24` | `--color-border-secondary` |
| Theme Light | `#1a2332` | `--color-theme-light` |
| Theme Accent | `#1e2836` | `--color-theme-accent` |
| Surface Solid | `#1a2332` | `--color-surface-solid` |
| Surface | `rgba(30,40,54,0.6)` | `--color-surface` |
| Shadow | `rgba(0,0,0,0.35)` | `--color-shadow` |
| Nav Hover | `#2d2419` | `--color-nav-hover` |
| Muted | `#94a3b8` | `--color-muted` |
| Subtle | `#64748b` | `--color-subtle` |

Primary (`#fe6019`) stays the same in dark mode.

### Typography

- **Font family:** `DanaVF` (variable), `sans-serif` fallback
- **Source:** local `/fonts/DanaVF.woff2` + `/fonts/DanaVF.woff` (see `src/styles/style.scss`)
- **Tailwind:** `font-primary` → `['DanaVF', 'sans-serif']` (overrides Poppins in `theme.json`)
- **Do not** load Google Fonts Poppins / Cormorant / Crimson for UI work — keep DanaVF
- **Base size:** `16px` (`theme.json`); body applies `15px`
- **Type scale:** `1.246` → h1…h6 via Tailwind `text-h1` … `text-h6`
- **Headings:** `font-semibold`, `text-dark` (`#222` / dark `#f1f5f9`)
- **Body:** `font-normal`, `leading-relaxed`, `text-text`
- **RTL:** `dir=rtl` when `lang=fa`; keep DanaVF (Persian-capable)

**CSS Import (existing):**
```css
@font-face {
  font-family: 'DanaVF';
  src:
    url('/fonts/DanaVF.woff2') format('woff2'),
    url('/fonts/DanaVF.woff') format('woff');
}
```

### Spacing & Layout

| Token | Value | Usage in project |
|-------|-------|------------------|
| Section | `py-16` | `.section` |
| Container max | `1380px` / `1440px` (`.container-xl`) | `src/styles/components.scss` |
| Container pad | `px-3` + Tailwind `container` `2rem` | |
| Breakpoints | xs 480 · sm 540 · md 768 · lg 992 · xl 1280 · 2xl 1536 | `tailwind.config.js` |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| Default card | `0px 4px 25px var(--color-shadow)` | feature cards |
| Primary tint | `0 4px 14px rgba(254,96,25,0.25)` | social icons hover |
| Soft black | `0 10px 50px rgba(0,0,0,.08)` | testimonials |
| Timeline ring | `0 0 0 4px rgba(254,96,25,0.08–0.12)` | conference timeline |

---

## Component Specs

### Buttons

From `src/styles/buttons.scss`:

```css
.btn {
  display: inline-block;
  padding: 0.75rem 1.25rem; /* px-5 py-3 */
  transition: all 150ms ease;
}

.btn-primary {
  background: #fe6019;
  color: #ffffff;
  border-radius: 6px;
  height: 3rem; /* h-12 */
  overflow: hidden;
  position: relative;
}

.btn-outline-primary {
  border: 1px solid #fe6019;
  background: transparent;
}
.btn-outline-primary:hover {
  background: #fe6019;
  color: #ffffff;
}
```

CTA pattern in JSX: `inline-flex min-h-12 items-center px-8 py-4 bg-primary text-white font-semibold rounded hover:opacity-90`.

### Cards / Surfaces

- Prefer `rounded-xl` / `rounded-2xl`, `border border-border`, `bg-surface-solid` or `bg-theme-light`
- Hover: `hover:border-primary`, `hover:shadow-lg hover:shadow-primary/10`, slight `-translate-y-0.5`
- Feature cards: soft shadow → remove on hover with `hover:border-border-secondary`

### Links & Accents

- Interactive text: `text-primary` + `hover:underline` / `hover:text-primary`
- Icons: Feather / SVG — no emoji-as-icon for UI chrome (brand carrot in copy is OK)

---

## Style Guidelines

**Style:** Warm community / conference marketing — orange brand, cream surfaces, soft depth, GSAP motion on hero.

**Keywords:** orange primary, cream peach accents, DanaVF, RTL-first, conference timeline, soft shadows, rounded-xl, duration-300

**Key Effects:**
- GSAP entrance on home banner (`power3.out`)
- `duration-300` transitions on cards/buttons
- Primary-tinted shadows and timeline dots
- Gradient text: `from-slate-800 to-primary` (light) / `dark:from-slate-200`
- Animated `.bg-theme` backgrounds on CTA blocks

**Page Pattern:** Community + conference hub  
- Hero / value prop → stats / story → speakers → posts / events → CTA (“هویجی شو!”) → footer  
- Conversion: community proof + join CTA; keep orange CTAs above the fold

---

## Anti-Patterns (Do NOT Use)

- Purple / violet / indigo “community” palettes (`#7C3AED`, `#A78BFA`, etc.)
- Google Fonts pairs that replace DanaVF (Cormorant, Crimson Pro, Poppins UI)
- Flat single-color heroes that ignore cream/orange brand atmosphere
- New UI libraries when Tailwind + existing SCSS patterns cover the need
- LTR-only layouts that break Persian RTL
- Emoji as functional icons (decorative brand carrot in copy is fine)

---

## Pre-Delivery Checklist

- [ ] Primary is `#fe6019` (not purple)
- [ ] Font is DanaVF everywhere for UI text
- [ ] Light + dark tokens from `theme.scss` respected
- [ ] RTL works for `lang=fa`
- [ ] `cursor-pointer` on clickable elements
- [ ] Hover transitions ~150–300ms
- [ ] Contrast ≥ 4.5:1 for body text
- [ ] Focus states visible
- [ ] `prefers-reduced-motion` respected for GSAP/CSS motion
- [ ] Responsive: 375 / 768 / 992 / 1280

---

## Codebase Sources

| File | What it defines |
|------|-----------------|
| `src/config/theme.json` | Primary hex, light/dark theme + text colors, font scale |
| `src/styles/theme.scss` | Runtime CSS variables light/dark |
| `tailwind.config.js` | Tailwind color/font/size mapping (DanaVF override) |
| `src/styles/style.scss` | `@font-face` DanaVF |
| `src/styles/buttons.scss` | `.btn-primary` / outline |
| `src/styles/carrot.scss` | Carrot mark poses, loaders, button variants |
| `design-system/frontchapter/CARROT.md` | Carrot design system (do/don’t + API) |
| `src/styles/components.scss` | `.section`, `.container`, social icons |
| `src/config/config.json` | Site title, logo, nav CTA label |
