<template>
  <main
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <SignIn />
  </main>
</template>

<script setup lang="ts">
  import SignIn from '@/components/Auth/SignIn.vue';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { onMounted } from 'vue';
  const route = useRoute();
  onMounted(() => {
    if (route.query.registered === 'true') {
      ElMessage({
        message: 'Email verified successfully! You can now sign in.',
        type: 'success',
        duration: 5000,
        customClass: 'dark:!bg-gray-800 dark:!border-gray-700',
      });
    }
  });
</script>
