<template>
  <div>
    <PageHeader class="mb-8" page-title="Materi Tadabbur">
    </PageHeader>

    <div class="max-w-3xl">
      <div class="flex justify-end gap-4 mb-4">
        <PartPicker class="w-full sm:w-40" v-model="part_number" @update:modelValue="() => changePage(1)" />
        <WeekPicker show-all-option class="w-full sm:w-56" v-model="week"
          @update:modelValue="() => changePage(1)" />
      </div>

      <div class="overflow-hidden bg-card rounded-2xl border border-border shadow-xs text-card-foreground">
        <ul role="list" class="divide-y divide-border">
          <li v-for="material in materials.data" :key="material.id"
            class="flex items-center justify-between px-6 py-4 gap-x-6">
            <div class="min-w-0">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-foreground">{{ material.title }}</p>
                <p
                  :class="[statuses[getStatus(material)], 'rounded-full whitespace-nowrap mt-0.5 px-2 py-0.5 text-xs font-semibold ring-1 ring-inset']">
                  {{ getStatus(material) }}</p>
              </div>
              <div class="flex items-center mt-1 text-xs leading-5 text-muted-foreground gap-x-2">
                <p v-if="material.week" class="truncate">Pekan {{ material.week }}</p>
              </div>
            </div>
            <div class="flex items-center flex-none gap-x-4">
              <router-link :to="{ name: 'materials.show', params: { id: material.id } }"
                class="hidden rounded-xl bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-sm font-semibold text-secondary-foreground border border-border shadow-2xs sm:block transition-colors">Lihat
                materi<span class="sr-only">, {{ material.name }}</span></router-link>
            </div>
          </li>
        </ul>
        <Pagination :meta="materials" v-on:change="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listMyMaterials } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import WeekPicker from '@/components/WeekPicker.vue';
import PartPicker from '@/components/PartPicker.vue';

const page = ref(1);
const week = ref(null);
const part_number = ref(null);
const materials = ref({ data: [] });

async function loadData() {
  const { data } = await listMyMaterials({ page: page.value, week: week.value, part_number: part_number.value });
  materials.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(material) {
  if (material.read_at) return 'Selesai';
  return 'Belum dibaca';
}

const statuses = {
  Selesai: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
  'Belum dibaca': 'text-muted-foreground bg-secondary ring-border',
}
</script>