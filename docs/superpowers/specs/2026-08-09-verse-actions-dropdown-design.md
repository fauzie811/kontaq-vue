# Design Spec: Verse Actions 3-Dots Dropdown Button

**Date**: 2026-08-09  
**Status**: Approved  

## Overview
Move all verse action buttons (Putar/Jeda Audio, Catatan Kaki, and Salin Ayat) inside a clean 3-dots dropdown menu on each Quran verse card in `QuranVerseItem.vue`.

## Motivation
Currently, each verse card displays multiple individual action buttons in the header row. Grouping these actions into a single 3-dots menu button simplifies the header interface, creates a visually cleaner layout, and improves mobile responsiveness.

## Proposed Changes

### Component: `src/components/QuranVerseItem.vue`

1. **Import Headless UI Menu Components & Icons**:
   - Imports from `@headlessui/vue`: `Menu`, `MenuButton`, `MenuItems`, `MenuItem`.
   - Imports from `lucide-vue-next`: `MoreVertical`, `Volume2`, `Play`, `Pause`, `FileText`, `Copy`, `Check`.

2. **Header Layout Modification**:
   - Replace the standalone action button group in the right side of the verse header with a `<Menu as="div" class="relative">`.
   - `<MenuButton>` renders a 3-dots icon (`MoreVertical`) with hover background and focus states.

3. **Dropdown Menu Items (`<MenuItems>`)**:
   - Styled with floating position (`absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-gray-900/5 focus:outline-none`).
   - Includes transition animation (`enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"`).
   - Items:
     - **Putar / Jeda Audio**:
       - Icon: Dynamic (`Pause` if active and playing, `Play` if active and paused, `Volume2` if inactive).
       - Label: "Jeda Audio" if active and playing, "Putar Audio" otherwise.
       - Triggers: `$emit('play-verse', verse)`.
     - **Catatan Kaki** (rendered only when `verse.footnotes` exists):
       - Icon: `FileText`.
       - Label: "Sembunyikan Catatan" if open, "Lihat Catatan Kaki" if closed.
       - Triggers: `showFootnotes = !showFootnotes`.
     - **Salin Ayat**:
       - Icon: `Check` (emerald) if `isCopied`, `Copy` otherwise.
       - Label: "Tersalin!" if `isCopied`, "Salin Ayat" otherwise.
       - Triggers: `$emit('copy-verse', verse)`.

## Verification Plan

### Manual Verification
1. Open any Quran surah page (e.g. `/quran/1`).
2. Verify that each verse card header displays a 3-dots icon button instead of separate action buttons.
3. Click the 3-dots icon button to open the dropdown menu.
4. Test clicking **Putar Audio** / **Jeda Audio**: confirm audio plays/pauses and icon/label updates.
5. Test clicking **Catatan Kaki** (on verses with footnotes): confirm footnote drawer toggles open/closed.
6. Test clicking **Salin Ayat**: confirm verse text is copied to clipboard and visual feedback ("Tersalin!") displays.
7. Verify clicking outside closes the dropdown menu cleanly.
