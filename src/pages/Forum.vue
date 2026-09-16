<template>
  <div class="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
    <!-- Page Header -->
    <PageHeader
      page-title="Forum Ukhuwah"
      description="Ruang diskusi, silaturahmi, dan berbagi faidah tadabbur bersama anggota Kontaq."
    >
      <template #default>
        <div class="flex items-center gap-2">
          <!-- Active Status & Live Anggota Indicator -->
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border text-xs text-secondary-foreground font-medium">
            <OnlineStatus />
          </div>

          <!-- Quick Refresh Button -->
          <button
            type="button"
            @click="refreshFeed"
            :disabled="isLoading || isRefreshing"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-foreground bg-card hover:bg-muted active:scale-[0.98] border border-border rounded-full shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Perbarui percakapan"
          >
            <RefreshCw :class="['w-3.5 h-3.5', (isLoading || isRefreshing) ? 'animate-spin text-primary' : '']" />
            <span class="hidden sm:inline">Perbarui</span>
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- Main Grid: Chat Stream Area + Sidebar Information -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Chat Interface Main Area (lg:col-span-8 xl:col-span-9) -->
      <div class="lg:col-span-8 xl:col-span-9 flex flex-col">
        <!-- Chat Box Window Container -->
        <div class="bg-card rounded-2xl border border-border shadow-xs flex flex-col h-[750px] max-h-[85vh] overflow-hidden transition-all">
          
          <!-- Chat Window Top Navigation Bar -->
          <div class="px-4 py-3.5 sm:px-6 bg-card border-b border-border/80 flex items-center justify-between gap-3 shrink-0">
            <!-- Room Info & Status -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                <MessagesSquare class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm sm:text-base font-bold text-foreground truncate">
                    Ruang Diskusi & Ukhuwah
                  </h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                    Aktif
                  </span>
                </div>
                <p class="text-xs text-muted-foreground truncate">
                  {{ totalPostsCount }} pesan tercatat di forum
                </p>
              </div>
            </div>

            <!-- Header Controls: Search Toggle & Pagination Navigator -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Search Bar Toggle Button -->
              <button
                type="button"
                @click="isSearchOpen = !isSearchOpen"
                :class="[
                  'p-2 rounded-full transition-all cursor-pointer border',
                  isSearchOpen ? 'bg-primary text-primary-foreground border-primary shadow-xs' : 'bg-muted/60 text-muted-foreground hover:text-foreground border-border hover:bg-muted'
                ]"
                :title="isSearchOpen ? 'Tutup Pencarian' : 'Cari di percakapan'"
              >
                <Search class="w-4 h-4" />
              </button>

              <!-- Compact Page Selector -->
              <div v-if="forumPosts.last_page && forumPosts.last_page > 1" class="flex items-center bg-muted/60 rounded-full border border-border p-0.5 text-xs font-medium">
                <button
                  type="button"
                  :disabled="page <= 1 || isLoading"
                  @click="changePage(page - 1)"
                  class="p-1.5 text-muted-foreground hover:text-foreground rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-card transition-colors cursor-pointer"
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft class="w-4 h-4" />
                </button>
                <span class="px-2 text-foreground font-semibold text-xs select-none">
                  {{ page }} / {{ forumPosts.last_page }}
                </span>
                <button
                  type="button"
                  :disabled="page >= forumPosts.last_page || isLoading"
                  @click="changePage(page + 1)"
                  class="p-1.5 text-muted-foreground hover:text-foreground rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-card transition-colors cursor-pointer"
                  title="Halaman berikutnya"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Expandable In-Chat Search Bar -->
          <div
            v-if="isSearchOpen"
            class="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Search class="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari pesan atau nama anggota di halaman ini..."
              class="w-full text-xs sm:text-sm bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground outline-none py-1"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Chat Messages Stream Body -->
          <div
            ref="chatContainerRef"
            @scroll="handleChatScroll"
            class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative bg-linear-to-b from-muted/10 via-background to-muted/20 scroll-smooth"
          >
            <!-- Loading Skeleton State -->
            <div v-if="isLoading" class="space-y-6 py-2">
              <div class="flex justify-center">
                <div class="h-6 w-28 bg-muted rounded-full animate-pulse"></div>
              </div>
              
              <!-- Incoming Message Skeleton -->
              <div class="flex items-start gap-3 max-w-[80%] animate-pulse">
                <div class="w-9 h-9 rounded-full bg-muted shrink-0"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-3.5 w-28 bg-muted rounded"></div>
                  <div class="p-4 rounded-2xl rounded-tl-xs bg-muted/70 space-y-2">
                    <div class="h-3.5 w-48 bg-muted rounded"></div>
                    <div class="h-3.5 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>

              <!-- Outgoing Message Skeleton -->
              <div class="flex items-start justify-end gap-3 max-w-[80%] ml-auto animate-pulse">
                <div class="space-y-2 flex-1 items-end flex flex-col">
                  <div class="h-3.5 w-20 bg-muted rounded"></div>
                  <div class="p-4 rounded-2xl rounded-tr-xs bg-primary/20 space-y-2 w-64">
                    <div class="h-3.5 w-full bg-primary/30 rounded"></div>
                    <div class="h-3.5 w-40 bg-primary/30 rounded"></div>
                  </div>
                </div>
              </div>

              <!-- Another Incoming Skeleton -->
              <div class="flex items-start gap-3 max-w-[80%] animate-pulse">
                <div class="w-9 h-9 rounded-full bg-muted shrink-0"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-3.5 w-32 bg-muted rounded"></div>
                  <div class="p-4 rounded-2xl rounded-tl-xs bg-muted/70 space-y-2">
                    <div class="h-3.5 w-56 bg-muted rounded"></div>
                    <div class="h-3.5 w-44 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="filteredGroupedPosts.length === 0"
              class="flex flex-col items-center justify-center h-full min-h-[320px] text-center p-6"
            >
              <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-inner">
                <MessageSquareDashed class="w-8 h-8" />
              </div>
              <h3 class="text-base font-bold text-foreground mb-1">
                {{ searchQuery ? 'Tidak Ditemukan Pesan' : 'Belum Ada Pesan di Forum' }}
              </h3>
              <p class="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
                {{ searchQuery
                  ? `Tidak ada pesan atau anggota yang sesuai dengan kata kunci "${searchQuery}".`
                  : 'Buka tali silaturahmi dengan menulis renungan, tadabbur, atau pertanyaan pertama Anda di bawah ini.' }}
              </p>
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-all cursor-pointer"
              >
                Hapus Filter Pencarian
              </button>
            </div>

            <!-- Grouped Messages Stream by Date -->
            <template v-else>
              <div
                v-for="group in filteredGroupedPosts"
                :key="group.dateLabel"
                class="space-y-4"
              >
                <!-- Sticky Date Divider Pill -->
                <div class="flex items-center justify-center my-4 sticky top-0 z-10">
                  <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-muted/90 dark:bg-muted/80 backdrop-blur-xs text-muted-foreground border border-border/80 shadow-2xs">
                    {{ group.dateLabel }}
                  </span>
                </div>

                <!-- Message Items within Date Group -->
                <div
                  v-for="forumPost in group.messages"
                  :key="forumPost.id"
                  :id="`msg-${forumPost.id}`"
                  :class="[
                    'flex items-start gap-2.5 sm:gap-3.5 transition-all group relative',
                    isCurrentUser(forumPost.user) ? 'justify-end' : 'justify-start'
                  ]"
                >
                  <!-- Incoming Avatar (Other Users) -->
                  <div
                    v-if="!isCurrentUser(forumPost.user)"
                    class="shrink-0 pt-0.5"
                  >
                    <img
                      class="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1 ring-border group-hover:ring-primary/40 transition-all"
                      :src="getAvatarUrl(forumPost.user)"
                      :alt="forumPost.user?.name || 'Anggota avatar'"
                      loading="lazy"
                    />
                  </div>

                  <!-- Chat Bubble & Metadata Wrapper -->
                  <div
                    :class="[
                      'flex flex-col max-w-[88%] sm:max-w-[78%] md:max-w-[72%]',
                      isCurrentUser(forumPost.user) ? 'items-end' : 'items-start'
                    ]"
                  >
                    <!-- Header Meta: Author Name + Time -->
                    <div
                      :class="[
                        'flex items-center gap-2 mb-1 px-1 text-xs',
                        isCurrentUser(forumPost.user) ? 'flex-row-reverse text-right' : 'flex-row'
                      ]"
                    >
                      <span class="font-bold text-foreground text-xs truncate max-w-[160px] sm:max-w-[220px]">
                        {{ forumPost.user ? forumPost.user.name : '[Anggota]' }}
                      </span>
                      <span
                        v-if="isCurrentUser(forumPost.user)"
                        class="px-1.5 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary"
                      >
                        Anda
                      </span>
                      <span
                        class="text-xs text-muted-foreground/80 flex items-center gap-1"
                        :title="formatExactTime(forumPost.created_at)"
                      >
                        <Clock class="w-3 h-3 text-muted-foreground/60" />
                        {{ relativeDate(forumPost.created_at) }}
                      </span>
                    </div>

                    <!-- Chat Bubble Card -->
                    <div
                      :class="[
                        'rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed transition-all shadow-2xs relative',
                        isCurrentUser(forumPost.user)
                          ? 'bg-primary/10 border border-primary/25 dark:bg-primary/20 dark:border-primary/40 text-foreground rounded-tr-xs'
                          : 'bg-card border border-border text-foreground rounded-tl-xs hover:border-primary/30'
                      ]"
                    >
                      <!-- Rendered Markdown Content with Quranic Script Support -->
                      <div
                        class="prose dark:prose-invert max-w-none forum-content text-sm text-foreground break-words"
                        v-html="renderMarkdown(forumPost.message)"
                      ></div>

                      <!-- Message Action Toolbar (Reply & Copy) -->
                      <div
                        :class="[
                          'flex items-center gap-2 mt-2.5 pt-2 border-t border-border/40 text-xs',
                          isCurrentUser(forumPost.user) ? 'justify-end' : 'justify-start'
                        ]"
                      >
                        <!-- Reply Button -->
                        <button
                          type="button"
                          @click="replyToPost(forumPost.user?.name || 'Anggota', forumPost.message)"
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer font-medium"
                          title="Balas pesan ini"
                        >
                          <Reply class="w-3.5 h-3.5" />
                          <span class="text-xs">Balas</span>
                        </button>

                        <!-- Copy Button -->
                        <button
                          type="button"
                          @click="copyPostContent(forumPost.id, forumPost.message)"
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer font-medium"
                          title="Salin isi pesan"
                        >
                          <Check v-if="copiedPostId === forumPost.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <Share2 v-else class="w-3.5 h-3.5" />
                          <span class="text-xs">{{ copiedPostId === forumPost.id ? 'Tersalin' : 'Salin' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Scroll to Bottom Floating Pill Button -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-2 scale-95"
            >
              <button
                v-if="showScrollToBottom"
                type="button"
                @click="scrollToBottom(true)"
                class="sticky bottom-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowDown class="w-3.5 h-3.5" />
                <span>Pesan Terbaru</span>
              </button>
            </transition>
          </div>

          <!-- Bottom Sticky Chat Composer Section -->
          <div class="p-3 sm:p-4 bg-card border-t border-border/80 shrink-0">
            <!-- Replying Banner (If Active) -->
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="replyingContext"
                class="mb-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Reply class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div class="truncate">
                    <span class="font-bold text-foreground">Membalas @{{ replyingContext.author }}:</span>
                    <span class="text-muted-foreground ml-1.5 italic truncate">{{ replyingContext.snippet }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  @click="clearReplyContext"
                  class="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-amber-500/20 transition-colors cursor-pointer"
                  title="Batalkan balasan"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
            </transition>

            <!-- Main Input Area Form -->
            <form @submit.prevent="sendPost" class="space-y-2.5">
              <div class="relative rounded-2xl border border-input bg-background hover:border-foreground/40 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden shadow-2xs">
                
                <!-- Tab Mode: WRITE -->
                <div v-show="composerTab === 'write'">
                  <textarea
                    ref="textareaRef"
                    v-model="newPost.message"
                    @keydown="handleTextareaKeydown"
                    rows="3"
                    name="comment"
                    id="comment"
                    class="block w-full resize-none min-h-[76px] max-h-[160px] border-0 bg-transparent py-3 px-4 text-foreground placeholder:text-muted-foreground/70 focus:ring-0 text-xs sm:text-sm leading-relaxed outline-none"
                    placeholder="Tuliskan renungan, pertanyaan, atau pesan ukhuwah Anda... (Ctrl + Enter untuk mengirim)"
                  />
                </div>

                <!-- Tab Mode: PREVIEW -->
                <div
                  v-show="composerTab === 'preview'"
                  class="min-h-[76px] max-h-[160px] overflow-y-auto p-3.5 bg-muted/20 text-xs sm:text-sm"
                >
                  <div
                    v-if="newPost.message && newPost.message.trim()"
                    class="prose dark:prose-invert max-w-none forum-content text-foreground leading-relaxed"
                    v-html="renderMarkdown(newPost.message)"
                  ></div>
                  <div v-else class="flex items-center justify-center h-16 text-muted-foreground text-xs italic">
                    Belum ada teks untuk dipratinjau.
                  </div>
                </div>

                <!-- Markdown Formatting & Mode Switching Footer Bar -->
                <div class="flex items-center justify-between px-3 py-2 border-t border-border/50 bg-muted/30 text-xs">
                  <!-- Formatting Helper Buttons -->
                  <div class="flex items-center gap-1 text-muted-foreground">
                    <button
                      type="button"
                      @click="insertBold"
                      title="Cetak Tebal (**teks**)"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-full transition-colors cursor-pointer"
                    >
                      <Bold class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      @click="insertItalic"
                      title="Cetak Miring (*teks*)"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-full transition-colors cursor-pointer"
                    >
                      <Italic class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      @click="insertQuote"
                      title="Kutipan (> kutipan)"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-full transition-colors cursor-pointer"
                    >
                      <Quote class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      @click="insertArabicSnippet"
                      title="Kutipan Ayat / Hadits"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-full transition-colors cursor-pointer"
                    >
                      <BookOpen class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Write / Preview Mode Switcher & Send Button -->
                  <div class="flex items-center gap-2">
                    <!-- Switch to Preview / Write -->
                    <button
                      type="button"
                      @click="composerTab = composerTab === 'write' ? 'preview' : 'write'"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 text-xs font-medium transition-all cursor-pointer"
                    >
                      <component :is="composerTab === 'write' ? Eye : Edit3" class="w-3 h-3" />
                      <span>{{ composerTab === 'write' ? 'Pratinjau' : 'Tulis' }}</span>
                    </button>

                    <!-- Send Button -->
                    <button
                      type="submit"
                      :disabled="isSubmitting || !newPost.message || !newPost.message.trim()"
                      class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      <Loader2 v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" />
                      <Send v-else class="w-3.5 h-3.5" />
                      <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Quick Shortcut & Etiquette Note -->
              <div class="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>
                  Adab: Santun, menjaga persaudaraan & menyertakan faidah.
                </span>
                <span class="hidden sm:inline-block">
                  Tekan <kbd class="px-1.5 py-0.5 rounded-md bg-muted border border-border text-xs font-mono">Ctrl + Enter</kbd> untuk kirim
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar Column (lg:col-span-4 xl:col-span-3 space-y-5) -->
      <div class="lg:col-span-4 xl:col-span-3 space-y-5">
        <!-- Logged-in User Profile Card -->
        <div v-if="authStore.user" class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground">
          <div class="flex items-center gap-3.5">
            <img
              class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
              :src="getAvatarUrl(authStore.user)"
              alt="Avatar Pengguna"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <h4 class="text-sm font-bold text-foreground truncate">
                  {{ authStore.user.name }}
                </h4>
              </div>
              <p class="text-xs text-muted-foreground truncate">
                {{ authStore.user.email }}
              </p>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Status Anggota Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Community Adab Guidelines Card -->
        <div class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground">
          <div class="flex items-center gap-2.5 pb-3 mb-3.5 border-b border-border">
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-foreground">Adab Percakapan</h3>
              <p class="text-xs text-muted-foreground">Etika ukhuwah & adab ilmiah</p>
            </div>
          </div>

          <ul class="space-y-3 text-xs text-muted-foreground">
            <li class="flex items-start gap-2.5">
              <HeartHandshake class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Gunakan bahasa yang santun, saling memuliakan & menjaga ukhuwah sesama anggota.</span>
            </li>
            <li class="flex items-start gap-2.5">
              <BookOpen class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Sertakan rujukan ayat atau hadits bila menyampaikan dalil atau pandangan.</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Sparkles class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Utamakan faidah tadabbur yang membangun kecintaan pada al-Qur'an.</span>
            </li>
          </ul>
        </div>

        <!-- Quick Tips & Shortcuts Card -->
        <div class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground">
          <div class="flex items-center gap-2 pb-3 mb-3 border-b border-border">
            <Info class="w-4 h-4 text-primary" />
            <h4 class="text-xs font-bold text-foreground uppercase tracking-wider">Tips Format Chat</h4>
          </div>
          <ul class="space-y-2 text-xs text-muted-foreground">
            <li class="flex items-center justify-between">
              <span>Cetak Tebal:</span>
              <code class="px-1.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground">**tebal**</code>
            </li>
            <li class="flex items-center justify-between">
              <span>Cetak Miring:</span>
              <code class="px-1.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground">*miring*</code>
            </li>
            <li class="flex items-center justify-between">
              <span>Kutipan:</span>
              <code class="px-1.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground">&gt; kutipan</code>
            </li>
            <li class="flex items-center justify-between">
              <span>Sebut Anggota:</span>
              <code class="px-1.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground">@nama</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import { toast } from 'vue-sonner';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import authStore from '@/store/auth';
import { listForumPosts, storeForumPost } from '@/api';
import { relativeDate, shortDateTime } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import OnlineStatus from '@/components/OnlineStatus.vue';
import {
  MessagesSquare,
  MessageSquareDashed,
  Send,
  Clock,
  Share2,
  Reply,
  Bold,
  Italic,
  Quote,
  BookOpen,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Loader2,
  Check,
  Eye,
  Edit3,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowDown,
  Info
} from 'lucide-vue-next';

// Configure marked to preserve linebreaks and GFM spec
marked.use({
  breaks: true,
  gfm: true
});

const decodeHTMLEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
};

const renderMarkdown = (content) => {
  if (!content) return '';
  const decoded = decodeHTMLEntities(content);
  const rawHtml = marked.parse(decoded);

  // Style @mentions with serene emerald badge
  return rawHtml.replace(
    /(^|\s)@([a-zA-Z0-9_\-\.\s]+?)(?=[\s\.,!?:;<\n]|$)/g,
    (match, space, name) => {
      const cleanName = name.trim();
      if (cleanName.includes('@') || cleanName.length > 25) return match;
      return `${space}<span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">@${cleanName}</span>`;
    }
  );
};

const page = ref(1);
const forumPosts = ref({ data: [] });
const newPost = ref({ message: '' });
const composerTab = ref('write');
const isSubmitting = ref(false);
const isLoading = ref(true);
const isRefreshing = ref(false);
const copiedPostId = ref(null);
const searchQuery = ref('');
const isSearchOpen = ref(false);
const showScrollToBottom = ref(false);
const replyingContext = ref(null);

const chatContainerRef = ref(null);
const textareaRef = ref(null);

const getAvatarUrl = (user) => {
  if (user?.avatar_url) return user.avatar_url;
  const name = user?.name ? encodeURIComponent(user.name) : 'Anggota';
  return `https://ui-avatars.com/api/?background=40835c&color=fff&name=${name}`;
};

const isCurrentUser = (user) => {
  if (!user || !authStore.user) return false;
  if (user.id && authStore.user.id) return user.id === authStore.user.id;
  return user.email === authStore.user.email || user.name === authStore.user.name;
};

const totalPostsCount = computed(() => {
  if (forumPosts.value?.total) return forumPosts.value.total;
  return forumPosts.value?.data?.length || 0;
});

// Format Exact time tooltip
const formatExactTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return shortDateTime(dateStr);
  } catch (e) {
    return dateStr;
  }
};

