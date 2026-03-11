<template>
  <el-config-provider :locale="en">
    <div
      class="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans antialiased"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <ErrorBoundary>
            <component :is="Component" />
          </ErrorBoundary>
        </transition>
      </router-view>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
  import { computed, watch, onMounted } from 'vue';
  import { useUIStore } from '@/stores/ui';
  import { useAuthStore } from '@/stores/auth';
  import { useAssetStore } from '@/stores/assets';
  import { useImageCache } from '@/composables/useImageCache';
  import { ElConfigProvider } from 'element-plus';
  import en from 'element-plus/es/locale/lang/en';
  import ErrorBoundary from '@/components/Common/ErrorBoundary.vue';

  const uiStore = useUIStore();
  const authStore = useAuthStore();
  const assetStore = useAssetStore();
  const { prefetchImage } = useImageCache();

  const isDark = computed(() => uiStore.isDarkMode);

  watch(
    () => authStore.userAvatar,
    (newAvatar) => {
      if (newAvatar) prefetchImage(newAvatar);
    }
  );

  watch(
    () => assetStore.assetsList,
    (newList) => {
      if (newList && newList.length > 0) {
        newList.slice(0, 4).forEach((asset: any) => {
          if (asset.imageUrl) prefetchImage(asset.imageUrl);
        });
      }
    },
    { immediate: true }
  );

  watch(isDark, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  onMounted(() => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    authStore.loadCurrentUser().then(() => {
      if (authStore.userAvatar) {
        prefetchImage(authStore.userAvatar);
      }
    });
  });
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
