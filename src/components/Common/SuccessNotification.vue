<template>
  <span class="hidden"></span>
</template>

<script lang="ts">
  import { ElNotification } from 'element-plus';
  export const triggerSuccess = (title: string, message: string, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'success',
      duration,
      customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
    });
  };
  export const triggerWarning = (title: string, message: string, duration = 4000) => {
    ElNotification({
      title,
      message,
      type: 'warning',
      duration,
      customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
    });
  };
  export const triggerInfo = (title: string, message: string, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'info',
      duration,
      customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
    });
  };
  export const triggerError = (title: string, message: string, duration = 5000) => {
    ElNotification({
      title,
      message,
      type: 'error',
      duration,
      customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
    });
  };
</script>