// Group posts chronologically by date
const filteredGroupedPosts = computed(() => {
  let list = forumPosts.value?.data || [];

  // Filter by search query if present
  if (searchQuery.value && searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((p) => {
      const msg = (p.message || '').toLowerCase();
      const author = (p.user?.name || '').toLowerCase();
      return msg.includes(q) || author.includes(q);
    });
  }

  // Display posts in chronological order (earlier at top, latest at bottom)
  const sorted = [...list].reverse();

  const groups = [];
  let currentLabel = null;
  let currentGroup = null;

  sorted.forEach((post) => {
    let dateLabel = 'Terkini';
    try {
      const postDate = typeof post.created_at === 'string' ? parseISO(post.created_at) : new Date(post.created_at);
      if (isToday(postDate)) {
        dateLabel = 'Hari Ini';
      } else if (isYesterday(postDate)) {
        dateLabel = 'Kemarin';
      } else {
        dateLabel = format(postDate, 'EEEE, d MMMM yyyy', { locale: idLocale });
      }
    } catch (e) {
      dateLabel = 'Sebelumnya';
    }

    if (dateLabel !== currentLabel) {
      currentLabel = dateLabel;
      currentGroup = {
        dateLabel,
        messages: [post]
      };
      groups.push(currentGroup);
    } else {
      currentGroup.messages.push(post);
    }
  });

  return groups;
});

