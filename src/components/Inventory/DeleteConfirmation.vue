<template>
  <ConfirmDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Delete Asset"
    type="danger"
    confirmText="Delete Asset"
    :requireDelay="true"
    @confirm="$emit('confirm')"
  >
    <div class="flex items-start gap-4">
      <div
        class="p-3 bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-500 rounded-full shrink-0"
      >
        <el-icon :size="24"><Warning /></el-icon>
      </div>
      <div>
        <p class="text-gray-700 dark:text-gray-300 font-medium mb-2 text-base">
          Are you sure you want to delete <span class="font-bold">"{{ assetName }}"</span>?
        </p>
      </div>
    </div>
  </ConfirmDialog>
</template>

<script setup lang="ts">
  import ConfirmDialog from '@/components/Common/ConfirmDialog.vue';
  import { Warning } from '@element-plus/icons-vue';

  defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    assetName: {
      type: String,
      required: true,
    },
  });

  defineEmits(['update:modelValue', 'confirm']);
</script>
