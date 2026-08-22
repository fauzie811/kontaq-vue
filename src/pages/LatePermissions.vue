<template>
  <div>
    <PageHeader
      class="mb-6 sm:mb-8"
      page-title="Izin Telat"
      description="Riwayat pengajuan izin mengerjakan kuis atau evaluasi di luar jadwal."
    />

    <div class="max-w-4xl space-y-6">
      <!-- Summary bar -->
      <div class="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 shadow-xs">
        <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <FileClock class="w-5 h-5" />
        </div>
        <div>
          <span class="text-xs text-muted-foreground block">Total Pengajuan</span>
          <span class="text-sm font-bold text-foreground">
            {{ permissions.total || 0 }} pengajuan
          </span>
        </div>
      </div>

      <!-- SKELETON -->
      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-4"
        >
          <div class="flex items-center justify-between">
            <div class="h-6 w-32 bg-muted rounded-full"></div>
            <div class="h-6 w-28 bg-muted rounded-full"></div>
          </div>
          <div class="h-5 w-2/3 bg-muted rounded"></div>
          <div class="h-4 w-full bg-muted/60 rounded"></div>
        </div>
      </div>

      <!-- LIST -->
      <div v-else-if="permissions.data && permissions.data.length > 0" class="space-y-4">
        <div
          v-for="permission in permissions.data"
          :key="permission.id"
          class="bg-card rounded-2xl border border-border shadow-xs p-5 text-card-foreground"
        >
          <div class="flex items-center justify-between gap-2 mb-3.5">
            <div
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              <component :is="permission.type === 'evaluation' ? Award : FileQuestion" class="w-3.5 h-3.5 text-muted-foreground" />
              <span>{{ describeItem(permission) }}</span>
            </div>

            <div
              :class="[
                badges[permission.status].wrapper,
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset',
              ]"
            >
              <component :is="badges[permission.status].icon" class="w-3.5 h-3.5" />
              <span>{{ statusLabel(permission) }}</span>
            </div>
          </div>

          <h3 class="text-base font-bold text-foreground mb-2 leading-snug">
            {{ permission.title }}
          </h3>

          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-xs font-semibold text-muted-foreground">Alasan Anda</dt>
              <dd class="text-foreground leading-relaxed">{{ permission.reason }}</dd>
            </div>

            <div v-if="permission.is_active">
              <dt class="text-xs font-semibold text-muted-foreground">Berlaku Sampai</dt>
              <dd class="text-emerald-700 dark:text-emerald-400 font-medium">
                {{ dayDateTime(permission.expires_at) }}
              </dd>
            </div>

            <div v-if="permission.review_note">
              <dt class="text-xs font-semibold text-muted-foreground">Catatan Admin</dt>
              <dd class="text-foreground leading-relaxed">{{ permission.review_note }}</dd>
            </div>
          </dl>

          <p class="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40">
            Diajukan {{ shortDateTime(permission.created_at) }}
          </p>
        </div>
      </div>

      <!-- EMPTY -->
      <div
        v-else
        class="bg-card rounded-2xl border border-border p-10 sm:p-12 text-center text-card-foreground shadow-xs flex flex-col items-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-inner"
        >
          <FileClock class="w-8 h-8" />
        </div>
        <h4 class="text-base font-bold text-foreground mb-1">Belum Ada Pengajuan</h4>
        <p class="text-sm text-muted-foreground max-w-md">
          Jika Anda terlambat mengerjakan kuis atau evaluasi, ajukan izin dari halaman
          Kuis atau Evaluasi. Riwayatnya akan muncul di sini.
        </p>
      </div>

      <Pagination v-if="!isLoading" :meta="permissions" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Award,
  CheckCircle2,
  CircleAlert,
  ClockAlert,
  FileClock,
  FileQuestion,
  Hourglass,
} from 'lucide-vue-next';

import { listMyLatePermissions } from '@/api';
import { dayDateTime, shortDateTime } from '@/utils';
import PageHeader from '@/components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';

const page = ref(1);
const permissions = ref({ data: [] });
const isLoading = ref(true);

async function loadData() {
  isLoading.value = true;
  try {
    const { data } = await listMyLatePermissions({ page: page.value });
    permissions.value = data;
  } catch (error) {
    console.error('Gagal memuat riwayat izin telat:', error);
  } finally {
    isLoading.value = false;
  }
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function describeItem(permission) {
  const kind = permission.type === 'evaluation' ? 'Evaluasi' : 'Kuis';
  const week = permission.week ? ` · Pekan ${permission.week}` : '';
  const order = permission.order ? ` · Hari ${permission.order}` : '';

  return `${kind}${week}${order}`;
}

/**
 * An approved permission whose deadline has passed reads as expired, not active.
 */
function statusLabel(permission) {
  if (permission.status === 'approved' && !permission.is_active) {
    return 'Masa Berlaku Habis';
  }

  return permission.status_label;
}

const badges = {
  pending: {
    wrapper: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 ring-amber-500/20',
    icon: Hourglass,
  },
  approved: {
    wrapper: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
    icon: CheckCircle2,
  },
  rejected: {
    wrapper: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 ring-rose-500/20',
    icon: CircleAlert,
  },
};
</script>
