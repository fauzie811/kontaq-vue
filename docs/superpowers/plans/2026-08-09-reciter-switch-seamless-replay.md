# Reciter Switch Seamless Replay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow switching the Quran audio reciter while playing to immediately replay the current verse from the beginning with the newly selected reciter instead of pausing audio.

**Architecture:** Add a `forcePlay` parameter to `playVerse` in `src/store/quranAudio.js` to bypass the play/pause toggle check when re-triggering playback programmatically from `setReciter`.

**Tech Stack:** Vue 3 Reactive Store (`reactive`), HTML5 Audio API, Vite.

## Global Constraints
- Preserve existing `quranAudio` reactive state properties and method signatures.
- Retain paused state when changing reciters while audio is paused.

---

### Task 1: Update `quranAudio.js` store for seamless reciter replay

**Files:**
- Modify: `src/store/quranAudio.js:93-131`, `src/store/quranAudio.js:204-227`

**Interfaces:**
- Consumes: `RECITERS`, `getAudioInstance()`, `getAudioUrl(chapterNumber, verseNumber)`
- Produces: `playVerse(verse, chapterNumber, versesList, onLoadMore, forcePlay)` and updated `setReciter(reciterId)`

- [ ] **Step 1: Update `playVerse` function signature and toggle logic**

In `src/store/quranAudio.js`, update `playVerse`:

```javascript
  playVerse(verse, chapterNumber, versesList = [], onLoadMore = null, forcePlay = false) {
    this.initAudioListeners();
    const audio = getAudioInstance();
    if (!audio) return;

    if (versesList.length > 0) {
      this.versesList = versesList;
    }
    if (onLoadMore) {
      this.onLoadMore = onLoadMore;
    }

    const verseNum = typeof verse === 'object' ? verse.verse : verse;
    const verseObj = typeof verse === 'object' ? verse : versesList.find(v => v.verse === verseNum);

    // Toggle pause if clicking current playing verse (unless forcePlay is true)
    if (!forcePlay && this.currentChapterNumber === chapterNumber && this.currentVerseNumber === verseNum && this.isPlaying) {
      this.pause();
      return;
    }

    this.currentChapterNumber = chapterNumber;
    this.currentVerseNumber = verseNum;
    this.currentVerseObj = verseObj || { verse: verseNum };
    this.error = null;

    const url = this.getAudioUrl(chapterNumber, verseNum);
    audio.src = url;
    audio.playbackRate = this.playbackRate;
    audio.load();

    this.isBuffering = true;
    audio.play().catch(err => {
      console.error('Play error:', err);
      this.isPlaying = false;
      this.isBuffering = false;
      this.error = 'Tidak dapat memutar audio.';
    });
  },
```

- [ ] **Step 2: Update `setReciter` method**

In `src/store/quranAudio.js`, update `setReciter`:

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
          const vNum = typeof currVerse === 'object' ? currVerse.verse : currVerse;
          audio.src = this.getAudioUrl(currChapter, vNum);
          audio.load();
        }
      }
    }
  },
```

- [ ] **Step 3: Build & verify project compilation**

Run build script to check for syntax errors or build issues:
`npm run build`

- [ ] **Step 4: Commit changes**

```bash
git add src/store/quranAudio.js
git commit -m "feat: replay current verse with new reciter on reciter switch while playing"
```
