<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-foreground/40 backdrop-blur-xs" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 sm:items-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full sm:max-w-lg overflow-hidden rounded-3xl bg-card text-card-foreground border border-border p-6 sm:p-8 shadow-2xl"
            >
              <div
                class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-inner"
              >
                <ClockAlert class="h-7 w-7" />
              </div>

              <DialogTitle class="text-center text-xl font-bold leading-tight text-foreground mb-1">
                Ajukan Izin Telat
              </DialogTitle>
              <p class="text-center text-sm text-muted-foreground leading-relaxed mb-1">
                {{ itemLabel }}
              </p>
              <p v-if="closedAt" class="text-center text-xs text-muted-foreground mb-5">
                Waktu pengerjaan berakhir {{ shortDateTime(closedAt) }}.
              </p>
              <div v-else class="mb-5" />

              <form class="space-y-2" @submit.prevent="submit">
                <label for="late-permission-reason" class="block text-sm font-semibold text-foreground">
                  Alasan Keterlambatan
                </label>
                <textarea
                  id="late-permission-reason"
                  ref="reasonField"
                  v-model="reason"
                  rows="4"
                  :disabled="isSubmitting"
                  placeholder="Jelaskan mengapa Anda tidak dapat mengerjakan tepat waktu."
                  class="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30 disabled:opacity-60 resize-none"
                ></textarea>

                <p v-if="error" class="text-xs font-medium text-rose-600 dark:text-rose-400">
                  {{ error }}
                </p>
                <p v-else class="text-xs text-muted-foreground">
                  Minimal 10 karakter. Admin akan meninjau pengajuan Anda.
                </p>

                <div class="flex flex-col-reverse sm:flex-row-reverse gap-2.5 pt-4">
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full sm:flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                    <span>{{ isSubmitting ? 'Mengirim…' : 'Kirim Pengajuan' }}</span>
                  </button>
                  <button
                    type="button"
                    :disabled="isSubmitting"
                    class="w-full sm:flex-1 py-2.5 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-full border border-border transition-all text-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
                    @click="close"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { ClockAlert, Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { requestLatePermission } from '@/api';
import { shortDateTime } from '@/utils';

const MIN_REASON_LENGTH = 10;

const props = defineProps({
  open: { type: Boolean, default: false },
  /** 'quiz' or 'evaluation' */
  type: { type: String, default: 'quiz' },
  itemId: { type: [Number, String], default: null },
  itemLabel: { type: String, default: '' },
  closedAt: { type: String, default: null },
});

const emit = defineEmits(['update:open', 'submitted']);

const reason = ref('');
const error = ref('');
const isSubmitting = ref(false);
const reasonField = ref(null);

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return;
    reason.value = '';
    error.value = '';
    isSubmitting.value = false;
    await nextTick();
    reasonField.value?.focus();
  }
);

function close() {
  if (isSubmitting.value) return;
  emit('update:open', false);
}

async function submit() {
  const trimmed = reason.value.trim();

  if (trimmed.length < MIN_REASON_LENGTH) {
    error.value = `Alasan minimal ${MIN_REASON_LENGTH} karakter.`;
    return;
  }

  error.value = '';
  isSubmitting.value = true;

  try {
    const data = await requestLatePermission({
      type: props.type,
      id: props.itemId,
      reason: trimmed,
    });
    toast.success(data.message || 'Pengajuan izin telat terkirim.');
    emit('submitted', data.data);
    emit('update:open', false);
  } catch (e) {
    error.value = typeof e === 'string' ? e : 'Pengajuan gagal dikirim.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
