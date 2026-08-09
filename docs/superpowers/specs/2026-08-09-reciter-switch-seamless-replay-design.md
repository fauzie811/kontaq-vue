# Design Spec: Seamless Reciter Switching During Playback

**Date**: 2026-08-09  
**Status**: Approved  

## Overview
Currently, when a user switches the Quran reciter while audio is playing, the player toggles to a paused state instead of continuing playback with the new reciter. This spec details the design to ensure switching reciters while playing immediately replays the current verse from the beginning (`0:00`) using the newly selected reciter's audio, without pausing.

## Proposed Changes

### `src/store/quranAudio.js`

#### 1. `playVerse` Update
Add an optional `forcePlay = false` parameter to `playVerse` to allow programmatic replay requests (e.g. from `setReciter`) to bypass the "pause if already playing current verse" check.

```javascript
playVerse(verse, chapterNumber, versesList = [], onLoadMore = null, forcePlay = false) {
  // ...
  if (!forcePlay && this.currentChapterNumber === chapterNumber && this.currentVerseNumber === verseNum && this.isPlaying) {
    this.pause();
    return;
  }
  // ...
}
```

#### 2. `setReciter` Update
When changing reciter while audio is playing (`wasPlaying === true`), invoke `this.playVerse(...)` with `forcePlay = true`. When audio is paused, update the audio source (`audio.src`) and load it without initiating playback.

```javascript
setReciter(reciterId) {
  const found = RECITERS.find(r => r.id === reciterId);
  if (!found) return;

  this.reciter = found;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, reciterId);
  }

  if (this.currentChapterNumber && this.currentVerseNumber) {
    const wasPlaying = this.isPlaying;
    const currVerse = this.currentVerseObj || this.currentVerseNumber;
    const currChapter = this.currentChapterNumber;

    if (wasPlaying) {
      this.playVerse(currVerse, currChapter, this.versesList, this.onLoadMore, true);
    } else {
      const audio = getAudioInstance();
      if (audio) {
        audio.src = this.getAudioUrl(currChapter, typeof currVerse === 'object' ? currVerse.verse : currVerse);
        audio.load();
      }
    }
  }
}
```

## Verification Plan

### Automated / Unit Tests
- Execute linting/typechecks or dev server build to verify syntax.

### Manual Verification
1. Start playing audio for a verse in Quran detail page.
2. Expand audio player and switch reciter.
3. Confirm audio instantly restarts playing from `0:00` with the new reciter.
4. Pause audio, switch reciter, and confirm player stays paused with new reciter loaded.
