---
name: Kontaq
description: Quran study, tadabbur, and community engagement platform
colors:
  primary: "#40835c"
  accent: "#e79b44"
  neutral-bg: "#fafafa"
  neutral-fg: "#09090b"
  card: "#ffffff"
  muted: "#f4f4f5"
  muted-fg: "#71717a"
  border: "#e4e4e7"
  input-border: "#8f8f99"
  destructive: "#ef4444"
typography:
  display:
    fontFamily: "Raleway, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Raleway, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Raleway, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Raleway, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  quran:
    fontFamily: "'LPMQ Isep Misbah', serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 2.0
  arabic:
    fontFamily: "'Scheherazade New', serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 2.0
  label:
    fontFamily: "Raleway, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.025em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  input:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.input-border}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: Kontaq

## Overview

**Creative North Star: "The Quranic Sanctuary"**

Kontaq embodies a serene, focused, and elevated digital sanctuary designed for Quranic study, daily reflection (tadabbur), interactive quizzes, and community engagement. The visual world balances rich natural Forest Green (`#40835c`) identity anchors with illuminating Warm Amber (`#e79b44`) accents, fostering an atmosphere of calm, spiritual clarity, and warmth.

The interface prioritizes reading comfort and effortless navigation. Pure white container cards rest gracefully upon a soft off-white canvas, using refined `12px` rounded corners and tactile micro-interactions to create a modern yet respectful experience. Interactive controls — buttons, chips, and input fields — are fully pill-shaped, which reads as soft and approachable and sharply separates what is *tappable* from what is merely a *surface*.

**Key Characteristics:**
- **Serene Palette**: Forest Green primary branding combined with Warm Amber accents for study progression and active highlights.
- **Dedicated Quranic Typography**: Specialized `'LPMQ Isep Misbah'` Arabic script font paired with clean `Raleway` UI typography.
- **Pill-Shaped Controls**: Every button, chip, and input field is fully rounded (`rounded-full`), while containers stay on the `12px`/`16px` radius scale.
- **Tonal Layering**: Flat surfaces separated by clean border strokes and background tone; no shadows.
- **Tactile Micro-Interactions**: Gentle `active:scale-[0.98]` button responses and smooth View Transitions.

## Colors

The color palette pairs natural forest tones with warm golden amber accents, grounding the platform in peacefulness and focus.

### Primary
- **Forest Emerald** (`#40835c`): Main brand color used for top navigation headers, primary call-to-action buttons, active navigation states, and key identity anchors.

### Secondary / Accent
- **Warm Amber** (`#e79b44`): Illuminating secondary tone used for active verse highlights, progress badges, secondary CTAs, bookmark icons, and achievement indicators.

### Neutral
- **Off-White Canvas** (`#fafafa`): Background shade providing soft, glare-free contrast for long reading sessions.
- **Charcoal Slate** (`#09090b`): High-contrast primary text color for ultimate legibility across light surfaces.
- **Card Surface** (`#ffffff`): Pure white background for container cards, modal dialogs, and dropdown menus.
- **Subtle Border** (`#e4e4e7`): Muted gray border stroke defining card boundaries and section dividers. Passive surfaces only.
- **Control Outline** (`#8f8f99`): Distinctly darker stroke reserved for input fields, select triggers, and outline buttons, so a control's edge is unmistakable against both the canvas and card surfaces.
- **Muted Foreground** (`#71717a`): Secondary text color for timestamps, metadata, and subtitle labels.

### Named Rules
**The Legibility First Rule.** Quranic text and Indonesian translations must maintain crisp contrast against background surfaces; decorative color fills should never compromise readability.

**The Visible Control Rule.** Interactive strokes (`--input`) are held at a minimum 3:1 contrast against the surface behind them, per WCAG 1.4.11. Passive strokes (`--border`) are free to stay whisper-light. Never dilute a control outline with an opacity modifier such as `border-input/80` — that silently drops it below threshold.

## Typography

**Display Font:** Raleway (with sans-serif fallback)  
**Body Font:** Raleway (with sans-serif fallback)  
**Quran Script Font:** 'LPMQ Isep Misbah' (with 'Scheherazade New' & serif fallbacks)

**Character:** Clean, contemporary sans-serif UI typography paired with elegant traditional Naskh Arabic scripture rendering.

### Hierarchy
- **Display** (Bold 700, 36px/2.25rem, line-height 1.2): Main page headers and hero titles.
- **Headline** (SemiBold 600, 28px/1.75rem, line-height 1.3): Section headers and chapter titles.
- **Title** (SemiBold 600, 20px/1.25rem, line-height 1.4): Card titles, modal headers, and surah titles.
- **Body** (Regular 400, 16px/1rem, line-height 1.6): Standard body copy, translation text, and forum post content.
- **Quran Verse** (Regular 400, 24px/1.5rem, line-height 2.0): Arabic scripture text requiring expanded line height.
- **Label** (Medium 500, 14px/0.875rem, letter-spacing 0.025em): Form field labels, navigation links, and badge metadata.

