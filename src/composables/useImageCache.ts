import { ref, readonly } from 'vue';

const globalImageCache = ref<Map<string, HTMLImageElement>>(new Map());

export function useImageCache() {
  const prefetchImage = (url: string | null | undefined) => {
    if (!url) return;

    if (globalImageCache.value.has(url)) return;
    const img = new Image();
    img.onload = () => {
      globalImageCache.value.set(url, img);
    };

    img.src = url;
  };

  const isCached = (url: string) => {
    return globalImageCache.value.has(url);
  };

  return {
    prefetchImage,
    isCached,
    cache: readonly(globalImageCache),
  };
}
