<template>
  <div class="p-4 sm:p-6 h-full overflow-auto hide-scrollbar">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400">
        Manage your application preferences and account settings.
      </p>
    </div>

    <div
      class="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-transparent divide-y divide-gray-100 dark:divide-[#1a1a1a]"
    >
      <div class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="font-medium dark:text-white">Mode Strategy</h3>
          <p class="text-sm text-gray-500">Sync with system preferences or choose manually.</p>
        </div>
        <el-radio-group
          v-model="themeMode"
          size="small"
          @change="handleThemeChange"
          class="!flex-nowrap"
        >
          <el-radio-button value="auto">Auto</el-radio-button>
          <el-radio-button value="light">Light</el-radio-button>
          <el-radio-button value="dark">Dark</el-radio-button>
        </el-radio-group>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <el-icon class="text-gray-500"><Warning /></el-icon>
            Data Management
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Permanently delete assets based on specific criteria.
          </p>
        </div>

        <div class="space-y-4 max-w-xl">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >Step 1: Choose Filter Type</span
            >
            <el-radio-group v-model="bulkDeleteType" size="small">
              <el-radio-button value="category">Category</el-radio-button>
              <el-radio-button value="status">Status</el-radio-button>
            </el-radio-group>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >Step 2: Select Value</span
            >
            <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <el-select
                v-model="bulkDeleteValue"
                :placeholder="`Select ${bulkDeleteType}`"
                class="w-full sm:!w-64"
                @change="bulkDeleteValue = $event"
              >
                <el-option
                  v-for="val in bulkDeleteType === 'category' ? CATEGORY_OPTIONS : STATUS_OPTIONS"
                  :key="val"
                  :label="val"
                  :value="val"
                />
              </el-select>

              <el-button
                :disabled="!bulkDeleteValue"
                :loading="isDeleting"
                @click="confirmBulkDelete"
                class="w-full sm:w-auto !bg-gray-100 !text-black !border-gray-300 dark:!bg-[#1a1a1a] dark:!text-white dark:!border-[#333] hover:dark:!bg-[#333] transition-colors"
              >
                Delete
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <AssetManagementTable />
      </div>

      <div class="p-6">
        <el-button
          @click="handleAccountDeletion"
          :loading="isDeletingAccount"
          class="!bg-transparent !border-red-200 !text-red-600 hover:!text-red-700 hover:!bg-red-50 dark:!border-red-900/30 dark:!text-red-400 dark:hover:!text-red-300 dark:hover:!bg-red-900/20 transition-all"
        >
          Delete Account
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import { useUIStore, type ThemeStrategy } from '@/stores/ui';
  import { useAssetStore } from '@/stores/assets';
  import { assetsApi } from '@/api/assets.api';
  import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/services/constants';
  import AssetManagementTable from '@/components/Settings/AssetManagementTable.vue';
  import { Warning } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus';
  import { triggerSuccess, triggerError, triggerInfo } from '@/services/utils';

  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const assetStore = useAssetStore();
  const router = useRouter();

  const themeMode = ref<ThemeStrategy>(uiStore.themeStrategy);

  const bulkDeleteType = ref<'category' | 'status'>('category');
  const bulkDeleteValue = ref('');
  const isDeleting = ref(false);
  const isDeletingAccount = ref(false);

  const handleAccountDeletion = async () => {
    try {
      await ElMessageBox.confirm('Are you sure you want to delete your account?', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        dangerouslyUseHTMLString: true,
      });

      isDeletingAccount.value = true;
      await authStore.handleDeleteAccount();

      triggerSuccess('Account Deleted', 'Your account has been permanently removed.');
      router.push('/');
    } catch (error: any) {
      if (error !== 'cancel') {
        triggerError('Error', error.message || 'Failed to delete account');
      }
    } finally {
      isDeletingAccount.value = false;
    }
  };

  const confirmBulkDelete = async () => {
    if (!bulkDeleteValue.value) return;

    try {
      await ElMessageBox.confirm(
        `This will permanently delete all assets where ${bulkDeleteType.value} is "${bulkDeleteValue.value}".`,
        'Action',
        {
          confirmButtonText: 'Yes, Delete All',
          cancelButtonText: 'Cancel',
          type: 'error',
          confirmButtonClass: 'el-button--danger',
        }
      );

      isDeleting.value = true;

      const filter = { [bulkDeleteType.value]: { eq: bulkDeleteValue.value } };
      const { totalDeleted } = await assetsApi.batchDeleteByFilter(filter);

      if (totalDeleted > 0) {
        triggerSuccess(
          'Success',
          `Successfully deleted ${totalDeleted} assets with ${bulkDeleteType.value} "${bulkDeleteValue.value}".`
        );
        await assetStore.loadAssets();
      } else {
        triggerInfo(
          'No Action Taken',
          `No assets were found with ${bulkDeleteType.value} "${bulkDeleteValue.value}".`
        );
      }

      bulkDeleteValue.value = '';
    } catch (error: any) {
      if (error !== 'cancel') {
        triggerError('Error', error.message || 'Failed to delete assets');
      }
    } finally {
      isDeleting.value = false;
    }
  };

  const handleThemeChange = (val: string | number | boolean) => {
    const strategy = val as ThemeStrategy;
    if (typeof uiStore.setThemeStrategy === 'function') {
      uiStore.setThemeStrategy(strategy);
    } else {
      console.error('setThemeStrategy is missing from uiStore', uiStore);
      uiStore.themeStrategy = strategy;
      localStorage.setItem('theme-strategy', strategy);
    }
  };

  onMounted(() => {
    themeMode.value = uiStore.themeStrategy;
  });
</script>
