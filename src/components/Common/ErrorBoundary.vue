<template>
  <div class="error-boundary">
    <div
      v-if="error"
      class="error-boundary-container p-8 flex flex-col items-center justify-center min-h-[300px] text-center"
    >
      <div
        class="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 max-w-md"
      >
        <el-icon :size="48" class="text-red-500 mb-4"><Warning /></el-icon>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          An unexpected error occurred while rendering this component.
        </p>
        <div class="flex gap-3 justify-center">
          <el-button type="primary" @click="recover"> Try Again </el-button>
          <el-button @click="goHome"> Go to Dashboard </el-button>
        </div>
        <details
          v-if="isDev"
          class="mt-6 text-left text-xs bg-black/5 p-4 rounded-lg overflow-auto max-h-40"
        >
          <summary class="cursor-pointer text-gray-500 mb-2">Error Details</summary>
          <pre class="text-red-600 dark:text-red-400">{{ error }}</pre>
        </details>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
  import { ref, onErrorCaptured } from 'vue';
  import { useRouter } from 'vue-router';
  import { Warning } from '@element-plus/icons-vue';

  const error = ref<Error | null>(null);
  const router = useRouter();
  const isDev = import.meta.env.DEV;

  onErrorCaptured((err) => {
    console.error('ErrorBoundary captured error:', err);
    error.value = err as Error;
    return false;
  });

  const recover = () => {
    error.value = null;
  };

  const goHome = () => {
    error.value = null;
    router.push('/');
  };
</script>

<style scoped>
  .error-boundary-container {
    width: 100%;
  }
</style>
