<template>
  <div class="space-y-6">
    <div
      v-if="!hideFilters"
      class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-transparent shadow-sm"
    >
      <div class="w-full lg:w-96 flex-shrink-0">
        <el-input
          :model-value="assetStore.activeFilters.searchQuery"
          @update:model-value="handleSearch"
          placeholder="Search assets by name or description..."
          :prefix-icon="Search"
          clearable
          class="!rounded-lg w-full"
          aria-label="Search Assets"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
        <el-select
          :model-value="assetStore.activeFilters.category"
          @update:model-value="handleCategoryChange"
          placeholder="Category"
          clearable
          class="!rounded-lg w-full"
          aria-label="Filter by Category"
        >
          <template #prefix
            ><el-icon><Filter /></el-icon
          ></template>
          <el-option v-for="cat in CATEGORY_OPTIONS" :key="cat" :label="cat" :value="cat" />
        </el-select>

        <el-select
          :model-value="assetStore.activeFilters.status"
          @update:model-value="
            (val: AssetStatus | string | undefined) =>
              assetStore.applyFilters({ status: (val as AssetStatus) || undefined })
          "
          placeholder="Status"
          clearable
          class="!rounded-lg w-full"
          aria-label="Filter by Status"
        >
          <el-option v-for="st in STATUS_OPTIONS" :key="st" :label="st" :value="st" />
        </el-select>

        <Menu as="div" class="relative inline-block text-left w-full h-full">
          <div>
            <MenuButton
              class="inline-flex w-full justify-between items-center !rounded-lg border border-[#dcdfe6] dark:border-[#4c4d4f] bg-white dark:bg-[#141414] px-[11px] h-[32px] text-sm text-[#606266] dark:text-[#cfd3dc] hover:border-[#c0c4cc] dark:hover:border-[#5e5e5f] focus:outline-none focus:border-[#409eff] dark:focus:border-[#409eff] transition-colors font-normal shadow-sm"
            >
              <div class="flex items-center gap-2 min-w-0">
                <el-icon class="text-[#a8abb2] dark:text-[#a3a6ad] shrink-0"><Sort /></el-icon>
                <span class="truncate whitespace-nowrap">
                  {{
                    assetStore.sortOrder.field === 'createdAt' &&
                    assetStore.sortOrder.direction === 'desc'
                      ? 'Newest First'
                      : assetStore.sortOrder.field === 'createdAt' &&
                          assetStore.sortOrder.direction === 'asc'
                        ? 'Oldest First'
                        : assetStore.sortOrder.field === 'name' &&
                            assetStore.sortOrder.direction === 'asc'
                          ? 'Name (A-Z)'
                          : assetStore.sortOrder.field === 'name' &&
                              assetStore.sortOrder.direction === 'desc'
                            ? 'Name (Z-A)'
                            : assetStore.sortOrder.field === 'updatedAt' &&
                                assetStore.sortOrder.direction === 'desc'
                              ? 'Recently Updated'
                              : 'Sort By'
                  }}
                </span>
              </div>
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                    @click="handleContentSort('createdAt-desc')"
                  >
                    Newest First
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                    @click="handleContentSort('createdAt-asc')"
                  >
                    Oldest First
                  </button>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                    @click="handleContentSort('name-asc')"
                  >
                    Name (A-Z)
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                    @click="handleContentSort('name-desc')"
                  >
                    Name (Z-A)
                  </button>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                    @click="handleContentSort('updatedAt-desc')"
                  >
                    Recently Updated
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <div
      v-if="assetStore.filteredAssetList.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AssetCard
        v-for="asset in props.limit
          ? assetStore.filteredAssetList.slice(0, props.limit)
          : assetStore.filteredAssetList"
        :key="asset.id"
        :asset="asset"
      />
    </div>

    <div v-else-if="!assetStore.isLoading">
      <EmptyState
        :title="assetStore.isSearchActive ? 'No matches found' : 'No assets found'"
        :description="
          assetStore.isSearchActive
            ? 'Try adjusting your search or filters.'
            : 'You haven\'t added any assets yet.'
        "
        :icon="assetStore.isSearchActive ? 'search' : 'box'"
        :actionText="!assetStore.isSearchActive ? 'Create First Asset' : ''"
        @action="!assetStore.isSearchActive ? router.push('/assets/new') : null"
      />
    </div>

    <div v-if="!hideFilters && assetStore.canLoadMoreAssets" class="flex justify-center mt-8 pt-4">
      <el-button
        type="primary"
        plain
        @click="assetStore.loadAssets(false)"
        :loading="assetStore.isLoading"
        class="focus-visible:outline"
      >
        Load More Assets
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAssetStore } from '@/stores/assets';
  import { Search, Filter, Sort } from '@element-plus/icons-vue';
  import AssetCard from '@/components/Inventory/AssetCard.vue';
  import EmptyState from '@/components/Common/EmptyState.vue';
  import { AssetCategory, AssetStatus } from '@/types';
  import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/services/constants';
  import { useRouter } from 'vue-router';
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

  const props = defineProps({
    limit: {
      type: Number,
      required: false,
    },
    hideFilters: {
      type: Boolean,
      default: false,
    },
  });

  const router = useRouter();
  const assetStore = useAssetStore();

  const handleSearch = (value: string | number | undefined) => {
    assetStore.applyFilters({
      searchQuery: value ? String(value) : '',
    });
  };
  const handleCategoryChange = (val: AssetCategory | string | undefined) => {
    assetStore.applyFilters({
      category: (val as AssetCategory) || undefined,
    });
  };

  const handleContentSort = (val: string | undefined) => {
    if (!val) return;
    const [field, direction] = val.split('-');
    if (!field || !direction) return;
    assetStore.changeSortOrder(field, direction as 'asc' | 'desc');
  };

  onMounted(() => {
    if (!props.hideFilters) {
      assetStore.applyFilters({
        category: undefined,
        status: undefined,
        searchQuery: '',
      });
      assetStore.loadAssets(true);
    }
  });
</script>
