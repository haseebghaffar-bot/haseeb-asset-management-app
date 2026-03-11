<template>
  <div class="asset-management-table space-y-4">
    <div
      class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#1a1a1a]"
    >
      <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <el-icon class="text-gray-500"><List /></el-icon>
        Quick Asset Management
      </h3>
      <el-button
        link
        @click="loadData"
        :loading="assetStore.isLoading"
        :icon="Refresh"
        class="!text-gray-500 dark:!text-[#a1a1a1] hover:!text-gray-900 dark:hover:!text-white transition-colors"
      >
        Refresh
      </el-button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-transparent">
      <el-table
        v-loading="assetStore.isLoading"
        :data="assetStore.assetsList"
        style="width: 100%"
        class="dark:bg-[#0a0a0a] custom-table"
        :header-cell-style="{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }"
      >
        <el-table-column prop="name" label="Asset Name" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar
                :size="32"
                :src="row.imageUrl"
                shape="square"
                class="bg-gray-100 dark:bg-[#1a1a1a] !rounded-md"
              >
                <el-icon><Picture /></el-icon>
              </el-avatar>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Category" width="160">
          <template #default="{ row }">
            <el-select
              v-model="row.category"
              size="small"
              @change="handleCategoryChange(row, $event as any)"
              class="status-select"
            >
              <el-option v-for="cat in CATEGORY_OPTIONS" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Status" width="160">
          <template #default="{ row }">
            <el-select
              v-model="row.status"
              size="small"
              @change="handleStatusChange(row, $event)"
              class="status-select"
            >
              <el-option v-for="st in STATUS_OPTIONS" :key="st" :label="st" :value="st" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" align="right">
          <template #default="{ row }">
            <div class="flex justify-end gap-1">
              <el-button
                circle
                size="small"
                @click="handleEdit(row)"
                aria-label="Edit asset"
                class="!text-gray-500 hover:!text-gray-700 dark:!text-gray-400 dark:hover:!text-white dark:!bg-transparent dark:hover:!bg-[#1a1a1a] dark:!border-[#333] transition-colors"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                circle
                size="small"
                @click="handleDelete(row)"
                aria-label="Delete asset"
                class="!text-gray-400 hover:!text-gray-600 hover:!bg-gray-100 dark:!text-gray-500 dark:hover:!text-white dark:!bg-transparent dark:hover:!bg-[#1a1a1a] dark:!border-[#333] transition-colors"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <DeleteConfirmation
      v-model="showDeleteConfirm"
      :asset-name="selectedAsset?.name || ''"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAssetStore } from '@/stores/assets';
  import { assetsApi } from '@/api/assets.api';
  import { AssetStatus, AssetCategory } from '@/types';
  import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/services/constants';
  import { List, Refresh, Picture, Edit, Delete } from '@element-plus/icons-vue';
  import { triggerSuccess, triggerError } from '@/services/utils';
  import DeleteConfirmation from '@/components/Inventory/DeleteConfirmation.vue';

  const assetStore = useAssetStore();
  const router = useRouter();

  const showDeleteConfirm = ref(false);
  const selectedAsset = ref<any>(null);

  const loadData = async () => {
    try {
      await assetStore.loadAssets();
    } catch (_err) {
      triggerError('Error', 'Failed to load assets for management table');
    }
  };

  const handleStatusChange = async (asset: any, newStatus: AssetStatus) => {
    try {
      await assetsApi.updateAsset({
        id: asset.id,
        status: newStatus,
      });
      if (assetStore.selectedAsset?.id === asset.id && assetStore.selectedAsset) {
        assetStore.selectedAsset = { ...assetStore.selectedAsset, status: newStatus };
      }
      triggerSuccess('Updated', `Status of ${asset.name} changed to ${newStatus}`);
    } catch (_err) {
      triggerError('Error', 'Failed to update asset status');
      loadData();
    }
  };

  const handleCategoryChange = async (asset: any, newCategory: AssetCategory) => {
    try {
      await assetsApi.updateAsset({
        id: asset.id,
        category: newCategory,
      });
      if (assetStore.selectedAsset?.id === asset.id && assetStore.selectedAsset) {
        assetStore.selectedAsset = { ...assetStore.selectedAsset, category: newCategory };
      }
      triggerSuccess('Updated', `Category of ${asset.name} changed to ${newCategory}`);
    } catch (_err) {
      triggerError('Error', 'Failed to update asset category');
      loadData();
    }
  };

  const handleEdit = (asset: any) => {
    router.push(`/assets/${asset.id}/edit`);
  };

  const handleDelete = (asset: any) => {
    selectedAsset.value = asset;
    showDeleteConfirm.value = true;
  };

  const confirmDelete = async () => {
    if (!selectedAsset.value) return;

    try {
      await assetsApi.deleteAsset(selectedAsset.value.id);
      triggerSuccess('Deleted', 'Asset removed successfully');
      loadData();
    } catch (_err) {
      triggerError('Delete Failed', 'Could not delete asset');
    } finally {
      showDeleteConfirm.value = false;
      selectedAsset.value = null;
    }
  };

  onMounted(() => {
    loadData();
  });
</script>

<style scoped>
  .custom-table {
    --el-table-border-color: var(--border-color);
    --el-table-header-bg-color: var(--bg-secondary);
  }

  :deep(.status-select .el-input__wrapper) {
    box-shadow: none !important;
    background: transparent !important;
    padding-left: 0;
  }

  :deep(.status-select .el-input__wrapper:hover) {
    background: var(--bg-hover) !important;
  }

  .dark .custom-table {
    background-color: transparent;
  }

  :deep(.el-table__body-wrapper) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  :deep(.el-table__body-wrapper::-webkit-scrollbar) {
    display: none;
  }
</style>
