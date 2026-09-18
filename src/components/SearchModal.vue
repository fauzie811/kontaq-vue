<template>
  <Teleport to="body">
    <!-- Backdrop (Desktop & Mobile) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
        @click="emitClose"
      ></div>
    </Transition>

    <!-- Mobile Bottom Sheet (< sm breakpoint) -->
    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="isOpen"
        class="sm:hidden fixed bottom-0 inset-x-0 bg-card rounded-t-3xl border-t border-border z-50 max-h-[92vh] flex flex-col overflow-hidden"
      >
        <!-- Grab Handle -->
        <div
          class="pt-3 pb-1.5 flex justify-center cursor-grab active:cursor-grabbing shrink-0"
          @click="emitClose"
        >
          <div class="w-12 h-1.5 bg-muted-foreground/30 rounded-full"></div>
        </div>

        <!-- Search Input Header (Mobile) -->
        <div class="px-4 py-2.5 border-b border-border bg-card flex items-center gap-2 shrink-0">
          <div
            class="flex-1 flex items-center gap-2.5 bg-muted/80 border border-input rounded-full px-3.5 py-2.5 hover:border-foreground/40 focus-within:bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <Search class="w-5 h-5 text-primary shrink-0" />
            <input
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Cari Surah, ayat, materi, bantuan..."
              class="w-full text-base border-0 border-none outline-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground bg-transparent font-medium p-0"
              @keydown.esc.prevent.stop="handleEscKey"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectCurrentItem"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="w-6 h-6 rounded-full bg-muted-foreground/15 hover:bg-muted-foreground/25 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer active:scale-95"
              title="Hapus kata kunci"
            >
              <X class="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
          <button
            @click="emitClose"
            class="w-10 h-10 rounded-full bg-muted/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border shrink-0 cursor-pointer active:scale-95"
            title="Tutup pencarian"
          >
            <X class="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        <!-- Filter Chips (Mobile) -->
        <div
          class="px-4 py-2 bg-muted/40 flex items-center gap-1.5 text-xs border-b border-border overflow-x-auto no-scrollbar shrink-0"
        >
          <button
            @click="setFilter('')"
            :class="[
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
              'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer shrink-0 active:scale-95'
            ]"
          >
            Semua
          </button>
          <button
            @click="setFilter('# ')"
            :class="[
              activeFilter === 'chapters'
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
              'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95'
            ]"
          >
            <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'chapters' }">#</span>
            Surah
          </button>
          <button
            @click="setFilter('@ ')"
            :class="[
              activeFilter === 'verses'
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
              'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95'
            ]"
          >
            <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'verses' }">@</span>
            Ayat
          </button>
          <button
            @click="setFilter('! ')"
            :class="[
              activeFilter === 'materials'
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
              'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95'
            ]"
          >
            <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'materials' }">!</span>
            Tadabbur
          </button>
          <button
            @click="setFilter('? ')"
            :class="[
              activeFilter === 'faqs'
                ? 'bg-primary text-primary-foreground border-primary font-bold'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
              'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95'
            ]"
          >
            <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'faqs' }">?</span>
            Bantuan
          </button>
        </div>

        <!-- Search Results / Content Body (Mobile) -->
        <div
          ref="mobileScrollContainerRef"
          class="overflow-y-auto p-4 space-y-4 flex-1 overscroll-contain"
        >
          <!-- Loading State Skeleton -->
          <div v-if="isSearching" class="space-y-4 py-2">
            <div class="flex items-center justify-between px-1">
              <div class="h-3.5 w-24 bg-muted animate-pulse rounded-md"></div>
              <div class="h-3.5 w-10 bg-muted animate-pulse rounded-md"></div>
            </div>
            <div class="space-y-2">
              <div
                v-for="n in 3"
                :key="n"
                class="p-3.5 bg-muted/40 rounded-2xl border border-border animate-pulse flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-muted"></div>
                  <div class="space-y-1.5">
                    <div class="h-4 w-28 bg-muted rounded"></div>
                    <div class="h-3 w-40 bg-muted/70 rounded"></div>
                  </div>
                </div>
                <div class="h-6 w-16 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          <!-- Initial / Empty Query State (Mobile) -->
          <div v-else-if="!searchQuery.trim()" class="py-2 space-y-5">
            <!-- Quick Surah Jump -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between px-1">
                <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Flame class="w-3.5 h-3.5 text-accent" />
                  Surah Pilihan
                </span>
                <span class="text-xs text-muted-foreground">Akses Cepat</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="surah in popularSurahs"
                  :key="surah.number"
                  @click="handleSelectSurah(surah)"
                  class="p-2.5 bg-muted/40 hover:bg-secondary/70 border border-border hover:border-primary/30 rounded-2xl text-left transition-all group flex items-center justify-between cursor-pointer active:scale-95"
                >
                  <div class="min-w-0 pr-1.5">
                    <div class="flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {{ surah.number }}
                      </span>
                      <p class="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {{ surah.name }}
                      </p>
                    </div>
                    <p class="text-xs text-muted-foreground truncate ml-6.5 mt-0.5">
                      {{ surah.meaning }}
                    </p>
                  </div>
                  <SurahName
                    :chapter="surah.number"
                    customClass="text-2xl text-foreground/80 shrink-0"
                  />
                </button>
              </div>
            </div>

            <!-- Shortcut Guides -->
            <div class="space-y-2 pt-2 border-t border-border/80">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                <Compass class="w-3.5 h-3.5 text-primary" />
                Panduan Pintasan
              </p>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="guide in shortcutGuides"
                  :key="guide.prefix"
                  @click="setFilter(guide.prefix + ' ')"
                  class="p-2.5 bg-muted/30 hover:bg-secondary/60 border border-border/80 rounded-2xl flex items-center justify-between cursor-pointer transition group"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-7 h-7 rounded-xl bg-card border border-border font-mono font-bold text-xs text-primary flex items-center justify-center shrink-0 group-hover:border-primary/40">
                      {{ guide.prefix }}
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {{ guide.title }}
                      </p>
                      <p class="text-xs text-muted-foreground truncate">
                        {{ guide.desc }}
                      </p>
                    </div>
                  </div>
                  <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>

          <!-- No Results State (Mobile) -->
          <div
            v-else-if="!hasSearchResults"
            class="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3"
          >
            <div class="w-12 h-12 rounded-2xl bg-muted/80 border border-border flex items-center justify-center text-muted-foreground">
              <SearchX class="w-6 h-6 text-muted-foreground" />
            </div>
            <div class="space-y-1 max-w-xs">
              <h4 class="font-bold text-sm text-foreground">
                Tidak ada hasil ditemukan
              </h4>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Tidak ditemukan hasil untuk "<span class="font-semibold text-foreground">{{ searchQuery }}</span>". Coba kata kunci lain atau periksa filter.
              </p>
            </div>
            <button
              @click="clearSearch"
              class="px-3.5 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-xs rounded-full border border-border transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              Reset Pencarian
            </button>
          </div>

          <!-- Results List (Mobile) -->
          <div v-else class="space-y-5">
            <!-- 1. Surah Results -->
            <div
              v-if="searchResults.chapters && searchResults.chapters.length > 0"
              class="space-y-2"
            >
              <div class="flex items-center justify-between px-1">
                <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                  <BookOpen class="w-3.5 h-3.5" />
                  Surah ({{ searchResults.chapters.length }})
                </h4>
              </div>
              <div class="space-y-1.5">
                <div
                  v-for="surah in searchResults.chapters"
                  :key="surah.number"
                  :data-item-key="`surah-${surah.number}`"
                  @click="handleSelectSurah(surah)"
                  :class="[
                    isItemSelected(`surah-${surah.number}`)
                      ? 'bg-secondary/90 border-primary/40 ring-2 ring-primary/20'
                      : 'bg-muted/40 hover:bg-secondary/70 border-border',
                    'p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]'
                  ]"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {{ surah.number }}
                    </span>
                    <div class="min-w-0">
                      <p class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {{ surah.latin }}
                      </p>
                      <p class="text-xs text-muted-foreground truncate">
                        {{ surah.meaning }} • {{ surah.ayat }} ayat
                      </p>
                    </div>
                  </div>
                  <SurahName
                    :chapter="surah.number"
                    customClass="text-2xl sm:text-3xl text-foreground/90 ml-2 shrink-0"
                  />
                </div>
              </div>
            </div>

            <!-- 2. Verse Results -->
            <div
              v-if="searchResults.verses && searchResults.verses.length > 0"
              class="space-y-2 pt-2 border-t border-border"
            >
              <div class="flex items-center justify-between px-1">
                <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                  <FileText class="w-3.5 h-3.5" />
                  Ayat Al-Qur'an ({{ searchResults.verses.length }})
                </h4>
              </div>
              <div class="space-y-2">
                <div
                  v-for="verse in searchResults.verses"
                  :key="verse.id || `${verse.chapter}-${verse.verse}`"
                  :data-item-key="`verse-${verse.id || `${verse.chapter}-${verse.verse}`}`"
                  @click="handleSelectVerse(verse)"
                  :class="[
                    isItemSelected(`verse-${verse.id || `${verse.chapter}-${verse.verse}`}`)
                      ? 'bg-secondary/90 border-primary/40 ring-2 ring-primary/20'
                      : 'bg-muted/40 hover:bg-secondary/70 border-border',
                    'p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 group active:scale-[0.98]'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <BookOpen class="w-3 h-3 text-accent" />
                      QS {{ verse.surah ? verse.surah.latin : 'Surah ' + verse.chapter }}: {{ verse.verse }}
                    </span>
                    <span class="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
                      Buka Ayat &rarr;
                    </span>
                  </div>
                  <p class="font-quran text-lg text-foreground text-right dir-rtl font-bold leading-[2.2em]">
                    {{ verse.text }}
                    <QuranVerseNumber :number="verse.verse" />
                  </p>
                  <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {{ verse.translation }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 3. Material Results -->
            <div
              v-if="searchResults.materials && searchResults.materials.length > 0"
              class="space-y-2 pt-2 border-t border-border"
            >
              <div class="flex items-center justify-between px-1">
                <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                  <Sparkles class="w-3.5 h-3.5" />
                  Materi Tadabbur ({{ searchResults.materials.length }})
                </h4>
              </div>
              <div class="space-y-1.5">
                <div
                  v-for="material in searchResults.materials"
                  :key="material.id"
                  :data-item-key="`material-${material.id}`"
                  @click="handleSelectMaterial(material)"
                  :class="[
                    isItemSelected(`material-${material.id}`)
                      ? 'bg-secondary/90 border-primary/40 ring-2 ring-primary/20'
                      : 'bg-muted/40 hover:bg-secondary/70 border-border',
                    'p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]'
                  ]"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen class="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {{ material.title }}
                      </p>
                      <p class="text-xs text-muted-foreground truncate mt-0.5">
                        {{ material.week ? 'Pekan ' + material.week : 'Materi Tadabbur' }}
                      </p>
                    </div>
                  </div>
                  <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </div>
              </div>
            </div>

            <!-- 4. FAQ / Bantuan Results -->
            <div
              v-if="searchResults.faqs && searchResults.faqs.length > 0"
              class="space-y-2 pt-2 border-t border-border"
            >
              <div class="flex items-center justify-between px-1">
                <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                  <HelpCircle class="w-3.5 h-3.5" />
                  Bantuan & FAQ ({{ searchResults.faqs.length }})
                </h4>
              </div>
              <div class="space-y-1.5">
                <div
                  v-for="faq in searchResults.faqs"
                  :key="faq.id"
                  :data-item-key="`faq-${faq.id}`"
                  @click="handleSelectFaq(faq)"
                  :class="[
                    isItemSelected(`faq-${faq.id}`)
                      ? 'bg-secondary/90 border-primary/40 ring-2 ring-primary/20'
                      : 'bg-muted/40 hover:bg-secondary/70 border-border',
                    'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between group active:scale-[0.98]'
                  ]"
                >
                  <div class="min-w-0 flex-1 pr-3">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        v-if="faq.category"
                        class="px-2 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                      >
                        {{ faq.category }}
                      </span>
                    </div>
                    <p class="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                      {{ faq.question }}
                    </p>
                    <p class="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {{ faq.answer }}
                    </p>
                  </div>
                  <HelpCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Desktop Search Modal Popup (>= sm breakpoint) -->
    <Transition
      enter-active-class="transition duration-200 ease-out transform"
      enter-from-class="opacity-0 scale-[0.97]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in transform"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.97]"
    >
      <div
        v-if="isOpen"
        class="hidden sm:flex fixed inset-0 z-50 items-start justify-center pt-16 sm:pt-20 px-4 pointer-events-none"
      >
        <div
          class="bg-card rounded-3xl w-full max-w-2xl overflow-hidden border border-border flex flex-col max-h-[82vh] pointer-events-auto backdrop-blur-xl"
        >
          <!-- Search Input Header (Desktop) -->
          <div class="p-4 border-b border-border flex items-center gap-3 bg-card shrink-0">
            <div
              class="flex-1 flex items-center gap-3 bg-muted/80 border border-input rounded-full px-4 py-3 hover:border-foreground/40 focus-within:bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
              <Search class="w-5 h-5 text-primary shrink-0" />
              <input
                ref="desktopSearchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Cari Surah, ayat, materi tadabbur, bantuan (# surah, @ ayat)..."
                class="w-full text-base sm:text-lg border-0 border-none outline-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground bg-transparent font-medium p-0"
                @keydown.esc.prevent.stop="handleEscKey"
                @keydown.down.prevent="navigateDown"
                @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="selectCurrentItem"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="w-6 h-6 rounded-full bg-muted-foreground/15 hover:bg-muted-foreground/25 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer active:scale-95"
                title="Hapus kata kunci"
              >
                <X class="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                @click="handleEscKey"
                class="hidden sm:inline-flex items-center text-xs bg-card px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary font-mono font-bold select-none transition-colors cursor-pointer"
                :title="searchQuery ? 'Hapus kata kunci (ESC)' : 'Tutup pencarian (ESC)'"
              >
                ESC
              </button>
            </div>
            <button
              @click="emitClose"
              class="w-11 h-11 rounded-full bg-muted/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border cursor-pointer shrink-0 active:scale-95"
              title="Tutup pencarian"
            >
              <X class="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          <!-- Filter Chips / Category Selector (Desktop) -->
          <div
            class="px-5 py-2.5 bg-muted/40 flex items-center justify-between text-xs border-b border-border shrink-0"
          >
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-muted-foreground mr-1 text-xs uppercase tracking-wider">Kategori:</span>
              <button
                @click="setFilter('')"
                :class="[
                  activeFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
                  'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer active:scale-95'
                ]"
              >
                Semua
              </button>
              <button
                @click="setFilter('# ')"
                :class="[
                  activeFilter === 'chapters'
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
                  'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95'
                ]"
              >
                <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'chapters' }">#</span>
                Surah
              </button>
              <button
                @click="setFilter('@ ')"
                :class="[
                  activeFilter === 'verses'
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
                  'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95'
                ]"
              >
                <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'verses' }">@</span>
                Ayat
              </button>
              <button
                @click="setFilter('! ')"
                :class="[
                  activeFilter === 'materials'
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
                  'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95'
                ]"
              >
                <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'materials' }">!</span>
                Tadabbur
              </button>
              <button
                @click="setFilter('? ')"
                :class="[
                  activeFilter === 'faqs'
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border-border font-medium',
                  'px-2.5 py-1 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95'
                ]"
              >
                <span class="font-mono text-primary font-bold" :class="{ 'text-primary-foreground': activeFilter === 'faqs' }">?</span>
                Bantuan
              </button>
            </div>

            <div v-if="searchQuery" class="text-xs text-muted-foreground font-medium">
              <span v-if="isSearching" class="text-primary flex items-center gap-1">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Mencari...
              </span>
              <span v-else-if="hasSearchResults">
                {{ totalResultsCount }} hasil
              </span>
            </div>
          </div>

          <!-- Search Content Body (Desktop) -->
          <div
            ref="desktopScrollContainerRef"
            class="overflow-y-auto p-5 space-y-6 flex-1 overscroll-contain"
          >
            <!-- Loading Skeleton (Desktop) -->
            <div v-if="isSearching" class="space-y-4 py-2">
              <div class="flex items-center justify-between px-1">
                <div class="h-4 w-32 bg-muted animate-pulse rounded-md"></div>
                <div class="h-3.5 w-12 bg-muted animate-pulse rounded-md"></div>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="p-3.5 bg-muted/40 rounded-2xl border border-border animate-pulse flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-muted"></div>
                    <div class="space-y-1.5">
                      <div class="h-4 w-24 bg-muted rounded"></div>
                      <div class="h-3 w-32 bg-muted/70 rounded"></div>
                    </div>
                  </div>
                  <div class="h-6 w-14 bg-muted rounded"></div>
                </div>
              </div>
            </div>

            <!-- Initial / Empty Query State (Desktop) -->
            <div v-else-if="!searchQuery.trim()" class="py-2 space-y-6">
              <!-- Popular Surahs Quick Jump -->
              <div class="space-y-3">
                <div class="flex items-center justify-between px-1">
                  <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Flame class="w-3.5 h-3.5 text-accent" />
                    Surah Pilihan & Sering Dibaca
                  </span>
                  <span class="text-xs text-muted-foreground">Klik untuk membuka langsung</span>
                </div>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    v-for="surah in popularSurahs"
                    :key="surah.number"
                    @click="handleSelectSurah(surah)"
                    class="p-3 bg-muted/40 hover:bg-secondary/70 border border-border hover:border-primary/40 rounded-2xl text-left transition-all group flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  >
                    <div class="min-w-0 pr-2">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {{ surah.number }}
                        </span>
                        <p class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {{ surah.name }}
                        </p>
                      </div>
                      <p class="text-xs text-muted-foreground truncate ml-8 mt-0.5">
                        {{ surah.meaning }}
                      </p>
                    </div>
                    <SurahName
                      :chapter="surah.number"
                      customClass="text-2xl text-foreground/80 shrink-0"
                    />
                  </button>
                </div>
              </div>

              <!-- Shortcut Guides -->
              <div class="space-y-3 pt-4 border-t border-border/80">
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                  <Compass class="w-3.5 h-3.5 text-primary" />
                  Pintasan Pencarian Cepat
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="guide in shortcutGuides"
                    :key="guide.prefix"
                    @click="setFilter(guide.prefix + ' ')"
                    class="p-3 bg-muted/30 hover:bg-secondary/60 border border-border/80 hover:border-primary/40 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="w-8 h-8 rounded-xl bg-card border border-border font-mono font-bold text-sm text-primary flex items-center justify-center shrink-0 group-hover:border-primary/50">
                        {{ guide.prefix }}
                      </span>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {{ guide.title }}
                        </p>
                        <p class="text-xs text-muted-foreground truncate">
                          {{ guide.desc }}
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results State (Desktop) -->
            <div
              v-else-if="!hasSearchResults"
              class="py-14 px-4 text-center flex flex-col items-center justify-center space-y-3.5"
            >
              <div class="w-14 h-14 rounded-3xl bg-muted/80 border border-border flex items-center justify-center text-muted-foreground">
                <SearchX class="w-7 h-7 text-muted-foreground" />
              </div>
              <div class="space-y-1.5 max-w-sm">
                <h4 class="font-bold text-base text-foreground">
                  Tidak ada hasil ditemukan
                </h4>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Tidak ada hasil yang sesuai dengan kata kunci "<span class="font-semibold text-foreground">{{ searchQuery }}</span>". Coba periksa ejaan atau gunakan kategori lain.
                </p>
              </div>
              <button
                @click="clearSearch"
                class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-xs rounded-full border border-border transition cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                Reset Pencarian
              </button>
            </div>

            <!-- Results List (Desktop) -->
            <div v-else class="space-y-6">
              <!-- 1. Surah Results -->
              <div
                v-if="searchResults.chapters && searchResults.chapters.length > 0"
                class="space-y-2.5"
              >
                <div class="flex items-center justify-between px-1">
                  <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                    <BookOpen class="w-3.5 h-3.5" />
                    Surah ({{ searchResults.chapters.length }})
                  </h4>
                </div>
                <div class="grid grid-cols-2 gap-2.5">
                  <div
                    v-for="surah in searchResults.chapters"
                    :key="surah.number"
                    :data-item-key="`surah-${surah.number}`"
                    @click="handleSelectSurah(surah)"
                    :class="[
                      isItemSelected(`surah-${surah.number}`)
                        ? 'bg-secondary/90 border-primary/50 ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-secondary/70 border-border',
                      'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]'
                    ]"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {{ surah.number }}
                      </span>
                      <div class="min-w-0">
                        <p class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {{ surah.latin }}
                        </p>
                        <p class="text-xs text-muted-foreground truncate">
                          {{ surah.meaning }} • {{ surah.ayat }} ayat
                        </p>
                      </div>
                    </div>
                    <SurahName
                      :chapter="surah.number"
                      customClass="text-2xl sm:text-3xl text-foreground/90 ml-2 shrink-0"
                    />
                  </div>
                </div>
              </div>

              <!-- 2. Verse Results -->
              <div
                v-if="searchResults.verses && searchResults.verses.length > 0"
                class="space-y-3 pt-3 border-t border-border"
              >
                <div class="flex items-center justify-between px-1">
                  <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                    <FileText class="w-3.5 h-3.5" />
                    Ayat Al-Qur'an ({{ searchResults.verses.length }})
                  </h4>
                </div>
                <div class="space-y-2.5">
                  <div
                    v-for="verse in searchResults.verses"
                    :key="verse.id || `${verse.chapter}-${verse.verse}`"
                    :data-item-key="`verse-${verse.id || `${verse.chapter}-${verse.verse}`}`"
                    @click="handleSelectVerse(verse)"
                    :class="[
                      isItemSelected(`verse-${verse.id || `${verse.chapter}-${verse.verse}`}`)
                        ? 'bg-secondary/90 border-primary/50 ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-secondary/70 border-border',
                    'p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 group active:scale-[0.98]'
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-0.5 rounded-full flex items-center gap-1">
                        <BookOpen class="w-3 h-3 text-accent" />
                        QS {{ verse.surah ? verse.surah.latin : 'Surah ' + verse.chapter }}: {{ verse.verse }}
                      </span>
                      <span class="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        Buka Ayat &rarr;
                      </span>
                    </div>
                    <p class="font-quran text-xl text-foreground text-right dir-rtl font-bold leading-[2.2em]">
                      {{ verse.text }}
                      <QuranVerseNumber :number="verse.verse" />
                    </p>
                    <p class="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {{ verse.translation }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 3. Material Results -->
              <div
                v-if="searchResults.materials && searchResults.materials.length > 0"
                class="space-y-2.5 pt-3 border-t border-border"
              >
                <div class="flex items-center justify-between px-1">
                  <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5" />
                    Materi Tadabbur ({{ searchResults.materials.length }})
                  </h4>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="material in searchResults.materials"
                    :key="material.id"
                    :data-item-key="`material-${material.id}`"
                    @click="handleSelectMaterial(material)"
                    :class="[
                      isItemSelected(`material-${material.id}`)
                        ? 'bg-secondary/90 border-primary/50 ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-secondary/70 border-border',
                      'p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]'
                    ]"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <BookOpen class="w-5 h-5 text-primary" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {{ material.title }}
                        </p>
                        <p class="text-xs text-muted-foreground truncate mt-0.5">
                          {{ material.week ? 'Pekan ' + material.week : 'Materi Tadabbur' }}
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                  </div>
                </div>
              </div>

              <!-- 4. FAQ / Bantuan Results -->
              <div
                v-if="searchResults.faqs && searchResults.faqs.length > 0"
                class="space-y-2.5 pt-3 border-t border-border"
              >
                <div class="flex items-center justify-between px-1">
                  <h4 class="text-xs font-bold tracking-wider text-primary uppercase flex items-center gap-1.5">
                    <HelpCircle class="w-3.5 h-3.5" />
                    Bantuan & FAQ ({{ searchResults.faqs.length }})
                  </h4>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div
                    v-for="faq in searchResults.faqs"
                    :key="faq.id"
                    :data-item-key="`faq-${faq.id}`"
                    @click="handleSelectFaq(faq)"
                    :class="[
                      isItemSelected(`faq-${faq.id}`)
                        ? 'bg-secondary/90 border-primary/50 ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-secondary/70 border-border',
                      'p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between group active:scale-[0.98]'
                    ]"
                  >
                    <div class="min-w-0 flex-1 pr-3">
                      <div class="flex items-center gap-2 mb-1.5">
                        <span
                          v-if="faq.category"
                          class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                        >
                          {{ faq.category }}
                        </span>
                      </div>
                      <p class="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                        {{ faq.question }}
                      </p>
                      <p class="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {{ faq.answer }}
                      </p>
                    </div>
                    <HelpCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Command Palette Footer Bar -->
          <div
            class="px-5 py-3 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground shrink-0 select-none"
          >
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-card rounded border border-border font-mono text-xs font-semibold text-foreground">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-card rounded border border-border font-mono text-xs font-semibold text-foreground">↓</kbd>
                <span>Navigasi</span>
              </span>
              <span class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-card rounded border border-border font-mono text-xs font-semibold text-foreground">↵</kbd>
                <span>Pilih</span>
              </span>
              <span class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-card rounded border border-border font-mono text-xs font-semibold text-foreground">ESC</kbd>
                <span>{{ searchQuery ? 'Hapus' : 'Tutup' }}</span>
              </span>
            </div>

            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Pintasan:</span>
              <span class="font-mono text-primary font-bold"># Surah</span>
              <span class="text-border">•</span>
              <span class="font-mono text-primary font-bold">@ Ayat</span>
              <span class="text-border">•</span>
              <span class="font-mono text-primary font-bold">! Materi</span>
              <span class="text-border">•</span>
              <span class="font-mono text-primary font-bold">? FAQ</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search,
  X,
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Flame,
  Compass,
  SearchX,
  RotateCcw,
} from 'lucide-vue-next';
import QuranVerseNumber from '@/components/QuranVerseNumber.vue';
import SurahName from '@/components/SurahName.vue';
import { searchQuran } from '@/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'update:isOpen', 'select']);
const router = useRouter();

