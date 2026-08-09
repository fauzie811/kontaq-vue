<template>
  <div>
    <!-- Desktop Dropdown (sm: breakpoint and up) -->
    <div
      v-if="isOpen"
      class="hidden sm:block absolute right-0 mt-2 w-96 bg-card rounded-2xl shadow-xl border border-border py-3 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
    >
      <div class="px-4 py-2 border-b border-border flex justify-between items-center bg-muted/50">
        <h4 class="font-bold text-foreground text-sm flex items-center gap-1.5">
          <Bell class="w-4 h-4 text-primary" />
          Notifikasi & Pengumuman
        </h4>
        <span class="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
          {{ notifications.length }} Baru
        </span>
      </div>

      <!-- Notifications List -->
      <div class="divide-y divide-border max-h-80 overflow-y-auto text-sm">
        <div v-if="notifications.length === 0" class="p-6 text-center text-xs text-muted-foreground">
          Tidak ada pengumuman baru.
        </div>
        <div
          v-for="(notif, idx) in notifications"
          :key="notif.id || idx"
          @click="onSelect(notif)"
          class="p-3.5 hover:bg-accent/50 transition cursor-pointer flex gap-3 items-start"
        >
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Pin v-if="notif.isSticky" class="w-4 h-4 text-primary" />
            <Bell v-else class="w-4 h-4 text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-foreground text-xs sm:text-sm truncate">{{ notif.title }}</p>
            <p class="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{{ notif.desc }}</p>
            <span class="text-[10px] text-primary font-medium mt-1 block">{{ notif.time }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Link -->
      <router-link
        :to="{ name: 'announcements' }"
        @click="emit('close')"
        class="block text-center py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition border-t border-border"
      >
        Lihat Semua Pengumuman &rarr;
      </router-link>
    </div>

    <!-- Mobile Bottom Sheet (Teleported to Body for < sm breakpoint) -->
    <Teleport to="body">
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
          class="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          @click="emit('close')"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="isOpen"
          class="sm:hidden fixed bottom-0 inset-x-0 bg-card rounded-t-3xl border-t border-border shadow-2xl z-50 max-h-[85vh] flex flex-col overflow-hidden"
        >
          <!-- Grab Handle -->
          <div class="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing" @click="emit('close')">
            <div class="w-12 h-1.5 bg-muted-foreground/30 rounded-full"></div>
          </div>

          <!-- Sheet Header -->
          <div class="px-5 py-3 border-b border-border flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bell class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-foreground text-base leading-tight">Notifikasi</h3>
                <p class="text-xs text-muted-foreground font-medium">Pengumuman & informasi terbaru</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                {{ notifications.length }} Baru
              </span>
              <button
                @click="emit('close')"
                class="w-8 h-8 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="divide-y divide-border max-h-[55vh] overflow-y-auto px-4 py-2 text-sm">
            <div v-if="notifications.length === 0" class="py-10 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <Bell class="w-8 h-8 text-muted-foreground/50" />
              <span>Tidak ada pengumuman baru.</span>
            </div>
            <div
              v-for="(notif, idx) in notifications"
              :key="notif.id || idx"
              @click="onSelect(notif)"
              class="py-3 px-2 hover:bg-accent/50 rounded-xl transition cursor-pointer flex gap-3 items-start my-1"
            >
              <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Pin v-if="notif.isSticky" class="w-4.5 h-4.5 text-primary" />
                <Bell v-else class="w-4.5 h-4.5 text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-foreground text-sm leading-snug">{{ notif.title }}</p>
                <p class="text-xs text-muted-foreground mt-1 leading-normal line-clamp-2">{{ notif.desc }}</p>
                <span class="text-[11px] text-primary font-semibold mt-1.5 block">{{ notif.time }}</span>
              </div>
            </div>
          </div>

          <!-- Footer Link -->
          <router-link
            :to="{ name: 'announcements' }"
            @click="emit('close')"
            class="block text-center py-3.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition border-t border-border mt-auto"
          >
            Lihat Semua Pengumuman &rarr;
          </router-link>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';
import { Bell, Pin, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'select']);

function onSelect(notif) {
  emit('select', notif);
  emit('close');
}

// Body scroll lock on mobile when sheet is open
watch(
  () => props.isOpen,
  (val) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
);

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>
