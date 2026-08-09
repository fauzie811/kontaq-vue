# Expandable Murattal Audio Player Design

## Overview
Redesign `QuranAudioPlayer.vue` into a simpler, expandable accordion card on mobile devices. The player defaults to a compact mini-bar to prevent obscuring Quran reading text while playing audio, with the option to expand in-place into a full control card for seeking, changing playback speed, and selecting reciters.

## Target Component
- [`QuranAudioPlayer.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/components/QuranAudioPlayer.vue)

## State & Behavior
- `isExpanded`: Boolean flag controlling whether the player is in Mini (collapsed) mode (`false`) or Expanded mode (`true`).
- **Initial State**: Defaults to `false` (Mini mode) whenever playback starts or a new verse is triggered on mobile screens.
- **Toggle Action**: Tapping the expand icon (`ChevronUp` / `ChevronDown`) or clicking the mini-player title toggles `isExpanded`.

## UI Design Specs

### 1. Collapsed State (Mini Player)
- **Container**: Floating card at the bottom of the viewport with backdrop blur, subtle emerald border, and rounded corners (`fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl overflow-hidden transition-all duration-300`).
- **Progress Line**: A 2px thin emerald progress bar pinned along the top edge of the player card indicating `currentTime / duration`.
- **Mini Bar Content**:
  - **Left**: Verse badge (e.g. `1`), Surah & Verse label (e.g. `QS Al-Fatihah : 1`). Clickable to expand.
  - **Right Controls**:
    - Play / Pause button (compact emerald circle).
    - Expand button (`ChevronUp` icon).
    - Close / Stop button (`X` icon).

### 2. Expanded State (Full Player Card)
- Card height expands smoothly upward (`transition-all duration-300`).
- **Header**:
  - Surah & Verse title.
  - Collapse button (`ChevronDown`).
  - Close button (`X`).
- **Seeker Section**:
  - Current formatted time (`0:15`), interactive range slider, total duration (`0:45`).
- **Transport Controls Row**:
  - Speed selector button (`1.0x` / `1.25x` / `1.5x` cycle button).
  - Previous Ayat button (`SkipBack`).
  - Main Play / Pause button (emerald circle).
  - Next Ayat button (`SkipForward`).
- **Reciter Selector**:
  - Full-width styled select input with Qori icon and reciter name dropdown options.

## Verification & Testing
- Test playing audio on mobile viewport width (<640px) to confirm mini player starts collapsed.
- Verify toggle expand/collapse functionality.
- Verify seeking, speed cycling, reciter changing, prev/next, and close actions work seamlessly in both modes.
