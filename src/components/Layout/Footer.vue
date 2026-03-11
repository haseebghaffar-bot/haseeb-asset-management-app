<template>
  <footer
    class="h-16 flex items-center justify-between px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
  >
    <div>&copy; {{ currentYear }} Hera Technologies. All rights reserved.</div>
    <div class="flex gap-4">
      <a
        href="#"
        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline transition-colors outline-offset-2 rounded"
        >Help</a
      >
      <a
        href="#"
        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline transition-colors outline-offset-2 rounded"
        >Privacy</a
      >
      <a
        href="#"
        class="hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline transition-colors outline-offset-2 rounded"
        >Terms</a
      >
    </div>
  </footer>
</template>

<script setup lang="ts">
  const currentYear = new Date().getFullYear();
</script>
