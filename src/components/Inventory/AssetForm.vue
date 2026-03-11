<template>
  <div class="max-w-4xl mx-auto" v-loading="isLoadingData">
    <PageHeader
      :title="isEditMode ? `Edit Asset: ${formData.name}` : 'Create New Asset'"
      :subtitle="
        isEditMode
          ? 'Update asset details and metadata below.'
          : 'Add a new asset to your organization\'s registry.'
      "
      show-back
      @back="goBack"
    />

    <el-card class="!rounded-xl shadow-sm dark:bg-[#0a0a0a] dark:border-transparent">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="large"
        class="asset-form"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div
            class="col-span-1 md:col-span-2 space-y-2 mb-4 border-b border-gray-100 dark:border-[#1a1a1a] pb-2"
          >
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Basic Information
            </h3>
          </div>

          <el-form-item label="Asset Name" prop="name" class="col-span-1 md:col-span-2">
            <el-input
              v-model="formData.name"
              placeholder="e.g. MacBook Pro M3"
              maxlength="255"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Description" prop="description" class="col-span-1 md:col-span-2">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="Detailed description of the asset..."
            />
          </el-form-item>

          <el-form-item label="Category" prop="category">
            <el-select v-model="formData.category" placeholder="Select a category" class="w-full">
              <el-option v-for="cat in CATEGORY_OPTIONS" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </el-form-item>

          <el-form-item label="Status" prop="status">
            <el-select v-model="formData.status" placeholder="Select status" class="w-full">
              <el-option v-for="st in STATUS_OPTIONS" :key="st" :label="st" :value="st" />
            </el-select>
          </el-form-item>

          <div
            class="col-span-1 md:col-span-2 space-y-2 mt-4 mb-4 border-b border-gray-100 dark:border-[#1a1a1a] pb-2"
          >
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Identification & Location
            </h3>
          </div>

          <el-form-item label="Serial Number" prop="serialNumber">
            <el-input
              v-model="formData.serialNumber"
              placeholder="Hardware serial or license key"
            />
          </el-form-item>

          <el-form-item label="Location" prop="location">
            <el-input v-model="formData.location" placeholder="e.g. New York Office, Desk 42" />
          </el-form-item>

          <div
            class="col-span-1 md:col-span-2 space-y-2 mt-4 mb-4 border-b border-gray-100 dark:border-[#1a1a1a] pb-2"
          >
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Acquisition Details
            </h3>
          </div>

          <el-form-item label="Purchase Date" prop="purchaseDate">
            <el-date-picker
              v-model="formData.purchaseDate"
              type="date"
              placeholder="Pick a date"
              class="!w-full"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="Purchase Price ($)" prop="purchasePrice">
            <el-input-number
              v-model="formData.purchasePrice"
              :min="0"
              :precision="2"
              :step="100"
              class="!w-full"
              placeholder="0.00"
            />
          </el-form-item>

          <el-form-item label="Condition" prop="condition">
            <el-select
              v-model="formData.condition"
              placeholder="Select condition"
              class="w-full"
              clearable
            >
              <el-option
                v-for="cond in CONDITION_OPTIONS"
                :key="cond"
                :label="cond"
                :value="cond"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Notes" prop="notes" class="col-span-1 md:col-span-2">
            <el-input
              v-model="formData.notes"
              type="textarea"
              :rows="2"
              placeholder="Any additional internal notes..."
            />
          </el-form-item>
          <div
            class="col-span-1 md:col-span-2 space-y-2 mt-4 mb-4 border-b border-gray-100 dark:border-[#1a1a1a] pb-2"
          >
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Asset Image</h3>
          </div>

          <div class="col-span-1 md:col-span-2">
            <ImageUpload
              :existing-image-url="existingImageUrl"
              :max-size-m-b="5"
              @file-selected="handleImageSelected"
              @remove-image="handleImageRemove"
            />
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-[#1a1a1a]"
        >
          <el-button size="large" @click="goBack" class="focus-visible:outline">Cancel</el-button>
          <el-button
            type="primary"
            size="large"
            :loading="isSubmitting"
            @click="submitForm"
            class="focus-visible:outline outline-2 outline-offset-2"
          >
            <el-icon class="mr-2">
              <Refresh v-if="isEditMode" />
              <DocumentAdd v-else />
            </el-icon>
            {{ isEditMode ? 'Update Asset' : 'Save New Asset' }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useAssetStore } from '@/stores/assets';
  import { assetsApi } from '@/api/assets.api';
  import { storageApi } from '@/api/storage.api';
  import { zodField } from '@/services/validation';
  import { assetSchema } from '@/schemas/asset.schema';
  import { triggerSuccess, triggerError } from '@/components/Common/SuccessNotification';
  import { buildUserFriendlyErrorMessage } from '@/services/utils';
  import { AssetCategory, AssetStatus, AssetCondition } from '@/types';
  import type { CreateAssetInput, UpdateAssetInput } from '@/types';
  import ImageUpload from '@/components/Inventory/ImageUpload.vue';
  import PageHeader from '@/components/Common/PageHeader.vue';
  import { CATEGORY_OPTIONS, STATUS_OPTIONS, CONDITION_OPTIONS } from '@/services/constants';
  import { DocumentAdd, Refresh } from '@element-plus/icons-vue';

  const props = defineProps({
    id: {
      type: String,
      required: false,
    },
  });

  const router = useRouter();
  const authStore = useAuthStore();
  const assetStore = useAssetStore();
  const formRef = ref();
  const isSubmitting = ref(false);
  const isLoadingData = ref(false);

  const formData = ref<CreateAssetInput | UpdateAssetInput>({
    name: '',
    description: '',
    category: AssetCategory.Other,
    status: AssetStatus.Active,
    serialNumber: '',
    location: '',
    purchaseDate: '',
    purchasePrice: undefined,
    condition: AssetCondition.Good,
    notes: '',
    imageFile: null,
  });
  const removeImageFlag = ref(false);
  const existingImageUrl = ref('');
  const rules = {
    name: [{ validator: zodField(assetSchema, 'name'), trigger: 'blur' }],
    category: [{ validator: zodField(assetSchema, 'category'), trigger: 'change' }],
    purchasePrice: [{ validator: zodField(assetSchema, 'purchasePrice'), trigger: 'blur' }],
    description: [{ validator: zodField(assetSchema, 'description'), trigger: 'blur' }],
    serialNumber: [{ validator: zodField(assetSchema, 'serialNumber'), trigger: 'blur' }],
  };

  const isEditMode = computed(() => !!props.id);

  const handleImageSelected = (file: File) => {
    formData.value.imageFile = file;
    removeImageFlag.value = false;
  };
  const handleImageRemove = () => {
    formData.value.imageFile = null;
    removeImageFlag.value = true;
  };
  const processAndUploadImage = async (currentImageKey: string | null) => {
    if (formData.value.imageFile) {
      const upload = await storageApi.uploadAssetImage(formData.value.imageFile);
      return upload.key;
    }
    if (isEditMode.value && removeImageFlag.value) {
      return null;
    }
    return currentImageKey;
  };

  const handleAssetSubmission = async () => {
    isSubmitting.value = true;
    try {
      const userId = authStore.currentUser?.userId || 'unknown';
      let imageKey = await processAndUploadImage((formData.value as any).imageName || null);
      const { imageFile: _imageFile, ...gqlInput } = formData.value as any;

      if (isEditMode.value && props.id) {
        await assetsApi.updateAsset({
          ...gqlInput,
          id: props.id,
          imageName: imageKey,
        });
        triggerSuccess('Success', 'Asset updated successfully');
        router.push(`/assets/${props.id}`);
      } else {
        const newAsset = await assetsApi.createAsset({
          ...gqlInput,
          userId,
          imageName: imageKey,
        });
        triggerSuccess('Success', 'Asset created successfully');
        router.push(`/assets/${newAsset.id}`);
      }
    } catch (error: any) {
      triggerError('Operation Failed', buildUserFriendlyErrorMessage(error));
    } finally {
      isSubmitting.value = false;
    }
  };

  const submitForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const validation = assetSchema.safeParse(formData.value);
        if (!validation.success) {
          triggerError(
            'Validation Error',
            validation.error.errors[0]?.message || 'Validation failed'
          );
          return;
        }
        await handleAssetSubmission();
      }
    });
  };

  const fetchAssetDetails = async () => {
    if (!props.id) return;
    isLoadingData.value = true;
    try {
      await assetStore.loadAssetById(props.id);
      const asset = assetStore.selectedAsset;
      if (asset) {
        formData.value = {
          id: asset.id,
          name: asset.name,
          description: asset.description || '',
          category: asset.category,
          status: asset.status,
          serialNumber: asset.serialNumber || '',
          location: asset.location || '',
          purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
          purchasePrice: asset.purchasePrice || undefined,
          condition: asset.condition || undefined,
          notes: asset.notes || '',
          imageFile: null,
        } as UpdateAssetInput;
        existingImageUrl.value = asset.imageUrl || '';
      }
    } catch {
      triggerError('Error', 'Failed to load asset details');
      router.push('/assets');
    } finally {
      isLoadingData.value = false;
    }
  };

  const goBack = () => {
    router.back();
  };

  onMounted(() => {
    if (isEditMode.value) {
      fetchAssetDetails();
    }
  });
</script>

<style scoped>
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--text-primary);
  }
</style>
