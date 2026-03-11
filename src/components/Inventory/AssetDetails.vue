<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-12">
    <AssetDetailsSkeleton v-if="assetStore.isLoading && !asset" />

    <div v-else-if="assetStore.fetchError">
      <ErrorAlert
        title="Error Loading Asset"
        :message="assetStore.fetchError"
        showRetry
        @retry="assetStore.loadAssetById(id)"
      />
      <el-button class="mt-4" @click="goBack">Return to Assets</el-button>
    </div>

    <template v-else-if="asset">
      <PageHeader
        class="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-200 dark:border-transparent shadow-sm"
        :title="asset.name"
        :subtitle="asset.category"
        show-back
        @back="goBack"
      >
        <template #actions>
          <div class="flex items-center gap-3">
            <AssetStatusTag :status="asset.status" class="!bg-gray-500 !border-gray-500" />
            <div class="h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
            <el-button
              @click="handleEdit"
              class="!rounded-lg !border-gray-200 !text-gray-700 hover:!bg-gray-50 dark:!border-[#1a1a1a] dark:!text-gray-300 dark:!bg-transparent dark:hover:!bg-[#1a1a1a] transition-colors"
            >
              <el-icon class="mr-1"><Edit /></el-icon> Edit
            </el-button>
            <el-button
              @click="showDeleteConfirm = true"
              class="!rounded-lg !border-gray-200 !text-gray-400 hover:!bg-gray-50 hover:!text-gray-600 dark:!border-[#1a1a1a] dark:!text-gray-500 dark:!bg-transparent dark:hover:!bg-[#1a1a1a] dark:hover:!text-white transition-colors"
            >
              <el-icon class="mr-1"><Delete /></el-icon> Delete
            </el-button>
          </div>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="col-span-1 lg:col-span-2 space-y-6">
          <el-card
            class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] dark:border-transparent overflow-hidden"
            :body-style="{ padding: '0px' }"
          >
            <div
              class="relative w-full aspect-video bg-gray-100 dark:bg-[#050505] flex items-center justify-center border-b border-gray-200 dark:border-[#1a1a1a] overflow-hidden"
            >
              <el-image
                v-if="asset.imageUrl"
                :src="asset.imageUrl"
                class="w-full h-full object-contain object-center"
                fit="contain"
                :preview-src-list="[asset.imageUrl]"
              >
                <template #placeholder>
                  <div
                    class="w-full h-full skeleton-bg animate-pulse bg-gray-200 dark:bg-[#1a1a1a]"
                  ></div>
                </template>
                <template #error>
                  <div
                    class="flex items-center justify-center w-full h-full text-gray-400 flex-col gap-2"
                  >
                    <el-icon :size="48"><PictureRounded /></el-icon>
                    <span class="text-sm font-medium">Failed to load image</span>
                  </div>
                </template>
              </el-image>
              <div v-else class="flex flex-col items-center justify-center text-gray-400">
                <el-icon :size="64" class="mb-4 text-gray-300 dark:text-gray-600"
                  ><PictureRounded
                /></el-icon>
                <span class="text-lg font-medium">No Image Provided</span>
              </div>
            </div>

            <div class="p-6">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3"
              >
                <el-icon class="text-gray-500"><InfoFilled /></el-icon> Description
              </h3>
              <p
                class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed {{ !asset.description ? 'italic text-gray-400' : '' }}"
              >
                {{ asset.description || 'No description available for this asset.' }}
              </p>
            </div>
          </el-card>

          <el-card
            v-if="asset.notes"
            class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] dark:border-transparent"
          >
            <h3
              class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3"
            >
              <el-icon class="text-gray-500"><Memo /></el-icon> Internal Notes
            </h3>
            <p
              class="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#050505] p-4 rounded-lg border border-gray-100 dark:border-[#1a1a1a]"
            >
              {{ asset.notes }}
            </p>
          </el-card>
        </div>

        <div class="col-span-1 space-y-6">
          <el-card
            class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] dark:border-transparent details-card"
          >
            <template #header>
              <div
                class="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100"
              >
                <el-icon class="text-gray-500"><Box /></el-icon> Specifications
              </div>
            </template>

            <el-descriptions
              :column="1"
              class="asset-specs"
              :class="{ 'dark-desc': uiStore.isDarkMode }"
            >
              <el-descriptions-item label="Serial Number" label-align="left" align="left">
                <div class="font-mono text-gray-800 dark:text-gray-300 text-sm w-full truncate">
                  {{ asset.serialNumber || 'N/A' }}
                </div>
              </el-descriptions-item>

              <el-descriptions-item label="Location" label-align="left" align="left">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <el-icon v-if="asset.location"><Location /></el-icon>
                  {{ asset.location || 'Unassigned' }}
                </div>
              </el-descriptions-item>

              <el-descriptions-item label="Condition" label-align="left" align="left">
                <el-tag
                  v-if="asset.condition"
                  type="info"
                  effect="plain"
                  class="!border-gray-300 dark:!border-gray-600 dark:text-gray-300 font-medium"
                >
                  {{ asset.condition }}
                </el-tag>
                <span v-else class="text-gray-400 italic">Unknown</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] dark:border-transparent">
            <template #header>
              <div
                class="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100"
              >
                <el-icon class="text-gray-500"><PriceTag /></el-icon> Purchase Info
              </div>
            </template>

            <el-descriptions
              :column="1"
              class="asset-specs"
              :class="{ 'dark-desc': uiStore.isDarkMode }"
            >
              <el-descriptions-item label="Purchase Price" label-align="left" align="left">
                <span class="font-bold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(asset.purchasePrice) }}
                </span>
              </el-descriptions-item>

              <el-descriptions-item label="Purchase Date" label-align="left" align="left">
                <span class="text-gray-800 dark:text-gray-200">
                  {{ formatDate(asset.purchaseDate) }}
                </span>
              </el-descriptions-item>

              <el-descriptions-item label="Added On" label-align="left" align="left">
                <span class="text-gray-700 dark:text-gray-300">
                  {{ formatDate(asset.createdAt, true) }}
                </span>
              </el-descriptions-item>

              <el-descriptions-item label="Last Updated" label-align="left" align="left">
                <span class="text-gray-700 dark:text-gray-300">
                  {{ formatDate(asset.updatedAt, true) }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </div>
    </template>

    <DeleteConfirmation
      v-model="showDeleteConfirm"
      :assetName="asset?.name || 'this asset'"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAssetStore } from '@/stores/assets';
  import { useUIStore } from '@/stores/ui';
  import { formatDate, formatCurrency } from '@/services/utils';
  import DeleteConfirmation from '@/components/Inventory/DeleteConfirmation.vue';
  import { assetsApi } from '@/api/assets.api';
  import { triggerSuccess, triggerError } from '@/components/Common/SuccessNotification';
  import ErrorAlert from '@/components/Common/ErrorAlert.vue';
  import { useImageCache } from '@/composables/useImageCache';
  import {
    Edit,
    Delete,
    PictureRounded,
    PriceTag,
    Box,
    Location,
    InfoFilled,
  } from '@element-plus/icons-vue';
  import PageHeader from '@/components/Common/PageHeader.vue';
  import AssetStatusTag from '@/components/Common/AssetStatusTag.vue';
  import AssetDetailsSkeleton from '@/components/Skeletons/AssetDetailsSkeleton.vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });

  const router = useRouter();
  const assetStore = useAssetStore();
  const uiStore = useUIStore();

  const showDeleteConfirm = ref(false);
  const isDeleting = ref(false);
  const { prefetchImage } = useImageCache();

  const asset = computed(() => assetStore.selectedAsset);

  const goBack = () => router.push('/assets');

  const handleEdit = () => {
    router.push(`/assets/${props.id}/edit`);
  };

  const executeDelete = async () => {
    isDeleting.value = true;
    try {
      await assetsApi.deleteAsset(props.id);
      triggerSuccess('Asset Deleted', 'The asset was successfully removed.');
      router.push('/assets');
    } catch (error: any) {
      triggerError('Delete Failed', error.message || 'Could not delete the asset.');
    } finally {
      isDeleting.value = false;
      showDeleteConfirm.value = false;
    }
  };

  onMounted(async () => {
    if (props.id) {
      await assetStore.loadAssetById(props.id);
      if (assetStore.selectedAsset?.imageUrl) {
        prefetchImage(assetStore.selectedAsset.imageUrl);
      }
    }
  });
</script>

<style scoped>
  :deep(.el-descriptions__label) {
    font-weight: 600;
    color: var(--text-secondary);
  }
</style>
