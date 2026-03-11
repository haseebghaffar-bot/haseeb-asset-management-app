<template>
  <div
    class="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
  >
    <div
      class="w-20 h-20 mb-6 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full flex items-center justify-center"
    >
      <el-icon :size="40">
        <Search v-if="icon === 'search'" />
        <Box v-else />
      </el-icon>
    </div>

    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>

    <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
      {{ description }}
    </p>

    <el-button
      v-if="actionText"
      type="primary"
      size="large"
      @click="$emit('action')"
      class="!rounded-lg px-6 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
    >
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { Box, Search } from '@element-plus/icons-vue';

  defineProps({
    title: {
      type: String,
      default: 'No Data Found',
    },
    description: {
      type: String,
      default: 'There is no data to display here yet.',
    },
    icon: {
      type: String as () => 'box' | 'search',
      default: 'box',
    },
    actionText: {
      type: String,
      default: '',
    },
  });

  defineEmits(['action']);
</script>
