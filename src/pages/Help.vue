<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <PageHeader
      class="mb-6 sm:mb-8"
      page-title="Pusat Bantuan & FAQ"
      description="Temukan jawaban cepat atas pertanyaan yang sering diajukan seputar program dan fitur KontaQ."
    />

    <!-- Search Box Card -->
    <div class="bg-card rounded-3xl border border-border p-4 sm:p-5 shadow-xs space-y-3">
      <div class="relative flex items-center bg-muted/60 border border-border rounded-2xl px-4 py-3 focus-within:bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-2xs">
        <Search class="w-5 h-5 text-primary shrink-0 mr-3" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pertanyaan atau kata kunci (contoh: kholas, kuis, infaq, sertifikat)..."
          class="w-full text-sm sm:text-base border-0 border-none outline-none focus:outline-none focus:ring-0 shadow-none text-foreground placeholder-muted-foreground bg-transparent font-medium p-0"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="w-5 h-5 rounded-full bg-muted hover:bg-secondary text-muted-foreground flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer ml-2"
          title="Hapus kata kunci"
        >
          <X class="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs no-scrollbar">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            selectedCategory === cat
              ? 'bg-primary text-primary-foreground font-bold shadow-xs'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium',
            'px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer shrink-0 active:scale-95'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Skeletons while loading -->
    <div v-if="isLoading" class="space-y-3">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-3"
      >
        <div class="flex justify-between items-center">
          <div class="h-5 w-3/4 bg-muted rounded"></div>
          <div class="h-5 w-5 bg-muted rounded-full"></div>
        </div>
        <div class="h-4 w-1/4 bg-muted/60 rounded"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredFaqs.length === 0"
      class="bg-card rounded-3xl border border-border p-10 text-center space-y-3 shadow-xs"
    >
      <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
        <HelpCircle class="w-6 h-6" />
      </div>
      <h3 class="font-bold text-base text-foreground">Tidak Ada Hasil</h3>
      <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
        Tidak menemukan jawaban untuk "<span class="font-semibold text-foreground">{{ searchQuery }}</span>". Coba gunakan kata kunci lain atau hubungi admin.
      </p>
      <button
        @click="searchQuery = ''; selectedCategory = 'Semua'"
        class="mt-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-bold rounded-full transition cursor-pointer"
      >
        Reset Filter
      </button>
    </div>

    <!-- FAQ Accordion List -->
    <div v-else class="space-y-3">
      <div
        v-for="faq in filteredFaqs"
        :key="faq.id"
        class="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden transition-all duration-200 hover:border-primary/40"
      >
        <!-- Accordion Question Header -->
        <button
          @click="toggleFaq(faq.id)"
          class="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-muted/30 focus:outline-none"
          :aria-expanded="expandedIds.includes(faq.id)"
        >
          <div class="space-y-1.5 min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                v-if="faq.category"
                class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary"
              >
                {{ faq.category }}
              </span>
            </div>
            <h3 class="text-sm sm:text-base font-bold text-foreground leading-snug">
              {{ faq.question }}
            </h3>
          </div>

          <div
            class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5"
            :class="{ 'rotate-180 bg-primary/10 text-primary': expandedIds.includes(faq.id) }"
          >
            <ChevronDown class="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>

        <!-- Accordion Answer Body -->
        <div
          v-if="expandedIds.includes(faq.id)"
          class="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-border/50 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <p class="whitespace-pre-line text-foreground/90">{{ faq.answer }}</p>
        </div>
      </div>
    </div>

    <!-- Additional Help / Support Contact Card -->
    <div class="bg-gradient-to-br from-primary/10 via-secondary/40 to-card rounded-3xl border border-primary/20 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mt-8">
      <div class="space-y-1">
        <h4 class="text-base font-bold text-foreground">Masih butuh bantuan lain?</h4>
        <p class="text-xs sm:text-sm text-muted-foreground">
          Jika pertanyaan Anda belum tercantum di sini, silakan hubungi Musyrif kelompok atau Admin KontaQ.
        </p>
      </div>
      <router-link
        :to="{ name: 'forum' }"
        class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold rounded-full shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
      >
        Tanya di Forum Ukhuwah
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown, HelpCircle, Search, X } from 'lucide-vue-next';
import { listFaqs } from '@/api';
import PageHeader from '@/components/PageHeader.vue';