const searchQuery = ref('');
const isSearching = ref(false);
const selectedIndex = ref(0);

const desktopSearchInputRef = ref(null);
const mobileSearchInputRef = ref(null);
const desktopScrollContainerRef = ref(null);
const mobileScrollContainerRef = ref(null);

const searchResults = ref({
  chapters: [],
  verses: [],
  materials: [],
  faqs: [],
});

let searchDebounceTimer = null;

// Popular / Frequently read Surahs for quick jumping
const popularSurahs = [
  { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', meaning: 'Pembukaan' },
  { number: 18, name: 'Al-Kahf', arabic: 'الكهف', meaning: 'Gua' },
  { number: 36, name: 'Yasin', arabic: 'يس', meaning: 'Yasin' },
  { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', meaning: 'Maha Pengasih' },
  { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', meaning: 'Hari Kiamat' },
  { number: 67, name: 'Al-Mulk', arabic: 'الملك', meaning: 'Kerajaan' },
];

const shortcutGuides = [
  {
    prefix: '#',
    title: 'Cari Surah',
    desc: 'Cari 114 surah berdasarkan nama, arti, atau nomor',
  },
  {
    prefix: '@',
    title: 'Cari Ayat Al-Qur\'an',
    desc: 'Cari potongan lafaz Arab atau terjemahan ayat',
  },
  {
    prefix: '!',
    title: 'Materi Tadabbur',
    desc: 'Cari judul tema dan materi pekanan',
  },
  {
    prefix: '?',
    title: 'Bantuan & FAQ',
    desc: 'Cari solusi panduan dan pertanyaan umum',
  },
];

// Determine active filter from search query prefix
const activeFilter = computed(() => {
  const q = searchQuery.value || '';
  if (q.startsWith('#')) return 'chapters';
  if (q.startsWith('@')) return 'verses';
  if (q.startsWith('!')) return 'materials';
  if (q.startsWith('?')) return 'faqs';
  return 'all';
});

const hasSearchResults = computed(() => {
  const { chapters, verses, materials, faqs } = searchResults.value;
  return (
    (chapters && chapters.length > 0) ||
    (verses && verses.length > 0) ||
    (materials && materials.length > 0) ||
    (faqs && faqs.length > 0)
  );
});

const totalResultsCount = computed(() => {
  const { chapters = [], verses = [], materials = [], faqs = [] } = searchResults.value;
  return chapters.length + verses.length + materials.length + faqs.length;
});

// Flat array of current result items for keyboard arrow navigation
const flatResults = computed(() => {
  const items = [];
  const { chapters = [], verses = [], materials = [], faqs = [] } = searchResults.value;

  for (const surah of chapters) {
    items.push({ type: 'surah', key: `surah-${surah.number}`, data: surah });
  }
  for (const verse of verses) {
    const key = `verse-${verse.id || `${verse.chapter}-${verse.verse}`}`;
    items.push({ type: 'verse', key, data: verse });
  }
  for (const material of materials) {
    items.push({ type: 'material', key: `material-${material.id}`, data: material });
  }
  for (const faq of faqs) {
    items.push({ type: 'faq', key: `faq-${faq.id}`, data: faq });
  }
  return items;
});

function isItemSelected(key) {
  if (flatResults.value.length === 0) return false;
  const current = flatResults.value[selectedIndex.value];
  return current && current.key === key;
}

function navigateDown() {
  if (flatResults.value.length === 0) return;
  selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length;
  scrollToActiveItem();
}

function navigateUp() {
  if (flatResults.value.length === 0) return;
  selectedIndex.value =
    (selectedIndex.value - 1 + flatResults.value.length) % flatResults.value.length;
  scrollToActiveItem();
}

function scrollToActiveItem() {
  nextTick(() => {
    const current = flatResults.value[selectedIndex.value];
    if (!current) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const container = isMobile
      ? mobileScrollContainerRef.value
      : desktopScrollContainerRef.value;
    if (!container) return;

    const target = container.querySelector(`[data-item-key="${current.key}"]`);
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (targetRect.bottom > containerRect.bottom) {
      const offset = targetRect.bottom - containerRect.bottom + 12;
      container.scrollTop += offset;
    } else if (targetRect.top < containerRect.top) {
      const offset = containerRect.top - targetRect.top + 12;
      container.scrollTop -= offset;
    }
  });
}

function selectCurrentItem() {
  if (flatResults.value.length === 0) return;
  const item = flatResults.value[selectedIndex.value];
  if (!item) return;

  if (item.type === 'surah') handleSelectSurah(item.data);
  else if (item.type === 'verse') handleSelectVerse(item.data);
  else if (item.type === 'material') handleSelectMaterial(item.data);
  else if (item.type === 'faq') handleSelectFaq(item.data);
}

function setFilter(prefix) {
  if (!prefix) {
    // Reset prefix
    const current = searchQuery.value.replace(/^[#@!?]\s*/, '');
    searchQuery.value = current;
  } else {
    // If clicking same active filter, toggle off
    if (searchQuery.value.startsWith(prefix)) {
      searchQuery.value = searchQuery.value.slice(prefix.length);
    } else {
      const stripped = searchQuery.value.replace(/^[#@!?]\s*/, '');
      searchQuery.value = `${prefix}${stripped}`;
    }
  }
  focusInput();
}

function clearSearch() {
  searchQuery.value = '';
  focusInput();
}

function focusInput() {
  nextTick(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640 && mobileSearchInputRef.value) {
      mobileSearchInputRef.value.focus();
    } else if (desktopSearchInputRef.value) {
      desktopSearchInputRef.value.focus();
    }
  });
}

function handleEscKey(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (searchQuery.value) {
    clearSearch();
  } else {
    emitClose();
  }
}

function handleWindowKeydown(e) {
  if (!props.isOpen) return;
  if (e.key === 'Escape') {
    handleEscKey(e);
  }
}

function emitClose() {
  emit('close');
  emit('update:isOpen', false);
}

function handleSelectSurah(surah) {
  emit('select', { type: 'surah', data: surah });
  emitClose();
  searchQuery.value = '';
  router.push({ name: 'quran.show', params: { chapter: surah.number } });
}

function handleSelectVerse(verse) {
  emit('select', { type: 'verse', data: verse });
  emitClose();
  searchQuery.value = '';
  router.push({
    name: 'quran.show',
    params: { chapter: verse.chapter },
    query: { verse: verse.verse },
  });
}

function handleSelectMaterial(material) {
  emit('select', { type: 'material', data: material });
  emitClose();
  searchQuery.value = '';
  router.push({ name: 'materials.show', params: { id: material.id } });
}

function handleSelectFaq(faq) {
  emit('select', { type: 'faq', data: faq });
  emitClose();
  searchQuery.value = '';
  router.push({ name: 'help', query: { id: faq.id } });
}

// Watchers
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      selectedIndex.value = 0;
      focusInput();
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleWindowKeydown);
      }
    } else {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleWindowKeydown);
      }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleWindowKeydown);
  }
});

watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  const q = (newVal || '').trim();
  if (!q) {
    searchResults.value = { chapters: [], verses: [], materials: [], faqs: [] };
    isSearching.value = false;
    selectedIndex.value = 0;
    return;
  }

  isSearching.value = true;
  searchDebounceTimer = setTimeout(async () => {
    try {
      const res = await searchQuran({ q: newVal });
      if (res && res.success && res.data) {
        searchResults.value = {
          chapters: res.data.chapters || [],
          verses: res.data.verses ? res.data.verses.data || [] : [],
          materials: res.data.materials || [],
          faqs: res.data.faqs || [],
        };
        selectedIndex.value = 0;
      }
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      isSearching.value = false;
    }
  }, 250);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
