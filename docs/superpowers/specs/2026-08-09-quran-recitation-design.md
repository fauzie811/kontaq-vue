# Design Specification: Per-Ayat Quran Recitation with Switchable Reciters

## Overview
This feature adds per-ayat audio recitation functionality to the Quran Surah view (`Show.vue`). Users can listen to any verse, continuously play through surah verses, switch between 12 curated EveryAyah reciters, adjust playback speed, and control playback via a sticky bottom player bar.

---

## 1. Architecture & Component Responsibilities

### `src/store/quranAudio.js` (Reactive Audio Store)
- **State**:
  - `reciter`: Current selected reciter object (`{ id, name, folder }`). Persisted in `localStorage` (`'kontaq_quran_reciter'`).
  - `isPlaying`: Boolean.
  - `isBuffering`: Boolean.
  - `currentVerseNumber`: Number | null.
  - `currentChapterNumber`: Number | null.
  - `currentVerseId`: Number | null.
  - `currentTime`: Number (seconds).
  - `duration`: Number (seconds).
  - `playbackRate`: Number (`0.75`, `1.0`, `1.25`, `1.5`, `2.0`).
  - `versesList`: Array of loaded verse objects.
  - `onLoadMoreCallback`: Function | null (called when audio reaches last loaded verse to load next page).
- **Methods**:
  - `setReciter(reciterId)`: Changes active reciter, saves to `localStorage`, and restarts current verse audio if playing.
  - `playVerse(verse, chapterNumber, versesList, loadMoreFn)`: Loads and plays a specific verse.
  - `togglePlayPause()`: Toggles play/pause state of current audio.
  - `playNext()`: Advances to next verse in `versesList`. Triggers `loadMoreFn()` if at end of array.
  - `playPrev()`: Returns to previous verse in `versesList`.
  - `setPlaybackRate(speed)`: Updates playback rate.
  - `stop()`: Clears active verse and stops playback.
- **Audio Lifecycle**:
  - Encapsulates a single `HTMLAudioElement` instance.
  - Registers listeners: `ended` (triggers `playNext`), `waiting`/`stalled` (sets `isBuffering`), `canplay`/`playing` (clears `isBuffering`), `timeupdate`, `error`.

### `src/components/QuranAudioPlayer.vue` (Sticky Audio Player UI)
- **Position**: `fixed bottom-0 left-0 right-0 z-50`.
- **UI Elements**:
  - **Verse Info**: Shows current Surah name and Verse number (e.g. `QS Al-Baqarah: 255`).
  - **Reciter Selector**: `<select>` dropdown with 12 popular EveryAyah reciters.
  - **Playback Controls**: Previous Ayat, Play/Pause toggle (with loading spinner), Next Ayat, Close/Stop button.
  - **Progress Seekbar**: Interactive slider showing `currentTime` vs `duration`.
  - **Playback Speed**: Dropdown or toggle button for playback speeds (`0.75x` – `2x`).

### `src/pages/Quran/Show.vue` (Surah Verse List Integration)
- Adds a **Play/Pause icon button** inside each verse card header next to verse number.
- Applies **Active Highlight**: Verse card receives `border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20` when `currentVerseNumber === verse.verse`.
- **Auto-scroll**: Watches `currentVerseNumber` and smoothly scrolls active verse into viewport (`element.scrollIntoView({ behavior: 'smooth', block: 'center' })`).
- **Paginated Playback**: Passes `loadNextPage` as callback so audio seamlessly fetches and plays next page verses when reaching loaded limit.
- Mounts `<QuranAudioPlayer />` at bottom of page.

---

## 2. EveryAyah Audio Integration

### URL Format
Audio files are fetched directly from `everyayah.com`:
```
https://everyayah.com/data/{reciter_folder}/{surah_3digit}{verse_3digit}.mp3
```
Example for Surah 1 Ayat 1:
`https://everyayah.com/data/Mishary_Rashid_Alafasy_128kbps/001001.mp3`

### Reciter List
1. **Mishary Rashid Alafasy** (`Mishary_Rashid_Alafasy_128kbps`) — Default
2. **Abdul Basit (Murattal)** (`Abdul_Basit_Murattal_192kbps`)
3. **Abdul Basit (Mujawwad)** (`Abdul_Basit_Mujawwad_128kbps`)
4. **Abdurrahmaan As-Sudais** (`Abdurrahmaan_As-Sudais_192kbps`)
5. **Abu Bakr Al-Shatri** (`Abu_Bakr_Shatri_128kbps`)
6. **Mahmoud Khalil Al-Husary** (`Mahmoud_Khaliyl_Al-Husary_128kbps`)
7. **Mohamed Siddiq El-Minshawi** (`Minshawy_Murattal_128kbps`)
8. **Saood ash-Shuraym** (`Saood_ash-Shuraym_64kbps`)
9. **Muhammad Ayyoub** (`Muhammad_Ayyoub_128kbps`)
10. **Maher Al Muaiqly** (`MaherAlMuaiqly128kbps`)
11. **Ahmed ibn Ali al-Ajamy** (`Ahmed_ibn_Ali_al-Ajamy_128kbps`)
12. **Hani Ar-Rifai** (`Hani_Rifai_192kbps`)

---

## 3. Error Handling & Edge Cases

- **Network / Audio Load Errors**: If audio fails to load (e.g. 404 or connection drop), player displays toast/badge error and pauses gracefully without crashing.
- **Fast Navigation / Unmount**: Navigating away from `Show.vue` stops audio cleanly and removes audio listeners.
- **End of Surah**: When reaching the last verse of the surah, autoplay stops naturally and resets player state.
