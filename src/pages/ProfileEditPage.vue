<template>
  <div class="p-6 max-w-2xl mx-auto">
    <PageHeader title="Edit Profile" show-back @back="router.back()" />

    <el-card
      shadow="never"
      class="!border-gray-200 dark:!border-transparent !rounded-xl dark:!bg-[#0a0a0a]"
    >
      <el-form :model="form" label-position="top" class="space-y-4">
        <div class="flex flex-col items-center mb-8">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <div
              class="relative group cursor-pointer inline-block rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-sm transition-transform hover:scale-105"
            >
              <el-avatar :size="100" class="bg-gray-700 text-white text-3xl font-bold !border-none">
                <img
                  v-if="previewUrl || authStore.userAvatar"
                  :src="previewUrl || authStore.userAvatar"
                />
                <span v-else>{{ authStore.userName.charAt(0).toUpperCase() }}</span>
              </el-avatar>
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <el-icon class="text-white text-2xl"><Camera /></el-icon>
              </div>
            </div>
          </el-upload>
          <p class="text-xs text-gray-500 mt-2">Click icon to change photo</p>
        </div>

        <el-form-item label="Display Name">
          <el-input v-model="form.name" placeholder="Your full name" />
        </el-form-item>

        <el-form-item label="Department">
          <el-input v-model="form.department" placeholder="e.g. IT, Operations" />
        </el-form-item>

        <el-form-item label="Company">
          <el-input v-model="form.company" placeholder="Company name" />
        </el-form-item>

        <div class="flex gap-4 pt-4">
          <el-button
            type="primary"
            class="w-full !rounded-lg"
            :loading="saving"
            @click="handleSave"
          >
            Save Changes
          </el-button>
          <el-button
            class="w-full !rounded-lg dark:!bg-transparent dark:!border-[#1a1a1a] dark:!text-gray-400 dark:hover:!text-white dark:hover:!bg-[#1a1a1a]"
            @click="router.back()"
          >
            Cancel
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { Camera } from '@element-plus/icons-vue';
  import PageHeader from '@/components/Common/PageHeader.vue';
  import { triggerSuccess, triggerError } from '@/services/utils';

  const router = useRouter();
  const authStore = useAuthStore();
  const saving = ref(false);
  const selectedFile = ref<File | null>(null);
  const previewUrl = ref<string | null>(null);

  const form = reactive({
    name: '',
    department: '',
    company: '',
  });

  const handleFileChange = (file: any) => {
    if (file && file.raw) {
      selectedFile.value = file.raw;
      previewUrl.value = URL.createObjectURL(file.raw);
    }
  };

  const loadInitialData = () => {
    const profile = authStore.userProfile;
    form.name = profile?.name || authStore.userName || '';
    form.department = profile?.department || '';
    form.company = profile?.company || '';
  };

  onMounted(() => {
    if (authStore.userProfile) {
      loadInitialData();
    } else {
      const unwatch = watchEffect(() => {
        if (authStore.userProfile) {
          loadInitialData();
          unwatch();
        }
      });
    }
  });

  import { watchEffect } from 'vue';

  const handleSave = async () => {
    saving.value = true;
    try {
      await authStore.handleUpdateProfile({
        name: form.name,
        department: form.department,
        company: form.company,
        avatarFile: selectedFile.value || undefined,
      });
      triggerSuccess('Profile Updated', 'Your information has been saved successfully.');
      router.push('/profile');
    } catch (error: any) {
      console.error('Save failed', error);
      triggerError('Update Failed', error.message || 'Could not save profile changes.');
    } finally {
      saving.value = false;
    }
  };
</script>

<style scoped>
  .avatar-uploader {
    text-align: center;
  }
</style>
