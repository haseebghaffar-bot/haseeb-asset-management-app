<template>
  <div class="text-center mb-8">
    <div
      class="w-16 h-16 rounded-xl bg-gray-800 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg mb-4"
    >
      H
    </div>
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string;
    subtitle: string;
  }>();
</script>
