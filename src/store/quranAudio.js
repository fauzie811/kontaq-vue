import { reactive } from 'vue';

export const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', folder: 'Alafasy_128kbps' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)', folder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)', folder: 'Abdul_Basit_Mujawwad_128kbps' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahmaan As-Sudais', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'Abu Bakr Al-Shatri', folder: 'Abu_Bakr_Ash-Shaatree_128kbps' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', folder: 'Husary_128kbps' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Minshawi (Murattal)', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'Minshawy_Mujawwad_192kbps', name: 'Minshawi (Mujawwad)', folder: 'Minshawy_Mujawwad_192kbps' },
  { id: 'Saood_ash-Shuraym_64kbps', name: 'Saood ash-Shuraym', folder: 'Saood_ash-Shuraym_64kbps' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub', folder: 'Muhammad_Ayyoub_128kbps' },
  { id: 'MaherAlMuaiqly128kbps', name: 'Maher Al Muaiqly', folder: 'MaherAlMuaiqly128kbps' },
  { id: 'Ghamadi_40kbps', name: 'Saad Al-Ghamadi', folder: 'Ghamadi_40kbps' },
  { id: 'Hani_Rifai_192kbps', name: 'Hani Ar-Rifai', folder: 'Hani_Rifai_192kbps' },
];

const LOCAL_STORAGE_KEY = 'kontaq_quran_reciter';

function getInitialReciter() {
  const savedId = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  const found = RECITERS.find(r => r.id === savedId);
  return found || RECITERS[0];
}

let audioInstance = null;

function getAudioInstance() {
  if (!audioInstance && typeof Audio !== 'undefined') {
    audioInstance = new Audio();
  }
  return audioInstance;
}

export const quranAudio = reactive({
  reciter: getInitialReciter(),
  isPlaying: false,
  isBuffering: false,
  error: null,
  currentVerseNumber: null,
  currentChapterNumber: null,
  currentVerseObj: null,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  versesList: [],
  onLoadMore: null,

  initAudioListeners() {
    const audio = getAudioInstance();
    if (!audio || audio._listenersAttached) return;

    audio._listenersAttached = true;

    audio.addEventListener('playing', () => {
      this.isPlaying = true;
      this.isBuffering = false;
      this.error = null;
    });

    audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    audio.addEventListener('waiting', () => {
      this.isBuffering = true;
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime || 0;
      this.duration = audio.duration || 0;
    });

    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playNext();
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isPlaying = false;
      this.isBuffering = false;
      this.error = 'Gagal memuat audio ayat.';
    });
  },

  getAudioUrl(chapterNumber, verseNumber) {
    const pad = (n) => String(n).padStart(3, '0');
    return `https://everyayah.com/data/${this.reciter.folder}/${pad(chapterNumber)}${pad(verseNumber)}.mp3`;
  },

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

  pause() {
    const audio = getAudioInstance();
    if (audio) {
      audio.pause();
      this.isPlaying = false;
    }
  },

  resume() {
    const audio = getAudioInstance();
    if (audio && audio.src) {
      audio.play().catch(err => console.error(err));
    }
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else if (this.currentVerseNumber) {
      this.resume();
    }
  },

  async playNext() {
    if (!this.currentVerseNumber || !this.versesList.length) return;

    const currentIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
    if (currentIndex >= 0 && currentIndex < this.versesList.length - 1) {
      const nextVerse = this.versesList[currentIndex + 1];
      this.playVerse(nextVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
    } else if (currentIndex === this.versesList.length - 1 && this.onLoadMore) {
      // Reached the end of current list, try loading more
      this.isBuffering = true;
      try {
        await this.onLoadMore();
        // Give reactive state a tiny tick to update versesList
        setTimeout(() => {
          const newIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
          if (newIndex >= 0 && newIndex < this.versesList.length - 1) {
            const nextVerse = this.versesList[newIndex + 1];
            this.playVerse(nextVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
          } else {
            this.stop();
          }
        }, 300);
      } catch (_) {
        this.stop();
      }
    } else {
      this.stop();
    }
  },

  playPrev() {
    if (!this.currentVerseNumber || !this.versesList.length) return;

    const currentIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
    if (currentIndex > 0) {
      const prevVerse = this.versesList[currentIndex - 1];
      this.playVerse(prevVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
    }
  },

  seek(seconds) {
    const audio = getAudioInstance();
    if (audio) {
      audio.currentTime = seconds;
      this.currentTime = seconds;
    }
  },

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

  setPlaybackRate(speed) {
    this.playbackRate = speed;
    const audio = getAudioInstance();
    if (audio) {
      audio.playbackRate = speed;
    }
  },

  stop() {
    const audio = getAudioInstance();
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    this.isPlaying = false;
    this.isBuffering = false;
    this.currentVerseNumber = null;
    this.currentChapterNumber = null;
    this.currentVerseObj = null;
  }
});
