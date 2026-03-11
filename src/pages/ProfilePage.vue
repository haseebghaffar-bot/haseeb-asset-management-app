<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div
      class="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm dark:border-transparent overflow-hidden border border-gray-200"
    >
      <div class="h-32 bg-[#050505] relative border-b border-gray-800/50">
        <div class="absolute -bottom-16 left-8">
          <el-avatar
            :size="100"
            class="border-4 border-white dark:border-black shadow-lg bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 font-bold text-3xl"
          >
            <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="Avatar" />
            <span v-else>{{ authStore.userName.charAt(0).toUpperCase() }}</span>
          </el-avatar>
        </div>
      </div>

      <div class="pt-20 pb-8 px-4 sm:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ authStore.userName }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">{{ authStore.userEmail }}</p>
          </div>
          <el-button
            @click="router.push('/profile/edit')"
            class="!rounded-lg !border-gray-200 !text-gray-700 hover:!bg-gray-50 dark:!border-[#1a1a1a] dark:!text-gray-300 dark:!bg-transparent dark:hover:!bg-[#1a1a1a] transition-colors"
          >
            Edit Profile
          </el-button>
        </div>

        <el-divider />

        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Account Information
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div class="flex flex-col gap-1 py-2 border-b border-gray-50 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >User ID</span
                >
                <span class="text-gray-900 dark:text-gray-100 font-medium break-all">{{
                  authStore.currentUser?.userId
                }}</span>
              </div>
              <div class="flex flex-col gap-1 py-2 border-b border-gray-50 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >Account Status</span
                >
                <div>
                  <el-tag
                    size="small"
                    type="info"
                    effect="plain"
                    class="!px-3 !bg-gray-50 !border-gray-200 !text-gray-600"
                    >Active</el-tag
                  >
                </div>
              </div>
              <div class="flex flex-col gap-1 py-2 border-b border-gray-50 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >Department</span
                >
                <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                  authStore.userProfile?.department || 'Not set'
                }}</span>
              </div>
              <div class="flex flex-col gap-1 py-2 border-b border-gray-50 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >Company</span
                >
                <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                  authStore.userProfile?.company || 'Not set'
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  const router = useRouter();
  const authStore = useAuthStore();
</script>