### Named Rules
**The Dual-Language Line Height Rule.** Arabic scripture text must maintain a minimum `line-height: 2em` to prevent voweling marks (tashkeel) from overlapping or clipping.

## Layout

The grid model centers content within a responsive `max-w-7xl` container with responsive padding (`px-4 sm:px-6 lg:px-8`). Content rhythm follows an 8px spatial grid (8px, 16px, 24px, 32px).

## Elevation & Depth

Kontaq is fully flat. Surfaces separate through crisp border strokes (`border-border`, `border-input` on controls) and background tone (`bg-card` over `bg-background`, `bg-muted`/`bg-secondary` tints). Modals sit on a dimmed scrim, not a shadow.

### Named Rules
**The No-Shadow Rule.** No `box-shadow`, `drop-shadow`, inset shadow, or text shadow on any surface, at rest or on interaction. Hover and active states change border color, background tint, or ring (`ring-*` stays for focus visibility) — never elevation. Text over imagery gets its contrast from a solid or gradient overlay.

## Shapes

Two radius families carry the whole system, and the split is the primary signal of interactivity:

- **Controls — pill (`rounded-full`)**: buttons, icon buttons, filter chips, tabs, pagination controls, and all single-line input fields (text inputs, select and combobox triggers, field frames).
- **Surfaces — `12px`/`16px` (`rounded-xl` / `rounded-2xl`)**: cards, modals, drawers, popover panels, and multi-line textareas.

Interactive elements include subtle scale feedback (`active:scale-[0.98]`).

### Named Rules
**The Pill-Means-Tappable Rule.** A fully rounded silhouette is reserved for interactive controls. Never pill a passive surface, and never square off a control.

## Components

### Buttons
- **Shape:** Pill (`rounded-full`) at every size, including icon-only buttons (which become perfect circles).
- **Padding:** `sm` `14px`, `default` `16px`, `lg` `24px` horizontal — pills need slightly wider side padding than rectangles so the label clears the curve.
- **Primary:** Background `#40835c`, text `#ffffff`, hover `#356e4c`, active scale `0.98`.
- **Secondary:** Background `#e79b44`, text `#ffffff`, hover `#d48a35`, active scale `0.98`.
- **Outline:** Background transparent, border `#e4e4e7`, text `#09090b`, hover background `#f4f4f5`.

### Cards / Containers
- **Corner Style:** `12px` (`rounded-xl`) or `16px` (`rounded-2xl`). Never pill-shaped.
- **Background:** Crisp white `#ffffff`.
- **Border:** `1px` solid `#e4e4e7`.
- **Hover:** Border/tint transition (`hover:border-primary/30`, background tint).

### Inputs / Fields
- **Style:** Background `#ffffff`, border `#8f8f99` (`border-input`, 3.2:1 on white), pill radius (`rounded-full`), `16px` horizontal padding.
- **Hover:** Border darkens to `foreground/40`, signalling the field is live before it is focused.
- **Focus:** Border shift to `#40835c` with `2px` focus ring (`ring-2 ring-primary/20`).
- **Adornments:** No decorative icons inside input fields (no leading field icons, no search glyph); the label and placeholder carry meaning. Only functional trailing actions (such as a password reveal toggle) sit inside, as pill/circular icon buttons.
- **Textareas:** Multi-line fields keep the `16px` (`rounded-2xl`) container radius — a pill silhouette breaks down once content wraps.

### Quran Verse Player & Cards
- **Verse Highlight:** Active reading verse highlighted with warm amber background tint (`bg-amber-500/10 border-l-4 border-amber-500`).
- **Audio Control Bar:** Floating sticky bar with play/pause, playback speed, and audio progress slider.

## Do's and Don'ts

### Do:
- **Do** use `'LPMQ Isep Misbah'` with `line-height: 2em` for all Arabic Quran scripture rendering.
- **Do** apply a pill radius (`rounded-full`) to buttons, chips, and single-line input fields, and the `12px`/`16px` radius scale to cards, modals, and panels.
- **Do** use `#40835c` for primary brand framing and `#e79b44` for interactive highlights, badges, and active states.

### Don't:
- **Don't** compress Arabic line-heights, which clips tashkeel diacritic marks.
- **Don't** add shadows of any kind; separate surfaces with borders and background tone.
- **Don't** use `border-border` (or an opacity-reduced variant) on a form control — reach for `border-input`, which carries the accessible control-outline value.
- **Don't** introduce competing accent colors that disrupt the serene green and warm amber palette.
- **Don't** pill-shape textareas, cards, dropdown panels, or menu rows — the pill silhouette is reserved for controls.
