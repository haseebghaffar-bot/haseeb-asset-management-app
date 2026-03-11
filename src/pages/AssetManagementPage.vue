<template>
  <div class="max-w-7xl auto mx-auto space-y-6 flex flex-col h-full">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Asset Management
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Search, filter, and organize your organization's entire inventory.
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
    <div class="flex-1 min-h-0 bg-transparent rounded-xl">
      <AssetList :hide-filters="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AssetList from '@/components/Inventory/AssetList.vue';
  import { Plus } from '@element-plus/icons-vue';
</script>
