<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 relative pb-32 sm:pb-24">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30 px-4 py-3 sm:px-8">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left balance spacer -->
        <div class="w-24 hidden sm:block"></div>

        <!-- Center Logo -->
        <router-link :to="{ name: 'home' }" class="flex items-center justify-center mx-auto sm:mx-0">
          <img src="@/assets/logo-kontaq.png" alt="KontaQ" class="h-14 sm:h-16 w-auto object-contain" />
        </router-link>

        <!-- Right Header Icons (Search, Notification, Profile) -->
        <div class="flex items-center gap-3">
          <!-- Search Icon Button -->
          <button
            @click="isSearchOpen = true"
            title="Cari Surah, ayat, tadabbur"
            class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 cursor-pointer"
          >
            <Search class="w-5 h-5 stroke-[2.2]" />
          </button>

          <!-- Notification Bell Button -->
          <div ref="notificationMenuRef" class="relative">
            <button
              @click="toggleNotification"
              title="Notifikasi"
              class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 relative cursor-pointer"
            >
              <Bell class="w-5 h-5 stroke-[2.2]" />
              <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
            </button>

            <!-- Notification Dropdown -->
            <div
              v-if="isNotificationOpen"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            >
              <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h4 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Bell class="w-4 h-4 text-emerald-600" />
                  Notifikasi & Pengumuman
                </h4>
                <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {{ notificationList.length }} Baru
                </span>
              </div>

              <!-- Notifications List -->
              <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto text-sm">
                <div v-if="notificationList.length === 0" class="p-6 text-center text-xs text-gray-500">
                  Tidak ada pengumuman baru.
                </div>
                <div
                  v-for="(notif, idx) in notificationList"
                  :key="idx"
                  @click="clickNotification(notif)"
                  class="p-3.5 hover:bg-emerald-50/50 transition cursor-pointer flex gap-3 items-start"
                >
                  <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Pin v-if="notif.isSticky" class="w-4 h-4 text-emerald-700" />
                    <Bell v-else class="w-4 h-4 text-emerald-700" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-800 text-xs sm:text-sm truncate">{{ notif.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{{ notif.desc }}</p>
                    <span class="text-[10px] text-emerald-600 font-medium mt-1 block">{{ notif.time }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer Link to Announcements -->
              <router-link
                :to="{ name: 'announcements' }"
                @click="isNotificationOpen = false"
                class="block text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border-t border-emerald-100"
              >
                Lihat Semua Pengumuman &rarr;
              </router-link>
            </div>
          </div>

          <!-- User Menu Dropdown Button -->
          <div ref="userMenuRef" class="relative">
            <button
              @click="toggleUserMenu"
              title="Menu Pengguna"
              class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 cursor-pointer"
            >
              <User class="w-5 h-5 stroke-[2.2]" />
            </button>

            <!-- User Menu Dropdown Panel -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            >
              <!-- User Info Header -->
              <div v-if="authStore.user" class="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                <p class="font-bold text-gray-900 text-xs truncate">{{ authStore.user.name }}</p>
                <p class="text-[11px] text-gray-500 truncate">{{ authStore.user.username || authStore.user.email }}</p>
              </div>

              <div class="py-1">
                <router-link
                  :to="{ name: 'profile' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <User class="w-4 h-4 text-emerald-600" />
                  Profile
                </router-link>

                <div class="my-1 border-t border-gray-100"></div>

                <router-link
                  :to="{ name: 'logout' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                >
                  <LogOut class="w-4 h-4 text-red-500" />
                  Logout
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs Pill Container (Desktop / Tablet) -->
    <section v-if="route.name !== 'infaq'" class="hidden sm:block max-w-4xl mx-auto px-4 mt-6 sm:mt-8 w-full">
      <div class="bg-[#ebeee8] rounded-3xl p-3 sm:p-4 shadow-inner flex items-center justify-around gap-2 sm:gap-4 border border-gray-200/60">
        <router-link
          v-for="item in navTabs"
          :key="item.name"
          :to="{ name: item.route }"
          :class="[
            isTabActive(item)
              ? 'bg-white shadow-sm border border-emerald-200 text-emerald-800'
              : 'hover:bg-white/40 text-gray-700',
            'flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition group'
          ]"
        >
          <div
            :class="[
              isTabActive(item) ? 'bg-amber-100/90 text-emerald-700' : 'bg-amber-100/70 text-gray-700',
              'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform'
            ]"
          >
            <component :is="item.icon" class="w-7 h-7 stroke-2 text-amber-600" />
          </div>
          <span class="font-bold text-sm sm:text-base">{{ item.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- Main Content Slot -->
    <main class="max-w-6xl mx-auto px-4 mt-8 sm:mt-10 w-full flex-1">
      <slot />
    </main>

    <!-- Floating Mint Green Banner (DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN) -->
    <footer
      v-if="isBannerVisible"
      class="fixed bottom-20 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl bg-[#bbf7d0] border border-emerald-300/90 rounded-full px-4 sm:px-8 py-2.5 sm:py-3 shadow-xl shadow-emerald-950/15 backdrop-blur-md transition-all duration-300"
    >
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <!-- Banner Text -->
        <span class="font-bold text-[#144227] text-xs sm:text-base tracking-wide text-left truncate sm:whitespace-normal">
          DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN
        </span>

        <!-- Infaq Button -->
        <div class="flex items-center shrink-0">
          <router-link
            :to="{ name: 'infaq' }"
            class="bg-[#144227] hover:bg-[#0f321d] text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center cursor-pointer"
          >
            <span>Infaq</span>
          </router-link>
        </div>
      </div>

      <!-- Red Close X Button on top-right floating edge -->
      <button
        @click="isBannerVisible = false"
        title="Tutup Banner"
        class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer z-50"
      >
        <X class="w-3.5 h-3.5 stroke-[3]" />
      </button>
    </footer>

    <!-- Mobile Bottom Navigation Bar -->
    <nav
      v-if="route.name !== 'infaq'"
      class="flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-2 py-1.5 justify-around items-center"
    >
      <router-link
        v-for="item in navTabs"
        :key="item.name"
        :to="{ name: item.route }"
        :class="[
          isTabActive(item)
            ? 'text-emerald-700 font-bold'
            : 'text-gray-500 hover:text-gray-700 font-medium',
          'flex-1 flex flex-col items-center justify-center py-1 px-1 transition text-center'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            isTabActive(item) ? 'text-emerald-600 scale-110' : 'text-gray-400',
            'w-5 h-5 transition-transform mb-0.5'
          ]"
        />
        <span class="text-[11px] leading-tight">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Search Modal Popup -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/40 backdrop-blur-xs"
      @click.self="isSearchOpen = false"
    >
      <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <!-- Search Input Header -->
        <div class="p-3.5 sm:p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div class="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-2xl px-3.5 py-2.5 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-2xs">
            <Search class="w-5 h-5 text-emerald-600 shrink-0" />
            <input
              v-model="searchQuery"
              ref="searchInputRef"
              type="text"
              placeholder="Cari Surah, ayat, tadabbur (# surah, @ ayat, ? materi)..."
              class="w-full text-base sm:text-lg border-0 border-none outline-none focus:outline-none focus:ring-0 shadow-none text-gray-900 placeholder-gray-400 bg-transparent font-medium p-0"
              @keydown.esc="isSearchOpen = false"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer"
              title="Hapus kata kunci"
            >
              <X class="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
          <button
            @click="isSearchOpen = false"
            class="w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-500 flex items-center justify-center transition border border-gray-200/60 cursor-pointer shrink-0 shadow-2xs"
            title="Tutup pencarian"
          >
            <X class="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        <!-- Filter Chips / Shortcuts -->
        <div class="px-4 py-2.5 bg-gray-50 flex flex-wrap items-center gap-2 text-xs text-gray-600 border-b border-gray-100">
          <span class="font-medium text-gray-400">Pintasan:</span>
          <button @click="setSearchPrefix('# ')" class="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer">
            # Surah
          </button>
          <button @click="setSearchPrefix('@ ')" class="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer">
            @ Ayat
          </button>
          <button @click="setSearchPrefix('? ')" class="px-2 py-0.5 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer">
            ? Tadabbur
          </button>
        </div>

        <!-- Search Results Body -->
        <div class="overflow-y-auto p-4 space-y-5 flex-1 divide-y divide-gray-100">
          <!-- Loading Spinner -->
          <div v-if="isSearching" class="text-center py-8 text-emerald-600 flex items-center justify-center gap-2">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
            <span class="text-xs font-medium text-gray-500">Mencari...</span>
          </div>

          <!-- Empty Query Placeholder -->
          <div v-else-if="!searchQuery.trim()" class="text-center py-10 text-gray-400 text-xs sm:text-sm">
            Ketik kata kunci untuk mencari Surah, Ayat, atau Materi Tadabbur.
          </div>

          <!-- No Results Found -->
          <div
            v-else-if="!hasSearchResults"
            class="text-center py-10 text-gray-500 text-sm"
          >
            Tidak ada hasil ditemukan untuk "<span class="font-semibold text-gray-700">{{ searchQuery }}</span>".
          </div>

          <template v-else>
            <!-- 1. Surah Results -->
            <div v-if="searchResults.chapters && searchResults.chapters.length > 0" class="space-y-2 pt-2 first:pt-0">
              <h4 class="text-[11px] font-bold tracking-wider text-emerald-800 uppercase px-1">
                Surah ({{ searchResults.chapters.length }})
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="surah in searchResults.chapters"
                  :key="surah.number"
                  @click="selectSurah(surah)"
                  class="p-3 bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-200/60 rounded-2xl cursor-pointer transition flex items-center justify-between group"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {{ surah.number }}
                    </span>
                    <div class="min-w-0">
                      <p class="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-700">{{ surah.latin }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ surah.meaning }} • {{ surah.ayat }} ayat</p>
                    </div>
                  </div>
                  <span class="font-arabic text-xl font-bold text-gray-800 ml-2 shrink-0 dir-rtl">
                    {{ surah.arabic }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. Verse Results -->
            <div v-if="searchResults.verses && searchResults.verses.length > 0" class="space-y-2.5 pt-3">
              <h4 class="text-[11px] font-bold tracking-wider text-emerald-800 uppercase px-1">
                Ayat Al-Qur'an ({{ searchResults.verses.length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="verse in searchResults.verses"
                  :key="verse.id"
                  @click="selectVerse(verse)"
                  class="p-3.5 bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-200/60 rounded-2xl cursor-pointer transition space-y-1.5 group"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      QS {{ verse.surah ? verse.surah.latin : 'Surah ' + verse.chapter }}: {{ verse.verse }}
                    </span>
                  </div>
                  <p class="font-quran text-lg text-gray-900 text-right dir-rtl font-bold leading-relaxed">
                    {{ verse.text }}
                  </p>
                  <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {{ verse.translation }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 3. Material Results -->
            <div v-if="searchResults.materials && searchResults.materials.length > 0" class="space-y-2 pt-3">
              <h4 class="text-[11px] font-bold tracking-wider text-emerald-800 uppercase px-1">
                Materi Tadabbur ({{ searchResults.materials.length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="material in searchResults.materials"
                  :key="material.id"
                  @click="selectMaterial(material)"
                  class="p-3 bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-200/60 rounded-2xl cursor-pointer transition group flex items-center justify-between"
                >
                  <div class="min-w-0">
                    <p class="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-700">
                      {{ material.title }}
                    </p>
                    <p class="text-xs text-gray-500 truncate mt-0.5">
                      {{ material.category ? material.category.name : 'Materi Tadabbur' }}
                    </p>
                  </div>
                  <BookOpen class="w-4 h-4 text-emerald-600 shrink-0 ml-3" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Infaq Modal -->
    <div
      v-if="showInfaqModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showInfaqModal = false"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <QrCode class="w-7 h-7 text-emerald-700" />
        </div>
        <h3 class="text-xl font-bold text-[#144227] mb-2">Infaq & Donasi KontaQ</h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Salurkan infaq terbaik Anda untuk mendukung dakwah & kegiatan Komunitas Tadabbur Al-Qur'an (KontaQ).
        </p>
        <div class="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 mb-6 text-left space-y-2 text-sm text-[#144227]">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Bank Syariah Indonesia (BSI)</span>
          </div>
          <p class="font-mono text-lg font-bold text-emerald-900 tracking-wider">777-888-9990</p>
          <p class="text-xs text-gray-500">a.n. Komunitas Tadabbur Al-Qur'an</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="showInfaqModal = false; showQrisModal = true"
            class="flex-1 py-2.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-[#144227] font-bold rounded-full transition-all duration-150 cursor-pointer text-sm"
          >
            Scan QRIS
          </button>
          <button
            @click="showInfaqModal = false"
            class="flex-1 py-2.5 px-4 bg-[#144227] hover:bg-[#0f321d] text-white font-bold rounded-full shadow transition-all duration-150 cursor-pointer text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- QRIS Modal -->
    <div
      v-if="showQrisModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      @click.self="showQrisModal = false"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        <!-- QRIS Brand Header -->
        <div class="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <span class="font-extrabold tracking-widest text-red-600 text-xl font-mono">QRIS</span>
          <span class="text-[10px] text-gray-400 font-semibold leading-tight text-left">
            NATIONAL<br />STANDARD
          </span>
        </div>

        <!-- Merchant Info -->
        <h3 class="text-base font-bold text-gray-900 mb-0.5">Komunitas Tadabbur Al-Qur'an</h3>
        <p class="text-xs text-emerald-700 font-semibold mb-4">KontaQ Indonesia</p>

        <!-- QR Code Visual Card -->
        <div class="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-inner flex flex-col items-center justify-center mx-auto mb-4 w-56 h-56 relative">
          <svg class="w-48 h-48 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="10" y="10" width="15" height="15" />
            <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="75" y="10" width="15" height="15" />
            <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="10" y="75" width="15" height="15" />
            <rect x="35" y="5" width="8" height="8" />
            <rect x="48" y="5" width="8" height="8" />
            <rect x="5" y="35" width="8" height="8" />
            <rect x="18" y="35" width="8" height="8" />
            <rect x="35" y="20" width="12" height="8" />
            <rect x="50" y="18" width="8" height="12" />
            <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3" />
            <rect x="42" y="42" width="16" height="16" />
            <rect x="70" y="35" width="8" height="18" />
            <rect x="83" y="35" width="12" height="8" />
            <rect x="70" y="58" width="25" height="8" />
            <rect x="35" y="70" width="8" height="25" />
            <rect x="48" y="70" width="18" height="8" />
            <rect x="70" y="70" width="12" height="12" />
            <rect x="85" y="85" width="10" height="10" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-white px-2 py-0.5 rounded border border-gray-300 shadow-xs text-[10px] font-bold text-gray-800">
              KontaQ
            </div>
          </div>
        </div>

        <!-- NMID & Instructions -->
        <p class="text-[11px] font-mono text-gray-500 mb-1">NMID: ID1023948576201</p>
        <p class="text-xs text-gray-500 mb-5 leading-relaxed">
          Dapat di-scan menggunakan seluruh aplikasi m-Banking & E-Wallet (BSI, BCA, Mandiri, GoPay, OVO, Dana, LinkAja, dll).
        </p>

        <button
          @click="showQrisModal = false"
          class="w-full py-2.5 px-4 bg-[#144227] hover:bg-[#0f321d] text-white font-bold rounded-full shadow transition-all duration-150 cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  FileSpreadsheet,
  QrCode,
  Pin,
  X,
} from 'lucide-vue-next';
import authStore from '@/store/auth';
import { getUser, listAnnouncements, searchQuran } from '@/api';
import { relativeDate, stripTags } from '@/utils';

const route = useRoute();
const router = useRouter();

if (authStore.isLoggedIn && !authStore.user) {
  getUser();
}

const isSearchOpen = ref(false);
const isNotificationOpen = ref(false);
const isUserMenuOpen = ref(false);
const notificationMenuRef = ref(null);
const userMenuRef = ref(null);

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});

onClickOutside(notificationMenuRef, () => {
  isNotificationOpen.value = false;
});

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isNotificationOpen.value = false;
  }
}

