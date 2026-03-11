<template>
  <div class="image-upload-component">
    <div
      v-if="!previewUrl"
      class="upload-dropzone border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors outline-offset-2 focus-visible:outline outline-gray-500"
      :class="[
        isDragging
          ? 'border-gray-500 bg-gray-50 dark:bg-gray-800/40'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800',
      ]"
      @dragenter="handleDragEnter"
      @dragover.prevent
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerFileInput"
      tabindex="0"
      @keydown.enter="triggerFileInput"
      role="button"
      aria-label="Upload image area"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/jpeg, image/png, image/webp"
        @change="handleFileSelect"
        aria-hidden="true"
      />

      <el-icon :size="48" class="text-gray-400 mb-4" :class="{ 'text-gray-600': isDragging }">
        <UploadFilled />
      </el-icon>

      <div class="text-center font-medium text-gray-700 dark:text-gray-200">
        Click to upload or drag and drop
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        JPG, PNG, WEBP (Max: {{ maxSizeMB }}MB)
      </p>
    </div>

    <div
      v-else
      class="image-preview relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
    >
      <img :src="previewUrl" alt="Asset Preview" class="max-h-64 object-contain w-full" />

      <div
        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4"
      >
        <el-button
          type="primary"
          plain
          @click="triggerFileInput"
          class="w-32 focus-visible:outline"
        >
          <el-icon class="mr-2"><UploadFilled /></el-icon> Replace
        </el-button>
        <el-button type="danger" plain @click="clearImage" class="w-32 focus-visible:outline">
          <el-icon class="mr-2"><Delete /></el-icon> Remove
        </el-button>

        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept="image/jpeg, image/png, image/webp"
          @change="handleFileSelect"
        />
      </div>

      <div
        class="absolute bottom-0 inset-x-0 bg-black/50 px-3 py-1 text-xs text-white truncate"
        v-if="selectedFile"
      >
        {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { UploadFilled, Delete } from '@element-plus/icons-vue';
  import { formatFileSize } from '@/services/utils';
  import { triggerError } from '@/components/Common/SuccessNotification.vue';
  const props = defineProps({
    existingImageUrl: {
      type: String,
      default: '',
    },
    maxSizeMB: {
      type: Number,
      default: 5,
    },
  });
  const emit = defineEmits(['file-selected', 'remove-image']);

  const isDragging = ref(false);
  const previewUrl = ref(props.existingImageUrl);

  watch(
    () => props.existingImageUrl,
    (newUrl) => {
      if (newUrl && !selectedFile.value) {
        previewUrl.value = newUrl;
      }
    }
  );

  const selectedFile = ref<File | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  const maxSizeBytes = computed(() => props.maxSizeMB * 1024 * 1024);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = true;
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;
  };
  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      triggerError('Invalid File Type', 'Only JPG, PNG, and WEBP images are allowed.');
      return;
    }
    if (file.size > maxSizeBytes.value) {
      triggerError('File Too Large', `Image must be smaller than ${props.maxSizeMB}MB.`);
      return;
    }

    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    emit('file-selected', file);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]!);
    }
  };
  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      validateAndSetFile(target.files[0]!);
    }
  };
  const triggerFileInput = () => {
    fileInput.value?.click();
  };
  const clearImage = () => {
    selectedFile.value = null;
    if (!props.existingImageUrl && previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    emit('remove-image');
  };
</script>

<style scoped>
  .upload-dropzone {
    min-height: 200px;
  }
</style>
