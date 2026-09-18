<template>
  <div class="max-w-6xl mx-auto space-y-8 sm:space-y-12">
    <!-- Navigation Bar: Beranda · Infaq & Shodaqoh · [category] -->
    <nav class="flex items-center justify-between gap-1.5 sm:gap-2 rounded-full bg-muted px-3.5 sm:px-10 py-2 sm:py-3">
      <router-link
        :to="{ name: 'home' }"
        class="font-medium text-primary text-sm sm:text-base hover:text-primary/80 transition-colors shrink-0"
      >
        Beranda
      </router-link>

      <div class="flex items-center gap-1.5 sm:gap-4 min-w-0">
        <span class="hidden sm:inline rounded-full bg-card font-medium text-primary text-sm sm:text-base px-5 py-2">Infaq &amp; Shodaqoh</span>

        <label class="relative flex items-center rounded-full bg-card min-w-0">
          <span class="sr-only">Pilih jenis infaq</span>
          <select
            v-model="selectedId"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-medium text-primary text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring truncate pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2 sm:min-w-56"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>
      </div>
      <div></div>
    </nav>

    <!-- Content: Text left, QRIS right -->
    <div class="grid grid-cols-1 md:grid-cols-13 gap-8 lg:gap-16 items-start max-w-4xl mx-auto">
      <div class="md:col-span-8 space-y-6 sm:space-y-8 text-foreground text-sm sm:text-base">
        <template v-if="selected.id === 'elearning'">
          <p class="text-justify">
            Infaq dan shodaqoh minimal 50.090 dan maksimal tanpa batas, untuk pengembangan tadabbur online
            learning berbasis web, melalui rekening:
          </p>
          <p class="font-medium">
            Bank Syariah Indonesia (BSI) 3779444390 a.n Meyrinda Rahmawaty Hilipito QQ KontaQ
          </p>
          <p class="text-justify">
            Tambahkan 'Kode 90' diakhir nominal transfer. Bagi yang tidak menambahkan kode tersebut, maka
            infaq akan dialokasikan untuk operasional dakwah lainnya
          </p>
        </template>
        <p v-else class="text-justify">{{ selected.text }}</p>

        <a
          href="https://wa.me/6285345147157"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 hover:text-primary transition-colors min-h-[44px]"
        >
          <img src="@/assets/icon-phone.png" alt="" class="w-10 h-auto shrink-0" />
          <span>Konfirmasi: 0853-4514-7157</span>
        </a>
      </div>

      <div class="md:col-span-5 flex justify-center md:justify-end">
        <img
          src="@/assets/qris.png"
          alt="QRIS KontaQ — Satu QRIS untuk semua"
          class="w-full max-w-[18rem]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ChevronUp, ChevronDown, Smartphone } from 'lucide-vue-next';

const categories = [
  { id: 'elearning', label: 'E-Learning' },
  {
    id: 'operasional',
    label: 'Operasional Dakwah',
    text: 'Untuk penyebaran materi dakwah “Tadabbur 1 Hari 1 Halaman”, infaq yang disumbangkan insyaAllaah menjadi amal jariyah yang akan terus mengalir, sepanjang Al-Qur\'an dibaca, ditadabburkan dan diamalkan',
  },
  { id: 'jumat10', label: "Jum'at 10", text: "Yuk, ikut syiarkan Al-Qur'an hanya dengan 10 Ribu!" },
];

const selectedId = ref(categories[0].id);
const selected = computed(() => categories.find((cat) => cat.id === selectedId.value));
</script>