const loadData = async (silent = false) => {
  if (!silent) isLoading.value = true;
  else isRefreshing.value = true;

  try {
    const data = await listForumPosts({ page: page.value });
    forumPosts.value = data.data;
  } catch (error) {
    toast.error('Gagal memuat percakapan forum.');
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
    await nextTick();
    scrollToBottom(false);
  }
};

const refreshFeed = () => {
  loadData(true);
};

const changePage = (p) => {
  page.value = p;
  loadData();
};

const handleChatScroll = () => {
  if (!chatContainerRef.value) return;
  const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.value;
  // If scrolled up more than 120px from bottom, show scroll to bottom button
  showScrollToBottom.value = scrollHeight - scrollTop - clientHeight > 120;
};

const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTo({
        top: chatContainerRef.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
      // Safety pass for asynchronous fonts/images/rendering
      setTimeout(() => {
        if (chatContainerRef.value) {
          chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
        }
      }, 50);
    }
  });
};

const sendPost = async () => {
  if (!newPost.value.message || !newPost.value.message.trim()) {
    toast.error('Pesan tidak boleh kosong');
    return;
  }

  try {
    isSubmitting.value = true;
    const content = newPost.value.message.trim();
    const data = await storeForumPost({ message: content });

    // Add new post to top of list
    const createdPost = data.data || {
      id: Date.now(),
      message: content,
      created_at: new Date().toISOString(),
      user: authStore.user
    };

    forumPosts.value = {
      ...forumPosts.value,
      data: [
        createdPost,
        ...(forumPosts.value.data || [])
      ]
    };

    newPost.value.message = '';
    composerTab.value = 'write';
    clearReplyContext();
    toast.success('Pesan berhasil terkirim!');
    await nextTick();
    scrollToBottom(true);
  } catch (error) {
    toast.error(typeof error === 'string' ? error : 'Gagal mengirim pesan');
  } finally {
    isSubmitting.value = false;
  }
};

