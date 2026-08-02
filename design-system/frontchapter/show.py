#!/usr/bin/env python3
"""Print FrontChapter design system in the same ASCII box as ui-ux-pro-max."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / ".cursor/skills/ui-ux-pro-max/scripts"))

from design_system import format_ascii_box  # noqa: E402

# Extracted from src/config/theme.json + src/styles/theme.scss + tailwind.config.js
design_system = {
    "project_name": "FrontChapter",
    "category": "Frontend community (Iran)",
    "pattern": {
        "name": "Community / Conference Hub",
        "conversion": "Community proof + orange join CTA. Hero → story/stats → speakers → posts → CTA.",
        "cta_placement": "Nav «هویجی شو!» + section CTAs (bg-primary)",
        "sections": "1. Hero  2. Stats/story  3. Speakers  4. Posts/events  5. CTA  6. Footer",
    },
    "style": {
        "name": "Warm orange community brand",
        "keywords": "Orange primary, cream/peach surfaces, DanaVF, RTL-first, soft shadows, GSAP hero",
        "best_for": "FrontChapter conference, blog, speakers — keep existing brand",
        "performance": "Good",
        "accessibility": "WCAG AA targets; primary #fe6019",
        "light_mode": "✓ Full",
        "dark_mode": "✓ prefers-color-scheme",
    },
    "colors": {
        "primary": "#fe6019",
        "on_primary": "#ffffff",
        "secondary": "#ffece4",
        "accent": "#fe6019",
        "background": "#ffffff",
        "foreground": "#222222",
        "muted": "#64748b",
        "border": "#dee2e6",
        "destructive": "#DC2626",
        "ring": "#fe6019",
        "notes": "Brand orange + cream #fffaf3 / peach #ffece4. NOT purple. Dark: body #0f1419.",
    },
    "typography": {
        "heading": "DanaVF",
        "body": "DanaVF",
        "mood": "Persian-capable sans, community, conference, warm tech",
        "best_for": "RTL fa/en UI — local /fonts/DanaVF.woff2 (not Google Fonts)",
        "css_import": "@font-face { font-family: 'DanaVF'; src: url('/fonts/DanaVF.woff2') format('woff2'); }",
    },
    "key_effects": "GSAP hero (power3.out), duration-300 hovers, primary-tinted shadows, rounded-xl cards, cream theme-light surfaces",
    "anti_patterns": "Purple/violet palettes · Replace DanaVF with Google Fonts · LTR-only · Emoji as UI icons",
}

print(format_ascii_box(design_system))
