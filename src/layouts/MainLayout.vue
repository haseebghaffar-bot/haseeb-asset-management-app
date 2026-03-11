<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-black overflow-hidden"
    @click="handleUserActivity"
    @keydown="handleUserActivity"
  >
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main
        class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-black"
        id="main-content"
        tabindex="-1"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import Header from '@/components/Layout/Header.vue';
  import Sidebar from '@/components/Layout/Sidebar.vue';

  const authStore = useAuthStore();

  const handleUserActivity = () => {
    if (authStore.isAuthenticated) {
      authStore.refreshSession();
    }
  };

  onMounted(() => {
    if (authStore.isAuthenticated) {
      authStore.refreshSession();
    }
  });
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(5px);
  }
</style>
