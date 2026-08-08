<script setup>
import { ref, computed, nextTick } from 'vue';
import { Camera, Trash2, LoaderCircle, Upload, Check, X } from 'lucide-vue-next';
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
  <div class="flex flex-col items-center sm:flex-row sm:items-center gap-6 pb-6 border-b border-gray-100">
    <div class="relative group shrink-0">
      <div class="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-lime-500/20 bg-gray-100">
        <img :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
      </div>

      <button
        type="button"
        @click="triggerFileInput"
        :disabled="isUploading || isDeleting"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Camera class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-medium">Ubah</span>
      </button>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="onFileSelected"
      />
    </div>

    <div class="flex flex-col gap-2 text-center sm:text-left">
      <h3 class="text-sm font-semibold text-gray-900">Foto Profil</h3>
      <p class="text-xs text-gray-500 max-w-xs">
        Format JPG, PNG, atau WebP. Maksimal 2MB. Potong gambar sesuai area lingkaran.
      </p>
      <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="triggerFileInput"
          :disabled="isUploading || isDeleting"
        >
          <LoaderCircle v-if="isUploading" class="w-4 h-4 mr-1.5 animate-spin" />
          <Upload v-else class="w-4 h-4 mr-1.5" />
          Pilih Foto
        </Button>

        <Button
          v-if="isCustomAvatar"
          type="button"
          variant="destructive"
          size="sm"
          @click="handleDelete"
          :disabled="isUploading || isDeleting"
        >
          <LoaderCircle v-if="isDeleting" class="w-4 h-4 mr-1.5 animate-spin" />
          <Trash2 v-else class="w-4 h-4 mr-1.5" />
          Hapus
        </Button>
      </div>
    </div>

    <!-- Square Crop Modal -->
    <div
      v-if="showCropModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h4 class="font-semibold text-gray-900 text-base">Atur & Potong Foto</h4>
          <button type="button" @click="cancelCrop" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex justify-center">
          <div
            class="relative w-[300px] h-[300px] overflow-hidden rounded-xl bg-gray-900 cursor-move touch-none border border-gray-200 shadow-inner"
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
          <label class="text-xs text-gray-500 font-medium">Perbesar / Perkecil</label>
          <input
            type="range"
            :min="minScale"
            max="3"
            step="0.01"
            :value="scale"
            @input="updateZoom"
            class="w-full accent-lime-600"
          />
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t">
          <Button type="button" variant="outline" size="sm" @click="cancelCrop">
            Batal
          </Button>
          <Button type="button" size="sm" class="bg-lime-600 hover:bg-lime-500 text-white" @click="confirmCropAndUpload">
            <Check class="w-4 h-4 mr-1.5" />
            Simpan Foto
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
