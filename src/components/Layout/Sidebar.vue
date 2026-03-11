<template>
  <aside
    :class="[
      'h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-y-auto z-10 hidden sm:block',
      isExpanded ? 'w-64' : 'w-[70px]',
    ]"
    role="navigation"
    aria-label="Main Navigation"
  >
    <el-menu
      :default-active="activeMenu"
      class="border-r-0 !bg-transparent pt-4"
      :collapse="!isExpanded"
      router
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
        class="mb-1 rounded-lg mx-2 flex items-center justify-start transition-all duration-200"
        :class="[
          activeMenu === item.path
            ? '!text-gray-900 !bg-gray-100 dark:!text-white dark:!bg-white/10'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5',
        ]"
      >
        <el-icon class="!text-current sidebar-icon -left-1"><component :is="item.icon" /></el-icon>
        <template #title>
          <span class="font-medium ml-3">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </aside>

  <div
    v-if="isExpanded"
    class="sm:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity"
    @click="uiStore.toggleSidebarVisibility()"
  ></div>
  <aside
    class="sm:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a0a0a] shadow-xl border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 transform"
    :class="isExpanded ? 'translate-x-0' : '-translate-x-full'"
    role="navigation"
    aria-label="Mobile Navigation"
  >
    <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
      <div
        class="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold text-xl mr-3 border border-gray-800"
      >
        H
      </div>
      <span class="font-semibold text-xl text-gray-800 dark:text-gray-100"> AssetManager </span>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="border-r-0 !bg-transparent pt-4 px-2"
      router
      @select="uiStore.toggleSidebarVisibility()"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
        class="mb-1 rounded-lg mx-2 flex items-center justify-start transition-all duration-200"
        :class="[
          activeMenu === item.path
            ? '!text-gray-900 !bg-gray-100 dark:!text-white dark:!bg-white/10'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5',
        ]"
      >
        <el-icon class="!text-current"><component :is="item.icon" /></el-icon>
        <template #title>
          <span class="font-medium ml-3">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUIStore } from '@/stores/ui';
  import { Document, Connection, Setting } from '@element-plus/icons-vue';

  const route = useRoute();
  const uiStore = useUIStore();

  const menuItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: Document,
    },
    {
      path: '/assets',
      name: 'Assets',
      icon: Connection,
    },

    {
      path: '/settings',
      name: 'Settings',
      icon: Setting,
    },
  ];

  const isExpanded = computed(() => uiStore.isSidebarExpanded);
  const activeMenu = computed(() => route.path);
</script>

<style>
  .el-popper__arrow,
  .el-popper__arrow::before,
  .el-menu--collapse + .el-popper .el-popper__arrow,
  .el-tooltip__popper .el-popper__arrow {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }

  .dark .el-popper.is-dark,
  .dark .el-tooltip__popper.is-dark {
    background: #111111 !important;
    color: #ffffff !important;
    border: 1px solid #333333 !important;
  }

  .dark .el-popper.is-dark .el-menu-item,
  .dark .el-tooltip__popper.is-dark .el-menu-item {
    color: #ffffff !important;
  }

  .dark .el-popper.is-dark {
    color: #ffffff !important;
  }
</style>

<style scoped>
  .el-menu-item {
    transition: all 0.2s ease;
    height: 44px !important;
    line-height: 44px !important;
  }

  :deep(.el-menu--collapse) {
    width: 70px !important;
  }

  :deep(.el-menu--collapse .el-menu-item) {
    padding: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-left: 10px !important;
    margin-right: 10px !important;
  }

  :deep(.el-menu--collapse .el-menu-item .el-icon) {
    margin: 0 !important;
    font-size: 20px;
    width: auto !important;
    visibility: visible !important;
  }

  .dark :deep(.el-menu) {
    background-color: transparent !important;
    border-right: none !important;
  }
</style>
