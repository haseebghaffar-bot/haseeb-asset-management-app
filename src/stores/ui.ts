import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { Theme } from '@/types';

export type ThemeStrategy = 'auto' | 'light' | 'dark';

export const useUIStore = defineStore('ui', () => {
  const themeStrategy = ref<ThemeStrategy>(
    (localStorage.getItem('theme-strategy') as ThemeStrategy) || 'auto'
  );
  const systemTheme = ref<Theme>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light
  );
  const isSidebarExpanded = ref(true);
  const activeNotifications = ref<{ id: string; message: string; type: string }[]>([]);
  const openModalStack = ref<string[]>([]);
  const globalLoadingState = ref(false);

  const currentTheme = computed(() => {
    if (themeStrategy.value === 'auto') return systemTheme.value;
    return themeStrategy.value === 'dark' ? Theme.Dark : Theme.Light;
  });

  const isDarkMode = computed(() => currentTheme.value === Theme.Dark);
  const hasOpenModals = computed(() => openModalStack.value.length > 0);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    systemTheme.value = e.matches ? Theme.Dark : Theme.Light;
  };
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  function setThemeStrategy(strategy: ThemeStrategy) {
    themeStrategy.value = strategy;
    localStorage.setItem('theme-strategy', strategy);
  }

  function applyTheme() {
    const isDark = isDarkMode.value;
    const root = document.documentElement;

    const updateDOM = () => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        updateDOM();
        return Promise.resolve();
      });
    } else {
      updateDOM();
    }
  }

  watch(
    [themeStrategy, systemTheme],
    () => {
      applyTheme();
    },
    { immediate: true }
  );

  function switchTheme(theme?: Theme) {
    if (theme) {
      setThemeStrategy(theme as ThemeStrategy);
    } else {
      setThemeStrategy(isDarkMode.value ? 'light' : 'dark');
    }
  }

  function toggleSidebarVisibility() {
    isSidebarExpanded.value = !isSidebarExpanded.value;
  }

  function displayNotification(
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    duration = 3000
  ) {
    const id = Date.now().toString();
    activeNotifications.value.push({ id, message, type });

    if (duration > 0) {
      setTimeout(() => dismissNotification(id), duration);
    }

    return id;
  }

  function dismissNotification(id: string) {
    activeNotifications.value = activeNotifications.value.filter((n) => n.id !== id);
  }

  function openModalById(modalId: string) {
    if (!openModalStack.value.includes(modalId)) {
      openModalStack.value.push(modalId);
    }
  }

  function closeModalById(modalId: string) {
    openModalStack.value = openModalStack.value.filter((id) => id !== modalId);
  }

  function setGlobalLoading(isLoading: boolean) {
    globalLoadingState.value = isLoading;
  }

  return {
    themeStrategy,
    isSidebarExpanded,
    activeNotifications,
    openModalStack,
    globalLoadingState,

    currentTheme,
    isDarkMode,
    hasOpenModals,

    setThemeStrategy,
    switchTheme,
    toggleSidebarVisibility,
    displayNotification,
    dismissNotification,
    openModalById,
    closeModalById,
    setGlobalLoading,
  };
});
