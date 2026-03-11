<template>
  <div
    :class="[
      'flex flex-col items-center justify-center p-4',
      fullscreen
        ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
        : 'h-full w-full min-h-[150px]',
    ]"
    role="status"
    aria-live="polite"
  >
    <el-icon class="is-loading" :size="size" :color="color">
      <SpinnerIcon />
    </el-icon>
    <span v-if="text" class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
      {{ text }}
    </span>
    <span class="sr-only">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
  import SpinnerIcon from '@/components/svg/SpinnerIcon.vue';

  defineProps({
    text: {
      type: String,
      default: 'Loading...',
    },
    size: {
      type: Number,
      default: 40,
    },
    color: {
      type: String,
      default: 'var(--el-color-primary)',
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  });
</script>
