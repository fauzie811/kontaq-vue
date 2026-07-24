<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-3 font-medium">Memuat daftar surah Al-Qur'an...</p>
    </div>

    <!-- 3-Column Surah List Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <div
        v-for="surah in surahs"
        :key="surah.number"
        @click="openSurah(surah)"
        class="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
      >
        <!-- Left: Surah Number & Titles -->
        <div class="flex items-center gap-3.5 min-w-0">
          <span class="text-emerald-800 bg-emerald-50 font-bold text-sm sm:text-base w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            {{ surah.number }}
          </span>

          <div class="min-w-0">
            <h3 class="text-gray-900 font-bold text-base sm:text-lg truncate group-hover:text-emerald-700 transition-colors">
              {{ surah.latin }}
            </h3>
            <p class="text-emerald-700 text-xs font-medium truncate mt-0.5">
              {{ surah.meaning }} <span class="text-gray-400">|</span> <span class="text-emerald-600">{{ surah.ayat }} ayat</span>
            </p>
          </div>
        </div>

        <!-- Right: Arabic Calligraphy -->
        <div dir="rtl" class="font-arabic text-2xl sm:text-3xl font-bold text-gray-800 shrink-0 ml-2 group-hover:scale-105 transition-transform dir-rtl">
          {{ surah.arabic }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listQuranChapters } from '@/api';

const router = useRouter();
const loading = ref(false);
const surahs = ref([]);

onMounted(async () => {
  try {
    if (surahs.value.length === 0) {
      loading.value = true;
    }
    const res = await listQuranChapters();
    if (res && res.data) {
      surahs.value = res.data;
    }
  } catch (e) {
    console.error('Failed to fetch quran chapters:', e);
  } finally {
    loading.value = false;
  }
});

function openSurah(surah) {
  router.push({ name: 'quran.show', params: { chapter: surah.number } });
}
</script>

<style scoped>
.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Dubai', serif;
}
</style>
