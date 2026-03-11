<template>
  <div class="w-full" aria-hidden="true">
    <template v-if="type === 'card'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <el-card
          v-for="i in count"
          :key="`skel-card-${i}`"
          class="w-full h-full rounded-xl overflow-hidden flex flex-col dark:bg-[#0a0a0a] shadow-sm ring-0 border-gray-200 transition-shadow"
          :body-style="{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column' }"
        >
          <div
            class="h-48 w-full skeleton-bg border-b border-gray-100 dark:border-[#1a1a1a] flex-shrink-0"
          ></div>

          <div class="p-4 flex-1 flex flex-col relative z-10 bg-white dark:bg-transparent">
            <div class="h-5 w-3/4 rounded skeleton-bg mb-3 mt-1"></div>
            <div class="h-3 w-1/3 rounded skeleton-bg mb-3"></div>

            <div class="h-3 w-full rounded skeleton-bg mt-2"></div>
            <div class="h-3 w-4/5 rounded skeleton-bg mt-2 flex-1 min-h-[40px]"></div>

            <div
              class="mt-4 pt-3 border-t border-gray-100 dark:border-[#1a1a1a] flex flex-col gap-2"
            >
              <div class="h-4 w-1/4 rounded skeleton-bg mt-1"></div>
              <div class="h-3 w-2/5 rounded skeleton-bg"></div>
            </div>
          </div>
        </el-card>
      </div>
    </template>

    <template v-else-if="type === 'list'">
      <div class="space-y-4">
        <div
          v-for="i in count"
          :key="`skel-list-${i}`"
          class="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg"
        >
          <div class="h-12 w-12 rounded-full skeleton-bg flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 w-1/4 rounded skeleton-bg"></div>
            <div class="h-4 w-1/2 rounded skeleton-bg"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'block'">
      <div class="w-full h-full rounded-xl skeleton-bg"></div>
    </template>

    <template v-else>
      <div class="space-y-2">
        <div
          v-for="i in count"
          :key="`skel-text-${i}`"
          class="h-4 rounded skeleton-bg"
          :style="{ width: `${100 - (i % 3) * 15}%` }"
        ></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    type: {
      type: String,
      default: 'card',
      validator: (val: string) => ['card', 'list', 'text', 'block'].includes(val),
    },
    count: {
      type: Number,
      default: 1,
    },
  });
</script>
