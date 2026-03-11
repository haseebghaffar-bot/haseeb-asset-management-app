/// <reference types="vite/client" />
/// <reference types="vue/macros" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'element-plus';
declare module '@element-plus/icons-vue';

declare global {
  const defineProps: typeof import('vue').defineProps;
  const defineEmits: typeof import('vue').defineEmits;
  const defineExpose: typeof import('vue').defineExpose;
  const withDefaults: typeof import('vue').withDefaults;
}
