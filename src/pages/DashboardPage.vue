<template>
  <div class="max-w-7xl mx-auto px-1 sm:px-0 space-y-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, {{ authStore.userName || 'User' }}
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Manage and track your operational assets securely.
        </p>
      </div>

      <el-button
        type="primary"
        size="large"
        @click="$router.push('/assets/new')"
        class="!rounded-lg shadow-sm font-medium focus-visible:outline outline-gray-500"
      >
        <el-icon class="mr-2"><Plus /></el-icon> New Asset
      </el-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <el-card class="!rounded-xl shadow-sm dark:bg-[#0a0a0a]">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 rounded-lg">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assets</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ assetStore.totalAssetCount }}
            </p>
          </div>
        </div>
      </el-card>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Assets</h2>
        <router-link
          to="/assets"
          class="mt-4 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          View all assets &rarr;
        </router-link>
      </div>

      <div v-if="assetStore.isLoading && assetStore.assetsList.length === 0">
        <SkeletonLoader type="card" :count="4" />
      </div>
      <div v-else-if="assetStore.fetchError">
        <ErrorAlert
          title="Could not load assets"
          :message="assetStore.fetchError"
          showRetry
          @retry="assetStore.loadAssets(true)"
        />
      </div>
      <div v-else>
        <AssetList :limit="4" hide-filters />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useAssetStore } from '@/stores/assets';
  import { Plus, Document } from '@element-plus/icons-vue';
  import AssetList from '@/components/Inventory/AssetList.vue';
  import SkeletonLoader from '@/components/Skeletons/SkeletonLoader.vue';
  import ErrorAlert from '@/components/Common/ErrorAlert.vue';

  const authStore = useAuthStore();
  const assetStore = useAssetStore();

  onMounted(async () => {
    if (assetStore.assetsList.length === 0) {
      await assetStore.loadAssets();
    }
  });
</script>
