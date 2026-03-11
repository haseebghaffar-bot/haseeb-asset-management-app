<template>
  <el-card
    class="w-full h-full cursor-pointer hover:shadow-md transition-shadow dark:bg-[#0a0a0a] group relative group-focus-visible:ring-2 focus-within:ring-2 ring-gray-400 rounded-xl overflow-hidden flex flex-col"
    :body-style="{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column' }"
    @click="navigateToDetail"
    tabindex="0"
    role="button"
    :aria-label="`View details for ${asset.name}`"
  >
    <div
      class="h-48 w-full bg-gray-50 dark:bg-[#050505] relative border-b border-gray-100 dark:border-[#1a1a1a] flex-shrink-0"
    >
      <el-image
        v-if="asset.imageUrl"
        :src="asset.imageUrl"
        class="w-full h-full object-cover"
        loading="lazy"
        :alt="asset.name"
      >
        <template #placeholder>
          <div class="w-full h-full skeleton-bg animate-pulse bg-gray-200 dark:bg-[#1a1a1a]"></div>
        </template>
        <template #error>
          <div class="flex items-center justify-center w-full h-full text-gray-400">
            <el-icon :size="32"><PictureRounded /></el-icon>
          </div>
        </template>
      </el-image>
      <div v-else class="flex flex-col items-center justify-center w-full h-full text-gray-400">
        <el-icon :size="32" class="mb-2"><PictureRounded /></el-icon>
        <span class="text-xs">No Image</span>
      </div>
      <div class="absolute top-3 right-3 flex gap-2">
        <AssetStatusTag :status="asset.status" />
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col relative z-10 bg-white dark:bg-transparent">
      <div class="flex justify-between items-start mb-2 gap-4">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 m-0">
          {{ asset.name }}
        </h3>
      </div>

      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {{ asset.category }}
      </p>

      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 flex-1 min-h-[40px]">
        {{ asset.description || 'No description provided.' }}
      </p>
      <div
        class="mt-4 pt-3 border-t border-gray-100 dark:border-[#1a1a1a] flex justify-between items-end flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex flex-col gap-1">
          <span v-if="asset.purchasePrice" class="font-medium text-gray-900 dark:text-gray-200">
            {{ formatCurrency(asset.purchasePrice) }}
          </span>
          <span>Added {{ formatDate(asset.createdAt) }}</span>
        </div>

        <div
          class="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        >
          <el-button
            size="small"
            circle
            plain
            @click="navigateToEdit"
            title="Edit Asset"
            aria-label="Edit this asset"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import type { Asset } from '@/types';
  import { formatDate, formatCurrency } from '@/services/utils';
  import { PictureRounded, Edit } from '@element-plus/icons-vue';
  import AssetStatusTag from '@/components/Common/AssetStatusTag.vue';
  import { useImageCache } from '@/composables/useImageCache';
  import { watch, onMounted } from 'vue';

  const props = defineProps<{
    asset: Asset;
  }>();

  const router = useRouter();
  const { prefetchImage } = useImageCache();

  onMounted(() => {
    if (props.asset.imageUrl) {
      prefetchImage(props.asset.imageUrl);
    }
  });

  watch(
    () => props.asset.imageUrl,
    (newUrl) => {
      if (newUrl) prefetchImage(newUrl);
    }
  );

  const navigateToDetail = () => {
    router.push(`/assets/${props.asset.id}`);
  };

  const navigateToEdit = (e: Event) => {
    e.stopPropagation();
    router.push(`/assets/${props.asset.id}/edit`);
  };
</script>
