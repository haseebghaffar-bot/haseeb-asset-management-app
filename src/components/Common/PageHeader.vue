<template>
  <div class="flex items-center gap-4 mb-6">
    <el-button
      v-if="showBack"
      circle
      plain
      @click="$emit('back')"
      :aria-label="backLabel || 'Go Back'"
    >
      <el-icon><Back /></el-icon>
    </el-button>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="ml-auto">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Back } from '@element-plus/icons-vue';

  defineProps<{
    title: string;
    subtitle?: string;
    showBack?: boolean;
    backLabel?: string;
  }>();

  defineEmits(['back']);
</script>
