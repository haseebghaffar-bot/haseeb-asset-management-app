<template>
  <header
    class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative z-20 shadow-sm"
  >
    <div class="flex items-center gap-4">
      <el-button
        text
        @click="toggleSidebar"
        class="!p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Toggle Navigation Sidebar"
      >
        <el-icon :size="20"><Expand v-if="!isSidebarOpen" /><Fold v-else /></el-icon>
      </el-button>

      <div class="flex items-center gap-2 select-none cursor-pointer" @click="router.push('/')">
        <div
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-2 sm:mr-3 shadow-inner border border-gray-800"
        >
          H
        </div>
        <span
          class="font-semibold text-lg sm:text-xl text-gray-800 dark:text-gray-100 hidden sm:inline-block"
        >
          AssetManager
        </span>
      </div>
    </div>

    <div class="flex items-center gap-3 md:gap-6">
      <el-button
        circle
        @click="toggleTheme"
        class="!border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700"
        :aria-label="isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'"
      >
        <el-icon :size="18">
          <Moon v-if="!isDarkMode" class="text-gray-600" />
          <Sunny v-else class="text-gray-300" />
        </el-icon>
      </el-button>

      <div v-if="authStore.isAuthenticated" class="flex items-center">
        <el-dropdown trigger="click">
          <span
            class="flex items-center gap-2 cursor-pointer outline-none hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors"
          >
            <el-avatar
              :size="32"
              :src="authStore.userAvatar"
              class="cursor-pointer border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200"
            >
              {{ userName.charAt(0).toUpperCase() }}
            </el-avatar>
            <span
              class="text-xs font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[100px] truncate"
            >
              {{ userName }}
            </span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ userName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate w-40">
                  {{ authStore.userEmail }}
                </p>
              </div>

              <el-dropdown-item @click="router.push('/profile')">
                <el-icon><User /></el-icon> My Profile
              </el-dropdown-item>
              <el-dropdown-item
                divided
                @click="handleLogout"
                class="text-gray-600 dark:text-gray-400"
              >
                <el-icon><SwitchButton /></el-icon> Sign Out
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useUIStore } from '@/stores/ui';
  import { Sunny, Moon, Expand, Fold, User, SwitchButton } from '@element-plus/icons-vue';

  const router = useRouter();
  const authStore = useAuthStore();

  const uiStore = useUIStore();

  const isDarkMode = computed(() => uiStore.isDarkMode);
  const isSidebarOpen = computed(() => uiStore.isSidebarExpanded);
  const userName = computed(() => authStore.userName || authStore.userEmail || 'User');

  const toggleTheme = () => {
    uiStore.switchTheme();
  };
  const toggleSidebar = () => {
    uiStore.toggleSidebarVisibility();
  };
  const handleLogout = async () => {
    await authStore.handleSignOut();
    router.push('/login');
  };
</script>
