<template>
  <div>
    <div v-if="filteredSurahs.length === 0" class="text-center py-12 text-gray-500">
      Surah tidak ditemukan untuk kata kunci "{{ searchQuery }}"
    </div>

    <!-- 3-Column Surah List Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <div
        v-for="surah in filteredSurahs"
        :key="surah.number"
        @click="openSurah(surah)"
        class="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
      >
        <!-- Left: Surah Number & Titles -->
        <div class="flex items-center gap-3.5 min-w-0">
          <span class="text-gray-900 font-bold text-xl sm:text-2xl w-6 sm:w-8 text-center flex-shrink-0">
            {{ surah.number }}
          </span>

          <div class="min-w-0">
            <h3 class="text-gray-900 font-bold text-lg sm:text-xl truncate group-hover:text-emerald-700 transition-colors">
              {{ surah.latin }}
            </h3>
            <p class="text-emerald-700 text-xs sm:text-sm font-medium truncate mt-0.5">
              {{ surah.meaning }} <span class="text-emerald-600">| {{ surah.ayat }} ayat</span>
            </p>
          </div>
        </div>

        <!-- Right: Arabic Calligraphy -->
        <div class="font-arabic text-2xl sm:text-3xl font-bold text-gray-900 flex-shrink-0 ml-2 group-hover:scale-105 transition-transform dir-rtl">
          {{ surah.arabic }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listMyMaterials } from '@/api';

const router = useRouter();
const searchQuery = ref('');

const defaultSurahs = [
  { number: 1, latin: 'Al-Fatihah', meaning: 'pembukaan', ayat: 7, arabic: 'الفَاتِحَة' },
  { number: 2, latin: 'Al-Baqarah', meaning: 'sapi betina', ayat: 286, arabic: 'البَقَرَة' },
  { number: 3, latin: "Ali 'Imran", meaning: "keluarga 'imran", ayat: 200, arabic: 'آل عِمْرَان' },
  { number: 4, latin: "An-Nisa'", meaning: 'wanita', ayat: 176, arabic: 'النِّسَاء' },
  { number: 5, latin: "Al-Ma'idah", meaning: 'hidangan', ayat: 120, arabic: 'المَائِدَة' },
  { number: 6, latin: "Al-An'am", meaning: 'hewan ternak', ayat: 165, arabic: 'الأَنْعَام' },
  { number: 7, latin: "Al-A'raf", meaning: 'tempat tertinggi', ayat: 206, arabic: 'الأَعْرَاف' },
  { number: 8, latin: 'Al-Anfal', meaning: 'rampasan perang', ayat: 75, arabic: 'الأَنْفَال' },
  { number: 9, latin: 'At-Tawbah', meaning: 'pengampunan', ayat: 129, arabic: 'التَّوْبَة' },
  { number: 10, latin: 'Yunus', meaning: 'nabi yunus', ayat: 109, arabic: 'يُونُس' },
  { number: 11, latin: 'Hud', meaning: 'nabi hud', ayat: 123, arabic: 'هُود' },
  { number: 12, latin: 'Yusuf', meaning: 'nabi yusuf', ayat: 111, arabic: 'يُوسُف' },
  { number: 13, latin: "Ar-Ra'd", meaning: 'guruh', ayat: 43, arabic: 'الرَّعْد' },
  { number: 14, latin: 'Ibrahim', meaning: 'nabi ibrahim', ayat: 52, arabic: 'إِبْرَاهِيم' },
  { number: 15, latin: 'Al-Hijr', meaning: 'gunung al hijr', ayat: 99, arabic: 'الحِجْر' },
];

const surahs = ref([...defaultSurahs]);

onMounted(async () => {
  try {
    const res = await listMyMaterials({ page: 1 });
    if (res && res.data && res.data.length > 0) {
      const apiSurahs = res.data.map((item, idx) => ({
        id: item.id,
        number: item.chapter || item.number || idx + 1,
        latin: item.title || item.name || `Surah ${idx + 1}`,
        meaning: item.category?.name || 'materi tadabbur',
        ayat: item.total_verses || item.verses_count || 7,
        arabic: item.arabic_title || 'الفاتحة',
      }));
      if (apiSurahs.length > 0) {
        surahs.value = apiSurahs;
      }
    }
  } catch (e) {
    console.warn('Using default surah list:', e);
  }
});

const filteredSurahs = computed(() => {
  if (!searchQuery.value) return surahs.value;
  const q = searchQuery.value.toLowerCase().replace(/^[#@?]\s*/, '').trim();
  if (!q) return surahs.value;
  return surahs.value.filter(
    (s) =>
      s.latin.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.number.toString().includes(q)
  );
});

function openSurah(surah) {
  if (surah.id) {
    router.push({ name: 'materials.show', params: { id: surah.id } });
  } else {
    router.push({ name: 'materials' });
  }
}
</script>

<style scoped>
.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Dubai', serif;
}
</style>
