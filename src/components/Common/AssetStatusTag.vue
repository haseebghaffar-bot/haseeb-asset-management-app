<template>
  <el-tag
    :type="statusType"
    size="small"
    effect="dark"
    class="!rounded-md shadow-sm font-medium"
    :class="customClass"
  >
    {{ status }}
  </el-tag>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { getAssetStatusType } from '@/services/utils';

  const props = defineProps<{
    status: string;
    customClass?: string;
  }>();

  const statusType = computed(() => getAssetStatusType(props.status));
</script>
