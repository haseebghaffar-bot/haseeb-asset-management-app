<template>
  <div
    class="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10"
  >
    <div
      class="w-20 h-20 mb-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center"
    >
      <el-icon :size="40">
        <CircleClose />
      </el-icon>
    </div>

    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>

    <p class="text-gray-500 dark:text-gray-400 max-w-lg mb-6 break-words">
      {{ message }}
    </p>

    <el-button
      v-if="showRetry"
      type="danger"
      size="large"
      @click="$emit('retry')"
      class="!rounded-lg px-8 shadow-md focus-visible:outline outline-2 outline-offset-2 outline-red-500 transition-all hover:scale-105 active:scale-95"
    >
      Try Again
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { CircleClose } from '@element-plus/icons-vue';

  defineProps({
    title: {
      type: String,
      default: 'Could not load assets',
    },
    message: {
      type: String,
      required: true,
    },
    showRetry: {
      type: Boolean,
      default: false,
    },
  });

  defineEmits(['retry']);
</script>
