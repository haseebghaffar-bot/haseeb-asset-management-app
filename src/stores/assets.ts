import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { assetsApi } from '@/api/assets.api';
import { storageApi } from '@/api/storage.api';
import type { Asset, AssetFilter, PaginationInfo } from '@/types';

export const useAssetStore = defineStore('assets', () => {
  const assetsList = ref<Asset[]>([]);
  const selectedAsset = ref<Asset | null>(null);
  const isLoading = ref(false);
  const fetchError = ref<string | null>(null);
  const activeFilters = ref<AssetFilter>({
    searchQuery: '',
    category: undefined,
    status: undefined,
  });
  const sortOrder = ref<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc',
  });
  const paginationInfo = ref<PaginationInfo>({
    limit: 12,
    nextToken: null,
  });

  const isSearchActive = computed(() => {
    return (
      !!activeFilters.value.searchQuery ||
      !!activeFilters.value.category ||
      !!activeFilters.value.status
    );
  });

  const canLoadMoreAssets = computed(() => !!paginationInfo.value.nextToken);

  const totalAssetCount = computed(() => {
    return paginationInfo.value.total ?? assetsList.value.length;
  });

  const filteredAssetList = computed(() => {
    let filtered = [...assetsList.value];

    if (activeFilters.value.searchQuery) {
      const query = activeFilters.value.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) => a.name.toLowerCase().includes(query) || a.description?.toLowerCase().includes(query)
      );
    }

    if (activeFilters.value.category) {
      filtered = filtered.filter((a) => a.category === activeFilters.value.category);
    }

    if (activeFilters.value.status) {
      filtered = filtered.filter((a) => a.status === activeFilters.value.status);
    }

    const { field, direction } = sortOrder.value;
    filtered.sort((a, b) => {
      const valA = (a as any)[field];
      const valB = (b as any)[field];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  });

  function applyFilters(filters: Partial<AssetFilter>) {
    activeFilters.value = { ...activeFilters.value, ...filters };
  }

  function changeSortOrder(field: string, direction: 'asc' | 'desc') {
    sortOrder.value = { field, direction };
  }

  async function ensureAssetImageUrls(assets: Asset[]) {
    const promises = assets
      .filter((a) => a.imageName && !a.imageUrl)
      .map(async (a) => {
        try {
          a.imageUrl = await storageApi.getSignedImageUrl(a.imageName!);
        } catch (err) {
          console.warn(`Failed to get signed URL for asset ${a.id}`, err);
        }
      });
    await Promise.all(promises);
  }

  async function loadAssets(isReset = true) {
    isLoading.value = true;
    fetchError.value = null;
    try {
      const data = await assetsApi.listAssets({
        limit: paginationInfo.value.limit,
        nextToken: isReset ? null : paginationInfo.value.nextToken,
        filter: buildApiFilter(),
      });

      const newAssets = data.items;
      await ensureAssetImageUrls(newAssets);

      if (isReset) {
        assetsList.value = newAssets;
      } else {
        assetsList.value.push(...newAssets);
      }
      paginationInfo.value.nextToken = data.nextToken;
    } catch (error: any) {
      fetchError.value = error.message || 'Failed to load assets';
    } finally {
      isLoading.value = false;
    }
  }

  async function resolveAssetImageUrl(data: Asset) {
    if (data.imageName && !data.imageUrl) {
      try {
        data.imageUrl = await storageApi.getSignedImageUrl(data.imageName);
      } catch (err) {
        console.warn(`Failed to get signed URL for asset ${data.id}`, err);
      }
    }
  }

  async function loadAssetById(id: string) {
    isLoading.value = true;
    fetchError.value = null;
    try {
      const data = await assetsApi.getAsset(id);
      await resolveAssetImageUrl(data);
      selectedAsset.value = data;
    } catch (error: any) {
      fetchError.value = error.message || 'Failed to load asset details';
      console.error('Failed to load asset:', error);
    } finally {
      isLoading.value = false;
    }
  }

  function removeAsset(id: string) {
    const idx = assetsList.value.findIndex((a) => a.id === id);
    if (idx !== -1) assetsList.value.splice(idx, 1);
    if (selectedAsset.value?.id === id) selectedAsset.value = null;
  }

  function clearStore() {
    assetsList.value = [];
    selectedAsset.value = null;
    isLoading.value = false;
    fetchError.value = null;
    activeFilters.value = {
      searchQuery: '',
      category: undefined,
      status: undefined,
    };
    paginationInfo.value = {
      limit: 12,
      nextToken: null,
    };
  }

  function buildApiFilter() {
    const filter: any = {};
    if (activeFilters.value.category) {
      filter.category = { eq: activeFilters.value.category };
    }
    if (activeFilters.value.status) {
      filter.status = { eq: activeFilters.value.status };
    }
    if (activeFilters.value.searchQuery) {
      filter.or = [
        { name: { contains: activeFilters.value.searchQuery } },
        { description: { contains: activeFilters.value.searchQuery } },
      ];
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }

  return {
    assetsList,
    selectedAsset,
    isLoading,
    fetchError,
    activeFilters,
    sortOrder,
    paginationInfo,

    isSearchActive,
    canLoadMoreAssets,
    totalAssetCount,
    filteredAssetList,

    applyFilters,
    changeSortOrder,
    loadAssets,
    loadAssetById,
    removeAsset,
    clearStore,
  };
});
