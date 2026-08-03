# Carrot Design System

> FrontChapter interaction language. Companion to [`MASTER.md`](./MASTER.md).
> Runtime: `src/layouts/components/carrot/`.

**Rule:** Carrot is brand *feedback*, not a repeated icon. Appear only when it answers: *where am I?*, *what’s happening?*, *what next?*, or *something failed — here’s a way back.*

Think: Duolingo character discipline (jobs, not stickers) + Linear motion restraint + Notion-friendly states.

---

## Do / don’t

**Do:** hover/press/loading motion on CTAs · loader & progress for waits · one mascot in empty/error/success · quiet growth dividers

**Don’t:** carrot SVG inside every button · hero sticker wallpaper · badge icons · watermark mascots · bouncing décor on cards

---

## Core components

| Component | Job |
|-----------|-----|
| `CarrotButton` | Clean CTA — lift, warm shadow, grow-line when `loading` |
| `CarrotLoader` | Explicit wait (soil + mark) |
| `CarrotProgress` | Determinate / indeterminate growth bar |
| `CarrotEmptyState` | Empty or lost (`tone: empty \| error`) — one mark |
| `CarrotSuccessState` | Harvest success — one mark |
| `CarrotDivider` | Section rhythm (`growth` = dot; `carrot` = small mark) |

Supporting (no mascot spam): `CarrotBackground`, `CarrotBadge`, `CarrotPattern`, `CarrotMark` (primitive).

### Button variants

`primary` · `community` · `secondary` · `ghost` · `destructive` — **no leading carrot icons.**

---

## Metaphor

| Metaphor | UI |
|----------|-----|
| Growth | Loader rise, progress fill, button grow-line |
| Harvest | Success state |
| Lost / empty bed | Empty / error state |
| Soft soil line | Dividers |

Motion: CSS; `prefers-reduced-motion` → static. Tokens: `#fe6019`, peach, cream, leaf `#22C55E`.