function toggleNotification() {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (isNotificationOpen.value) {
    isUserMenuOpen.value = false;
  }
}

const isBannerVisible = ref(true);
const showInfaqModal = ref(false);
const showQrisModal = ref(false);
const searchQuery = ref('');
const searchInputRef = ref(null);

const isSearching = ref(false);
const searchResults = ref({ chapters: [], verses: [], materials: [] });
let searchDebounceTimer = null;

watch(isSearchOpen, (open) => {
  if (open) {
    isUserMenuOpen.value = false;
    isNotificationOpen.value = false;
    nextTick(() => {
      if (searchInputRef.value) searchInputRef.value.focus();
    });
  }
});

watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  const q = (newVal || '').trim();
  if (!q) {
    searchResults.value = { chapters: [], verses: [], materials: [] };
    isSearching.value = false;
    return;
  }

  isSearching.value = true;
  searchDebounceTimer = setTimeout(async () => {
    try {
      const res = await searchQuran({ q: newVal });
      if (res && res.success && res.data) {
        searchResults.value = {
          chapters: res.data.chapters || [],
          verses: res.data.verses ? (res.data.verses.data || []) : [],
          materials: res.data.materials || [],
        };
      }
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      isSearching.value = false;
    }
  }, 300);
});

const hasSearchResults = computed(() => {
  const { chapters, verses, materials } = searchResults.value;
  return (chapters && chapters.length > 0) || (verses && verses.length > 0) || (materials && materials.length > 0);
});

