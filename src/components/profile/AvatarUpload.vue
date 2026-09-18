<script setup>
import { ref, computed, nextTick } from 'vue';
import { Pencil, Trash2, LoaderCircle, Check, X } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import authStore from '@/store/auth';
import { uploadAvatar, deleteAvatar, getUser } from '@/api';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { Button } from '@/components/ui/button';

const fileInput = ref(null);
const isUploading = ref(false);
const isDeleting = ref(false);
const showCropModal = ref(false);

const rawImageSrc = ref(null);
const canvasRef = ref(null);
const imageObj = ref(null);

// Cropping canvas state
const scale = ref(1);
const minScale = ref(0.05);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

const userAvatar = computed(() => {
  return authStore.user?.avatar_url || authStore.user?.avatar || authStore.user?.photo || defaultAvatar;
});

const isCustomAvatar = computed(() => {
  return authStore.user?.avatar || (authStore.user?.avatar_url && !authStore.user.avatar_url.includes('ui-avatars.com'));
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('File harus berupa gambar');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error('Ukuran file maksimal 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    rawImageSrc.value = e.target.result;
    const img = new Image();
    img.onload = () => {
      imageObj.value = img;
      // Initialize scale to fit image into 300x300 canvas
      const minDim = Math.min(img.width, img.height);
      const initialScale = 300 / minDim;
      scale.value = initialScale;
      minScale.value = Math.min(0.05, initialScale / 2);
      offsetX.value = (300 - img.width * scale.value) / 2;
      offsetY.value = (300 - img.height * scale.value) / 2;
      showCropModal.value = true;
      nextTick(() => {
        drawCanvas();
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // reset input
  event.target.value = '';
};

const drawCanvas = () => {
  if (!canvasRef.value || !imageObj.value) return;
  const ctx = canvasRef.value.getContext('2d');
  ctx.clearRect(0, 0, 300, 300);

  // Draw background image
  ctx.drawImage(
    imageObj.value,
    offsetX.value,
    offsetY.value,
    imageObj.value.width * scale.value,
    imageObj.value.height * scale.value
  );

  // Overlay dim mask with circular crop preview
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, 300, 300);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(150, 150, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  ctx.strokeStyle = '#84cc16';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(150, 150, 140, 0, Math.PI * 2);
  ctx.stroke();
};

const startDrag = (e) => {
  isDragging.value = true;
  dragStart.value = {
    x: (e.touches ? e.touches[0].clientX : e.clientX) - offsetX.value,
    y: (e.touches ? e.touches[0].clientY : e.clientY) - offsetY.value,
  };
};

const doDrag = (e) => {
  if (!isDragging.value) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  offsetX.value = clientX - dragStart.value.x;
  offsetY.value = clientY - dragStart.value.y;
  drawCanvas();
};

const stopDrag = () => {
  isDragging.value = false;
};

const updateZoom = (e) => {
  const zoomFactor = parseFloat(e.target.value);
  const oldScale = scale.value;
  scale.value = zoomFactor;
  // Zoom relative to center
  offsetX.value -= (imageObj.value.width * scale.value - imageObj.value.width * oldScale) / 2;
  offsetY.value -= (imageObj.value.height * scale.value - imageObj.value.height * oldScale) / 2;
  drawCanvas();
};

const cancelCrop = () => {
  showCropModal.value = false;
  rawImageSrc.value = null;
  imageObj.value = null;
};

const confirmCropAndUpload = async () => {
  if (!imageObj.value) return;

  // Export cropped 400x400 square canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = 400;
  exportCanvas.height = 400;
  const ctx = exportCanvas.getContext('2d');

  // Scale coordinates from 300px preview canvas to 400px output canvas
  const ratio = 400 / 300;
  ctx.drawImage(
    imageObj.value,
    offsetX.value * ratio,
    offsetY.value * ratio,
    imageObj.value.width * scale.value * ratio,
    imageObj.value.height * scale.value * ratio
  );

  exportCanvas.toBlob(async (blob) => {
    if (!blob) return;
    isUploading.value = true;
    showCropModal.value = false;
    try {
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      await uploadAvatar(file);
      await getUser();
      toast.success('Foto profil berhasil diperbarui');
    } catch (e) {
      toast.error(e?.response?.data?.message || e || 'Gagal mengunggah foto profil');
    } finally {
      isUploading.value = false;
    }
  }, 'image/jpeg', 0.9);
};

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return;
  isDeleting.value = true;
  try {
    await deleteAvatar();
    await getUser();
    toast.success('Foto profil berhasil dihapus');
  } catch (e) {
    toast.error(e?.response?.data?.message || e || 'Gagal menghapus foto profil');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="relative shrink-0">
    <button
      type="button"
      @click="triggerFileInput"
      :disabled="isUploading || isDeleting"
      title="Ubah foto profil"
      class="relative block w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-secondary group cursor-pointer"
    >
      <img :src="userAvatar" alt="Avatar" class="w-full h-full object-cover grayscale" />
      <span class="absolute inset-x-0 bottom-0 pb-3 sm:pb-4 pt-6 flex items-center justify-center gap-1 bg-gradient-to-t from-black/50 to-transparent text-white text-xs font-light group-hover:from-black/70 transition-colors">
        <LoaderCircle v-if="isUploading" class="w-4 h-4 animate-spin" />
        <Pencil v-else class="w-3.5 h-3.5" />
        edit foto
      </span>
    </button>

    <button
      v-if="isCustomAvatar"
      type="button"
      @click="handleDelete"
      :disabled="isUploading || isDeleting"
      title="Hapus foto profil"
      aria-label="Hapus foto profil"
      class="absolute top-1 right-1 w-8 h-8 rounded-full bg-card border border-border text-destructive flex items-center justify-center hover:bg-destructive/10 transition-colors cursor-pointer"
    >
      <LoaderCircle v-if="isDeleting" class="w-4 h-4 animate-spin" />
      <Trash2 v-else class="w-4 h-4" />
    </button>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Square Crop Modal -->
    <div
      v-if="showCropModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="bg-card text-card-foreground rounded-2xl p-6 max-w-sm w-full border border-border space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <h4 class="font-semibold text-foreground text-base">Atur & Potong Foto</h4>
          <button type="button" @click="cancelCrop" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex justify-center">
          <div
            class="relative w-[300px] h-[300px] overflow-hidden rounded-xl bg-gray-900 cursor-move touch-none border border-border"
            @mousedown="startDrag"
            @mousemove="doDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @touchstart="startDrag"
            @touchmove="doDrag"
            @touchend="stopDrag"
          >
            <canvas ref="canvasRef" width="300" height="300"></canvas>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted-foreground font-medium">Perbesar / Perkecil</label>
          <input
            type="range"
            :min="minScale"
            max="3"
            step="0.01"
            :value="scale"
            @input="updateZoom"
            class="w-full accent-primary"
          />
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" size="sm" @click="cancelCrop">
            Batal
          </Button>
          <Button type="button" size="sm" class="bg-primary hover:bg-primary/90 text-primary-foreground" @click="confirmCropAndUpload">
            <Check class="w-4 h-4 mr-1.5" />
            Simpan Foto
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
