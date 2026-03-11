<template>
  <div class="w-full max-w-md">
    <AuthHeader
      :title="showVerificationStep ? 'Verify your email' : 'Create an account'"
      :subtitle="
        showVerificationStep
          ? `We sent a code to ${formData.email}`
          : 'Start managing your assets today'
      "
    />

    <el-card class="!rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <el-form
        v-if="!showVerificationStep"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="handleRegister"
      >
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="formData.name" placeholder="John Doe" :prefix-icon="User" />
        </el-form-item>

        <el-form-item label="Email Address" prop="email">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="name@company.com"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            :prefix-icon="Lock"
            show-password
          />

          <PasswordStrength :strength="passwordStrength" :has-password="!!formData.password" />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="••••••••"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm mt-4 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isRegistering"
          @click="handleRegister"
        >
          Create Account
        </el-button>
      </el-form>
      <el-form
        v-else
        ref="verifyFormRef"
        :model="verifyData"
        :rules="verifyRules"
        label-position="top"
        size="large"
        @keyup.enter="handleVerify"
      >
        <el-form-item label="Verification Code" prop="code">
          <el-input
            v-model="verifyData.code"
            placeholder="000000"
            maxlength="6"
            :prefix-icon="Select"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm mt-4 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isVerifying"
          @click="handleVerify"
        >
          Verify Email
        </el-button>

        <el-button text class="w-full mt-2" @click="showVerificationStep = false">
          Back to Registration
        </el-button>
      </el-form>

      <div
        v-if="!showVerificationStep"
        class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Already have an account?
        <router-link
          to="/login"
          class="font-medium text-gray-700 hover:text-black dark:text-gray-300 focus-visible:outline rounded"
        >
          Sign in
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { User, Lock, Message, Select } from '@element-plus/icons-vue';
  import {
    buildUserFriendlyErrorMessage,
    triggerError,
    triggerSuccess,
    triggerWarning,
    triggerInfo,
    handlePasswordValidation,
  } from '@/services/utils';
  import AuthHeader from '@/components/Auth/AuthHeader.vue';
  import PasswordStrength from '@/components/Auth/PasswordStrength.vue';
  import { authApi } from '@/api/auth.api';

  import { signUpSchema, calculatePasswordStrength } from '@/schemas/auth.schema';
  import { zodField } from '@/services/validation';

  const router = useRouter();
  const authStore = useAuthStore();

  const formRef = ref();
  const verifyFormRef = ref();
  const isRegistering = ref(false);
  const isVerifying = ref(false);
  const showVerificationStep = ref(false);

  const formData = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const verifyData = reactive({
    code: '',
  });
  const rules = {
    name: [{ validator: zodField(signUpSchema, 'name'), trigger: 'blur' }],
    email: [{ validator: zodField(signUpSchema, 'email'), trigger: 'blur' }],
    password: [
      {
        validator: (_rule: any, value: any, callback: any) =>
          handlePasswordValidation(value, callback, {
            strength: passwordStrength.value,
            otherPassword: formData.confirmPassword,
            formRef: formRef.value,
            otherFieldName: 'confirmPassword',
          }),
        trigger: 'change',
      },
    ],
    confirmPassword: [
      {
        validator: (_rule: any, value: any, callback: any) =>
          handlePasswordValidation(value, callback, {
            isConfirm: true,
            otherPassword: formData.password,
          }),
        trigger: 'blur',
      },
    ],
  };
  const verifyRules = {
    code: [
      {
        required: true,
        message: 'Please enter the verification code',
        trigger: 'blur',
      },
      {
        min: 6,
        max: 6,
        message: 'Code should be 6 characters',
        trigger: 'change',
      },
    ],
  };

  const passwordStrength = computed(() => calculatePasswordStrength(formData.password));

  const handleExistingUserError = async () => {
    try {
      await authApi.resendSignUpCode({ username: formData.email });
      showVerificationStep.value = true;
      triggerWarning(
        'Verify Email',
        "Your account exists but is not verified. We've sent a new code."
      );
    } catch (resendErr: any) {
      const resendMsg = resendErr.message || '';
      if (resendMsg.includes('already confirmed') || resendErr.name === 'NotAuthorizedException') {
        triggerInfo(
          'Existing User',
          'This account is already registered and verified. Please sign in.'
        );
        router.push('/login');
      } else {
        console.error('Failed to resend code', resendErr);
      }
    }
  };

  const handleRegister = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const validation = signUpSchema.safeParse(formData);
        if (!validation.success) {
          triggerError(
            'Validation Failed',
            validation.error.errors?.[0]?.message || 'Check form fields'
          );
          return;
        }

        isRegistering.value = true;
        try {
          await authApi.signUp({
            username: formData.email,
            password: formData.password,
            options: {
              userAttributes: {
                name: formData.name,
              },
            },
          });
          showVerificationStep.value = true;
          triggerSuccess('Account Created', 'A verification code has been sent to your email.');
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);

          if (
            error.name === 'UsernameExistsException' ||
            error.__type === 'UsernameExistsException' ||
            error.message?.includes('UsernameExistsException')
          ) {
            await handleExistingUserError();
            return;
          }

          triggerError('Registration Failed', userMsg);
        } finally {
          isRegistering.value = false;
        }
      }
    });
  };

  const handleAutoSignIn = async (email: string) => {
    try {
      await authApi.signIn({
        username: email,
        password: formData.password,
      });
      await authStore.loadCurrentUser();
      router.push('/');
    } catch (signInErr: any) {
      console.error('Auto sign-in failed after verification', signInErr);
      router.push('/login?registered=true');
    }
  };

  const handleVerify = async () => {
    if (!verifyFormRef.value) return;
    await verifyFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const email = formData.email.trim().toLowerCase();
        const code = verifyData.code.trim();
        isVerifying.value = true;
        try {
          await authApi.confirmSignUp({
            username: email,
            confirmationCode: code,
          });

          triggerSuccess('Success', 'Email verified! Logging you in...');
          await handleAutoSignIn(email);
        } catch (error: any) {
          console.error('Confirm Sign Up Error:', error);
          const userMsg = buildUserFriendlyErrorMessage(error);
          triggerError('Verification Failed', userMsg);
        } finally {
          isVerifying.value = false;
        }
      }
    });
  };
</script>

<style scoped>
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--text-primary);
  }
</style>
