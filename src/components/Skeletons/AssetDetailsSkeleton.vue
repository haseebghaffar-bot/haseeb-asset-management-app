<template>
  <div class="space-y-6" aria-hidden="true">
    <div
      class="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-200 dark:border-transparent shadow-sm flex justify-between items-center"
    >
      <div class="w-1/2">
        <div class="h-6 w-2/3 rounded skeleton-bg mb-2"></div>
        <div class="h-4 w-1/3 rounded skeleton-bg"></div>
      </div>
      <div class="h-8 w-24 rounded skeleton-bg"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-1 lg:col-span-2 space-y-6">
        <el-card
          class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] overflow-hidden border-gray-200 dark:border-transparent"
          :body-style="{ padding: '0px' }"
        >
          <div
            class="w-full aspect-video skeleton-bg border-b border-gray-100 dark:border-[#1a1a1a]"
          ></div>
          <div class="p-6 space-y-3">
            <div class="h-6 w-1/4 rounded skeleton-bg mb-4"></div>
            <div class="h-4 w-full rounded skeleton-bg"></div>
            <div class="h-4 w-full rounded skeleton-bg"></div>
            <div class="h-4 w-3/4 rounded skeleton-bg"></div>
          </div>
        </el-card>
      </div>

      <div class="col-span-1 space-y-6">
        <el-card
          class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] border-gray-200 dark:border-transparent"
        >
          <div class="h-6 w-1/2 rounded skeleton-bg mb-5"></div>
          <div class="space-y-5">
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-4 w-3/4 rounded skeleton-bg"></div>
            </div>
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-4 w-1/2 rounded skeleton-bg"></div>
            </div>
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-6 w-16 rounded-full skeleton-bg mt-1"></div>
            </div>
          </div>
        </el-card>

        <el-card
          class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] border-gray-200 dark:border-transparent"
        >
          <div class="h-6 w-1/2 rounded skeleton-bg mb-5"></div>
          <div class="space-y-5">
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-4 w-1/3 rounded skeleton-bg"></div>
            </div>
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-4 w-1/2 rounded skeleton-bg"></div>
            </div>
            <div>
              <div class="h-3 w-1/3 rounded skeleton-bg mb-2"></div>
              <div class="h-4 w-2/5 rounded skeleton-bg"></div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .skeleton-bg {
    background: linear-gradient(
      90deg,
      rgba(156, 163, 175, 0.1) 25%,
      rgba(156, 163, 175, 0.2) 50%,
      rgba(156, 163, 175, 0.1) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .dark .skeleton-bg {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 200% 100%;
  }
</style>
