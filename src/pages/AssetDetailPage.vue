<template>
  <div class="h-full">
    <AssetDetails :id="id" />
  </div>
</template>

<script setup lang="ts">
  import AssetDetails from '@/components/Inventory/AssetDetails.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const id = route.params.id as string;
</script>
