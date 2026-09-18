<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Help / Q&A Banner -->
    <div class="bg-primary/5 border border-primary/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          <HelpIcon class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold text-foreground text-sm sm:text-base">Butuh penjelasan atau panduan Tadabbur?</h3>
          <p class="text-xs sm:text-sm text-muted-foreground">Kunjungi menu Bantuan untuk melihat tanya jawab (Q&A).</p>
        </div>
      </div>
      <router-link
        :to="{ name: 'help', query: { q: 'Tadabbur' } }"
        class="shrink-0 w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full text-xs sm:text-sm transition-all active:scale-95 text-center"
      >
        Lihat Q&A Tadabbur
      </router-link>
    </div>


    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground text-sm mt-3 font-medium">Memuat daftar surah Al-Qur'an...</p>
    </div>

    <!-- 3-Column Surah List Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <div
        v-for="surah in surahs"
        :key="surah.number"
        @click="openSurah(surah)"
        class="bg-card rounded-3xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group text-card-foreground"
      >
        <!-- Left: Surah Number & Titles -->
        <div class="flex items-center gap-3.5 min-w-0">
          <span class="text-primary bg-primary/10 font-bold text-sm sm:text-base w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {{ surah.number }}
          </span>

          <div class="min-w-0">
            <h3 class="text-foreground font-medium text-base sm:text-lg truncate group-hover:text-primary transition-colors">
              {{ surah.latin }}
            </h3>
            <p class="text-muted-foreground text-xs font-medium truncate mt-0.5">
              {{ surah.meaning }} <span class="opacity-40">|</span> <span class="text-primary">{{ surah.ayat }} ayat</span>
            </p>
          </div>
        </div>

        <!-- Right: Surah Name Calligraphy -->
        <SurahName
          :chapter="surah.number"
          customClass="text-3xl sm:text-4xl text-foreground shrink-0 ml-2 group-hover:text-primary group-hover:scale-105 transition-all"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listQuranChapters } from '@/api';
import SurahName from '@/components/SurahName.vue';
import { FEATURES } from '@/constants/features';

const HelpIcon = FEATURES.help.icon;

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