const handleTextareaKeydown = (e) => {
  // Ctrl + Enter or Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    sendPost();
  }
};

const insertFormatting = (prefix, suffix = '') => {
  const currentMsg = newPost.value.message || '';
  newPost.value.message = currentMsg + prefix + (suffix ? 'teks' + suffix : '');
  composerTab.value = 'write';
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.focus();
  });
};

const insertBold = () => insertFormatting('**', '**');
const insertItalic = () => insertFormatting('*', '*');
const insertQuote = () => insertFormatting('> ');
const insertArabicSnippet = () => insertFormatting('> [Tulis ayat/hadits di sini]\n\n');

const replyToPost = (authorName, messageSnippet) => {
  const cleanSnippet = messageSnippet ? messageSnippet.replace(/<[^>]*>?/gm, '').slice(0, 60) + (messageSnippet.length > 60 ? '...' : '') : '';
  replyingContext.value = {
    author: authorName,
    snippet: cleanSnippet
  };

  const nameTag = `@${authorName} `;
  if (!newPost.value.message) {
    newPost.value.message = nameTag;
  } else if (!newPost.value.message.includes(nameTag)) {
    newPost.value.message = nameTag + newPost.value.message;
  }
  
  composerTab.value = 'write';
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.focus();
  });
};

const clearReplyContext = () => {
  replyingContext.value = null;
};