const route = useRoute();
const isLoading = ref(true);
const faqs = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('Semua');
const expandedIds = ref([]);

const defaultFaqs = [
  {
    id: 1,
    question: 'Apa itu KontaQ dan program Tadabbur 1 Hari 1 Halaman?',
    answer: 'KontaQ (Komunitas Tadabbur Al-Qur\'an) adalah platform dan komunitas pembelajaran Al-Qur\'an terstruktur melalui program "Tadabbur 1 Hari 1 Halaman". Peserta diajak membaca, memahami makna, merenungkan hikmah (tadabbur), dan mengamalkan isi ayat Al-Qur\'an setiap harinya.',
    category: 'Program Tadabbur',
    order: 1,
  },
  {
    id: 2,
    question: 'Apa maksud status Kholas dan bagaimana cara menandainya?',
    answer: 'Kholas berarti Anda telah menyelesaikan tilawah dan menyimak materi tadabbur harian. Anda dapat menandai kholas dengan menekan tombol centang/kholas pada halaman materi atau melalui rekapan presensi harian.',
    category: 'Program Tadabbur',
    order: 2,
  },
  {
    id: 3,
    question: 'Bagaimana cara membaca Surah dan Ayat Al-Qur\'an di aplikasi?',
    answer: 'Anda dapat mengakses Al-Qur\'an digital melalui menu Tadabbur atau menggunakan fitur pencarian di pojok kanan atas dengan mengetik "# [Nama Surah]" (contoh: # Al-Kahf) atau "@ [Ayat]" (contoh: @ 2:255 atau @ Pengasih).',
    category: 'Program Tadabbur',
    order: 3,
  },
  {
    id: 4,
    question: 'Apakah materi Tadabbur bisa diakses kembali jika tertinggal?',
    answer: 'Ya, seluruh materi pekan berjalan maupun arsip pekan sebelumnya tetap dapat diakses melalui menu Tadabbur atau halaman Materi.',
    category: 'Program Tadabbur',
    order: 4,
  },
  {
    id: 5,
    question: 'Kapan Kuis dan Evaluasi pekanan dibuka?',
    answer: 'Kuis pekanan dibuka setiap akhir pekan setelah seluruh materi harian pada pekan tersebut selesai dipelajari. Evaluasi diberikan secara berkala untuk menguji pemahaman komprehensif materi tadabbur.',
    category: 'Kuis & Evaluasi',
    order: 5,
  },
  {
    id: 6,
    question: 'Bagaimana jika nilai kuis belum mencapai batas minimal?',
    answer: 'Anda dapat meninjau kembali materi terkait dan mengulang kuis jika diizinkan oleh sistem atau pembimbing kelompok Anda.',
    category: 'Kuis & Evaluasi',
    order: 6,
  },
  {
    id: 7,
    question: 'Bagaimana jika saya terlambat menyimak materi atau mengisi presensi?',
    answer: 'Jika berhalangan atau terlambat karena udzur syar\'i/alasan tertentu, Anda dapat mengajukan permohonan melalui menu Izin Terlambat. Permohonan Anda akan ditinjau oleh Musyrif/Admin.',
    category: 'Perizinan & Kelulusan',
    order: 7,
  },
  {
    id: 8,
    question: 'Apa syarat untuk mendapatkan Sertifikat Kelulusan?',
    answer: 'Sertifikat diterbitkan untuk peserta yang konsisten menyelesaikan materi tadabbur harian, menyelesaikan kuis serta evaluasi dengan nilai memenuhi passing grade, dan memenuhi batas minimal kehadiran.',
    category: 'Perizinan & Kelulusan',
    order: 8,
  },
  {
    id: 9,
    question: 'Bagaimana cara menyalurkan infaq dan donasi untuk KontaQ?',
    answer: 'Infaq dapat disalurkan melalui menu Infaq. Anda dapat melakukan transfer ke rekening Bank Syariah Indonesia (BSI) 777-888-9990 a.n. Komunitas Tadabbur Al-Qur\'an atau melakukan scan QRIS menggunakan aplikasi perbankan/e-wallet.',
    category: 'Infaq & Donasi',
    order: 9,
  },
  {
    id: 10,
    question: 'Apakah ada nominal minimal untuk berinfaq?',
    answer: 'Infaq dan shodaqoh dianjurkan minimal Rp 50.090 dan maksimal tanpa batas. Dana infaq digunakan untuk operasional dakwah, pengembangan sistem website, dan penyebaran materi tadabbur.',
    category: 'Infaq & Donasi',
    order: 10,
  },
  {
    id: 11,
    question: 'Bagaimana cara menggunakan fitur pencarian cepat dan pintasan prefix?',
    answer: 'Tekan tombol pencarian di atas atau shortcut ⌘K / Ctrl+K. Gunakan prefix khusus di awal kata pencarian:\n• # : mencari nama/nomor Surah (contoh: # Yasin)\n• @ : mencari Ayat Al-Qur\'an (contoh: @ Ar-Rahman)\n• ! : mencari Materi Tadabbur (contoh: ! Sabar)\n• ? : mencari Bantuan & Tanya Jawab FAQ (contoh: ? kholas)',
    category: 'Pencarian & Akun',
    order: 11,
  },
  {
    id: 12,
    question: 'Bagaimana cara mengganti foto profil atau mengubah password?',
    answer: 'Klik ikon profil Anda di sudut kanan atas, lalu pilih "Profil Saya". Di halaman profil, Anda dapat memperbarui foto avatar, nama lengkap, nomor WhatsApp, serta mengubah kata sandi akun.',
    category: 'Pencarian & Akun',
    order: 12,
  },
];

