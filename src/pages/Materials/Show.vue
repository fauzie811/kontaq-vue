<template>
  <div>
    <PageHeader class="mb-8" :page-title="material ? material.title : null" />

    <!-- Related Quran Verses (Single Card Layout) -->
    <MaterialRelatedVerses
      v-if="materialVerses.length > 0"
      :verses="materialVerses"
    />

    <!-- Material Content Card -->
    <div :class="[
      'max-w-3xl overflow-hidden bg-card text-card-foreground border border-border rounded-2xl shadow-xs',
      font == 'sans' ? 'font-sans' : '',
      font == 'arial' ? 'font-arial' : '',
      font == 'times' ? 'font-times' : '',
    ]">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="material" class="prose max-w-none dark:prose-invert" v-html="material.content"></div>
        <div v-else class="prose max-w-none">
          <p>
            <TextPlaceholder class="block" />
          </p>
          <p>
            <TextPlaceholder class="block" />
          </p>
          <p>
            <TextPlaceholder class="block w-96" />
          </p>
        </div>
      </div>
    </div>

    <button @click="finishRead" type="button"
      class="mt-8 rounded-md bg-lime-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 cursor-pointer">Selesai</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLocalStorage from '@/plugins/localStorage';
import { getMyMaterial, updateMyMaterial } from '@/api';
import PageHeader from '../../components/PageHeader.vue';
import TextPlaceholder from '@/components/placeholders/TextPlaceholder.vue';
import MaterialRelatedVerses from '@/components/MaterialRelatedVerses.vue';

const route = useRoute();
const router = useRouter();
const font = useLocalStorage('font-family', 'sans');
const material = ref(null);

const materialVerses = computed(() => {
  if (!material.value) return [];
  return material.value.quran_verses || material.value.quranVerses || [];
});

async function loadData(id) {
  if (!id) return;
  try {
    const data = await getMyMaterial(id);
    material.value = data.data;
  } catch (e) {
    console.error('Failed to load material:', e);
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId);
    }
  },
  { immediate: true }
);

async function finishRead() {
  await updateMyMaterial(route.params.id);
  router.push('/materials');
}
</script>