const copyPostContent = async (postId, message) => {
  try {
    const tmp = document.createElement('div');
    tmp.innerHTML = renderMarkdown(message || '');
    const cleanText = tmp.textContent || tmp.innerText || '';

    await navigator.clipboard.writeText(cleanText);
    copiedPostId.value = postId;
    toast.success('Pesan disalin ke clipboard');
    setTimeout(() => {
      if (copiedPostId.value === postId) copiedPostId.value = null;
    }, 2000);
  } catch (err) {
    toast.error('Gagal menyalin pesan');
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.forum-content :deep(p) {
  margin-top: 0.35rem;
  margin-bottom: 0.35rem;
}

.forum-content :deep(p:first-child) {
  margin-top: 0;
}

.forum-content :deep(p:last-child) {
  margin-bottom: 0;
}

.forum-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.forum-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.forum-content :deep(li) {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}

.forum-content :deep(h1),
.forum-content :deep(h2),
.forum-content :deep(h3),
.forum-content :deep(h4) {
  font-weight: 700;
  color: var(--foreground);
  margin-top: 0.75rem;
  margin-bottom: 0.35rem;
}

.forum-content :deep(h1) { font-size: 1.25rem; }
.forum-content :deep(h2) { font-size: 1rem; }
.forum-content :deep(h3) { font-size: 1rem; }
.forum-content :deep(h4) { font-size: 0.875rem; }

.forum-content :deep(blockquote) {
  border-left: 3.5px solid #40835c;
  padding-left: 0.875rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--muted);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--foreground);
}

.forum-content :deep(code) {
  background-color: var(--muted);
  padding: 0.15rem 0.35rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
}

.forum-content :deep(pre) {
  background-color: var(--muted);
  color: var(--foreground);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.forum-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.forum-content :deep(a) {
  color: #40835c;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
}

.forum-content :deep(strong) {
  font-weight: 700;
  color: var(--foreground);
}

.forum-content :deep(em) {
  font-style: italic;
}

.forum-content :deep(hr) {
  border-color: var(--border);
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}
</style>