async function loadFaqs() {
  isLoading.value = true;
  try {
    const res = await listFaqs();
    if (res && res.success && res.data && res.data.length > 0) {
      faqs.value = res.data;
    } else {
      faqs.value = defaultFaqs;
    }
  } catch (e) {
    faqs.value = defaultFaqs;
  } finally {
    isLoading.value = false;
    handleInitialRouteQuery();
  }
}

function handleInitialRouteQuery() {
  if (route.query.q) {
    searchQuery.value = String(route.query.q);
    if (faqs.value.length > 0) {
      const match = faqs.value.find((f) =>
        f.question.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      if (match) {
        expandedIds.value = [match.id];
      }
    }
  } else if (route.query.id) {
    const targetId = Number(route.query.id);
    if (targetId) {
      expandedIds.value = [targetId];
    }
  } else if (faqs.value.length > 0) {
    expandedIds.value = [faqs.value[0].id];
  }
}

onMounted(() => {
  loadFaqs();
});

watch(() => route.query, () => {
  handleInitialRouteQuery();
});

const categories = computed(() => {
  const cats = new Set(['Semua']);
  faqs.value.forEach((item) => {
    if (item.category) {
      cats.add(item.category);
    }
  });
  return Array.from(cats);
});

const filteredFaqs = computed(() => {
  let list = faqs.value;

  if (selectedCategory.value !== 'Semua') {
    list = list.filter((item) => item.category === selectedCategory.value);
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        (item.answer && item.answer.toLowerCase().includes(q))
    );
  }

  return list;
});

function toggleFaq(id) {
  const index = expandedIds.value.indexOf(id);
  if (index > -1) {
    expandedIds.value.splice(index, 1);
  } else {
    expandedIds.value.push(id);
  }
}
</script>