function setSearchPrefix(prefix) {
  searchQuery.value = prefix;
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
}

function selectSurah(surah) {
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'quran.show', params: { chapter: surah.number } });
}

function selectVerse(verse) {
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'quran.show', params: { chapter: verse.chapter } });
}

function selectMaterial(material) {
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'materials.show', params: { id: material.id } });
}

const navTabs = [
  { name: 'Tadabbur', route: 'tadabbur', icon: BookOpen },
  { name: 'Kuis', route: 'quizzes', icon: ClipboardList },
  { name: 'Evaluasi', route: 'evaluations', icon: ClipboardCheck },
  { name: 'Rapor', route: 'reports', icon: FileSpreadsheet },
];

function isTabActive(item) {
  if (!route.name) return false;
  if (item.route === 'tadabbur') {
    return route.name === 'tadabbur' || route.name.startsWith('materials') || route.name.startsWith('quran');
  }
  return route.name.startsWith(item.route);
}

const announcements = ref([]);

onMounted(async () => {
  try {
    const res = await listAnnouncements(1);
    if (res && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.data || [];
      if (items.length > 0) {
        announcements.value = items;
      }
    }
  } catch (e) {
    console.warn('Could not load announcements for notifications:', e);
  }
});

const notificationList = computed(() => {
  return announcements.value.map((item) => ({
    id: item.id,
    isSticky: !!item.is_sticky,
    title: item.title,
    desc: stripTags(item.content || ''),
    time: item.created_at ? relativeDate(item.created_at) : 'Terbaru',
    action: item.action,
    route: { name: 'announcements.show', params: { id: item.id } },
  }));
});

function clickNotification(notif) {
  isNotificationOpen.value = false;
  if (notif.action === 'infaq') {
    router.push({ name: 'infaq' });
  } else if (notif.route) {
    router.push(notif.route);
  }
}
</script>
