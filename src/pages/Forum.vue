<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <PageHeader
      page-title="Forum Ukhuwah"
      description="Wadah silaturahmi, diskusi, dan berbagi faidah antar sesama anggota Kontaq."
    />

    <!-- Main 2-Column Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Main Content Area -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Post Composer Card -->
        <div id="forum-composer" class="bg-card rounded-2xl border border-border shadow-xs text-card-foreground p-4 sm:p-6 transition-all hover:border-primary/30">
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
            <div class="flex items-center gap-3">
              <img
                class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                :src="getAvatarUrl(authStore.user)"
                alt="Avatar Pengguna"
              />
              <div>
                <p class="text-sm font-semibold text-foreground leading-tight">
                  {{ authStore.user?.name || 'Jamaah Kontaq' }}
                </p>
                <span class="text-xs text-muted-foreground">Tulis pesan baru</span>
              </div>
            </div>

            <!-- Composer Mode Switcher (Tulis / Pratinjau) -->
            <div class="flex items-center p-1 bg-muted/60 rounded-xl border border-border text-xs font-medium">
              <button
                type="button"
                @click="composerTab = 'write'"
                :class="[
                  'px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
                  composerTab === 'write' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                <Edit3 class="w-3.5 h-3.5" />
                <span>Tulis</span>
              </button>
              <button
                type="button"
                @click="composerTab = 'preview'"
                :class="[
                  'px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
                  composerTab === 'preview' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                <Eye class="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>
          </div>

          <form @submit.prevent="sendPost">
            <!-- WRITE TAB -->
            <div v-show="composerTab === 'write'" class="space-y-3">
              <div class="relative rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <textarea
                  v-model="newPost.message"
                  rows="4"
                  name="comment"
                  id="comment"
                  class="block w-full resize-y min-h-[100px] border-0 bg-transparent py-3 px-4 text-foreground placeholder:text-muted-foreground/70 focus:ring-0 text-sm leading-relaxed outline-none"
                  placeholder="Tuliskan renungan, pertanyaan, atau pesan ukhuwah Anda di sini... (mendukung Markdown)"
                />

                <!-- Markdown Helper Bar -->
                <div class="flex items-center justify-between px-3 py-2 border-t border-border/50 bg-muted/30 rounded-b-xl text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="insertBold"
                      title="Cetak Tebal"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <Bold class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      @click="insertItalic"
                      title="Cetak Miring"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <Italic class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      @click="insertQuote"
                      title="Kutipan"
                      class="p-1.5 hover:bg-background hover:text-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <Quote class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span class="text-xs text-muted-foreground">
                    Markdown aktif
                  </span>
                </div>
              </div>
            </div>

            <!-- PREVIEW TAB -->
            <div v-show="composerTab === 'preview'" class="min-h-[140px] p-4 rounded-xl border border-border bg-muted/20">
              <div v-if="newPost.message && newPost.message.trim()" class="prose dark:prose-invert max-w-none text-sm forum-content text-foreground" v-html="renderMarkdown(newPost.message)"></div>
              <div v-else class="flex flex-col items-center justify-center h-28 text-muted-foreground text-xs italic">
                <span>Belum ada pesan untuk dipratinjau.</span>
              </div>
            </div>

            <!-- Submit Footer -->
            <div class="flex items-center justify-between mt-4">
              <span class="text-xs text-muted-foreground hidden sm:inline-block">
                Jagalah kesantunan & adab berdiskusi.
              </span>
              <button
                type="submit"
                :disabled="isSubmitting || !newPost.message || !newPost.message.trim()"
                class="ml-auto inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                <Send v-else class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Forum Posts Feed -->
        <div class="bg-card rounded-2xl border border-border shadow-xs text-card-foreground overflow-hidden">
          <!-- SKELETON LOADING STATE -->
          <div v-if="isLoading" class="divide-y divide-border/60">
            <div v-for="i in 4" :key="i" class="p-6 space-y-3 animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-muted"></div>
                <div class="space-y-1.5 flex-1">
                  <div class="h-4 w-32 bg-muted rounded"></div>
                  <div class="h-3 w-20 bg-muted/60 rounded"></div>
                </div>
              </div>
              <div class="h-4 w-full bg-muted/80 rounded"></div>
              <div class="h-4 w-3/4 bg-muted/60 rounded"></div>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else-if="!forumPosts.data || forumPosts.data.length === 0" class="flex flex-col items-center justify-center p-12 text-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
              <MessageSquareDashed class="w-8 h-8" />
            </div>
            <h3 class="text-base font-bold text-foreground mb-1">Belum Ada Pesan</h3>
            <p class="text-xs text-muted-foreground max-w-sm">
              Belum ada diskusi di forum ini. Jadilah yang pertama menyampaikan pesan!
            </p>
          </div>

          <!-- POST LIST -->
          <ul v-else role="list" class="divide-y divide-border/60">
            <li
              v-for="forumPost in forumPosts.data"
              :key="forumPost.id"
              class="p-5 sm:p-6 transition-colors hover:bg-muted/20 group"
            >
              <div class="flex items-start gap-3.5 sm:gap-4">
                <!-- Author Avatar -->
                <img
                  class="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-border/80 group-hover:ring-primary/40 transition-all"
                  :src="getAvatarUrl(forumPost.user)"
                  :alt="forumPost.user?.name || 'User avatar'"
                />

                <div class="flex-1 min-w-0">
                  <!-- Header Meta: Author Name + Date -->
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="text-sm font-bold text-foreground truncate">
                      {{ forumPost.user ? forumPost.user.name : '[user dihapus]' }}
                    </span>

                    <div class="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock class="w-3.5 h-3.5" />
                      <span>{{ relativeDate(forumPost.created_at) }}</span>
                    </div>
                  </div>

                  <!-- Post Body (Markdown Rendered) -->
                  <div
                    class="text-sm text-foreground leading-relaxed prose dark:prose-invert max-w-none forum-content"
                    v-html="renderMarkdown(forumPost.message)"
                  ></div>

                  <!-- Post Utilities (Balas & Salin) -->
                  <div class="flex items-center gap-4 mt-3 pt-2.5 border-t border-border/40 text-xs">
                    <button
                      type="button"
                      @click="replyToPost(forumPost.user?.name || 'jamaah')"
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer font-medium"
                    >
                      <Reply class="w-3.5 h-3.5" />
                      <span>Balas</span>
                    </button>

                    <button
                      type="button"
                      @click="copyPostContent(forumPost.id, forumPost.message)"
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer font-medium ml-auto"
                    >
                      <Check v-if="copiedPostId === forumPost.id" class="w-3.5 h-3.5 text-emerald-600" />
                      <Share2 v-else class="w-3.5 h-3.5" />
                      <span>{{ copiedPostId === forumPost.id ? 'Tersalin' : 'Salin' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Real Backend Pagination -->
          <Pagination :meta="forumPosts" v-on:change="changePage" />
        </div>
      </div>

      <!-- Sidebar Column -->
      <div class="space-y-6">
        <!-- Community Adab Guidelines Card -->
        <div class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground">
          <div class="flex items-center gap-2.5 pb-3 mb-3.5 border-b border-border">
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-foreground">Adab Berdiskusi</h3>
              <p class="text-xs text-muted-foreground">Etika ukhuwah & adab ilmiah</p>
            </div>
          </div>

          <ul class="space-y-2.5 text-xs text-muted-foreground">
            <li class="flex items-start gap-2">
              <HeartHandshake class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Gunakan bahasa yang santun, saling memuliakan & menjaga persaudaraan.</span>
            </li>
            <li class="flex items-start gap-2">
              <BookOpen class="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Sertakan rujukan ayat atau hadits bila menyampaikan argumen.</span>
            </li>
            <li class="flex items-start gap-2">
              <Sparkles class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Utamakan faedah tadabbur yang membangun pemahaman al-Qur'an.</span>
            </li>
          </ul>
        </div>

        <!-- Logged-in User Profile Summary Card -->
        <div v-if="authStore.user" class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground">
          <div class="flex items-center gap-3">
            <img
              class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
              :src="getAvatarUrl(authStore.user)"
              alt="Avatar Pengguna"
            />
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-bold text-foreground truncate">
                {{ authStore.user.name }}
              </h4>
              <p class="text-xs text-muted-foreground truncate">
                {{ authStore.user.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { marked } from 'marked';
import { toast } from 'vue-sonner';
import authStore from '@/store/auth';
import { listForumPosts, storeForumPost } from '@/api';
import { relativeDate } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import {
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
  Edit3
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
  return marked.parse(decoded);
};

const page = ref(1);
const forumPosts = ref({ data: [] });
const newPost = ref({ message: '' });
const composerTab = ref('write');
const isSubmitting = ref(false);
const isLoading = ref(true);
const copiedPostId = ref(null);

const getAvatarUrl = (user) => {
  if (user?.avatar_url) return user.avatar_url;
  const name = user?.name ? encodeURIComponent(user.name) : '';
  return `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name}`;
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const data = await listForumPosts({ page: page.value });
    forumPosts.value = data.data;
  } catch (error) {
    toast.error('Gagal memuat postingan forum.');
  } finally {
    isLoading.value = false;
  }
};
loadData();

const changePage = (p) => {
  page.value = p;
  loadData();
};

const sendPost = async () => {
  if (!newPost.value.message || !newPost.value.message.trim()) {
    toast.error('Pesan tidak boleh kosong');
    return;
  }

  try {
    isSubmitting.value = true;
    const data = await storeForumPost({ message: newPost.value.message.trim() });
    
    // Add new post to top of list
    const createdPost = data.data || {
      id: Date.now(),
      message: newPost.value.message.trim(),
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
    toast.success('Pesan berhasil dipublikasikan!');
  } catch (error) {
    toast.error(typeof error === 'string' ? error : 'Gagal mengirim pesan');
  } finally {
    isSubmitting.value = false;
  }
};

const insertFormatting = (prefix, suffix = '') => {
  const currentMsg = newPost.value.message || '';
  newPost.value.message = currentMsg + prefix + (suffix ? 'teks' + suffix : '');
};

const insertBold = () => insertFormatting('**', '**');
const insertItalic = () => insertFormatting('*', '*');
const insertQuote = () => insertFormatting('> ');

const replyToPost = (authorName) => {
  const nameTag = `@${authorName} `;
  if (!newPost.value.message) {
    newPost.value.message = nameTag;
  } else if (!newPost.value.message.includes(nameTag)) {
    newPost.value.message = nameTag + newPost.value.message;
  }
  composerTab.value = 'write';
  const composerEl = document.getElementById('forum-composer');
  if (composerEl) {
    composerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const textarea = composerEl.querySelector('textarea');
    if (textarea) textarea.focus();
  }
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
  font-size: 0.85em;
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