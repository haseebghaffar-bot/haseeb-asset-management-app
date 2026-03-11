<template>
  <div class="w-full mt-2 flex gap-1 h-1.5" v-if="hasPassword">
    <div
      class="flex-1 rounded-full transition-colors"
      :class="strength >= 1 ? 'bg-gray-400' : 'bg-gray-200 dark:bg-gray-700'"
    ></div>
    <div
      class="flex-1 rounded-full transition-colors"
      :class="strength >= 2 ? 'bg-gray-500' : 'bg-gray-200 dark:bg-gray-700'"
    ></div>
    <div
      class="flex-1 rounded-full transition-colors"
      :class="strength >= 3 ? 'bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'"
    ></div>
    <div
      class="flex-1 rounded-full transition-colors"
      :class="strength >= 4 ? 'bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'"
    ></div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    strength: number;
    hasPassword?: boolean;
  }>();
</script>
