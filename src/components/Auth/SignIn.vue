<template>
  <div class="w-full max-w-md">
    <AuthHeader :title="headerTitle" :subtitle="headerSubtitle" />

    <el-card class="!rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <el-form
        v-if="currentStep === 'signin'"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="Email Address" prop="email">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="name@company.com"
            :prefix-icon="Message"
            class="!rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            :prefix-icon="Lock"
          >
            <template #suffix>
              <el-icon class="cursor-pointer" @click="showPassword = !showPassword">
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="flex items-center justify-between mb-6">
          <el-checkbox v-model="formData.rememberMe" label="Remember me" />
          <button
            type="button"
            @click="currentStep = 'forgot'"
            class="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isLoading"
          @click="handleLogin"
        >
          Sign In
        </el-button>
      </el-form>
      <el-form
        v-else-if="currentStep === 'forgot'"
        ref="forgotFormRef"
        :model="forgotData"
        :rules="forgotRules"
        label-position="top"
        size="large"
        @keyup.enter="handleForgotPassword"
      >
        <el-form-item label="Email Address" prop="email">
          <el-input
            v-model="forgotData.email"
            type="email"
            placeholder="name@company.com"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm mt-4 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isLoading"
          @click="handleForgotPassword"
        >
          Send Reset Code
        </el-button>

        <el-button text class="w-full mt-4" @click="currentStep = 'signin'">
          Back to Sign In
        </el-button>
      </el-form>
      <el-form
        v-else-if="currentStep === 'reset-code'"
        ref="resetCodeFormRef"
        :model="resetData"
        :rules="resetCodeRules"
        label-position="top"
        size="large"
        @keyup.enter="handleVerifyResetCode"
      >
        <el-form-item label="Reset Code" prop="code">
          <el-input
            v-model="resetData.code"
            placeholder="000000"
            maxlength="6"
            autocomplete="off"
            :prefix-icon="Select"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm mt-4 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isLoading"
          @click="handleVerifyResetCode"
        >
          Verify Code
        </el-button>

        <el-button text class="w-full mt-4" @click="currentStep = 'forgot'"> Back </el-button>
      </el-form>

      <el-form
        v-else-if="currentStep === 'reset-password'"
        ref="resetPasswordFormRef"
        :model="resetData"
        :rules="resetPasswordRules"
        label-position="top"
        size="large"
        @keyup.enter="handleResetPassword"
      >
        <el-form-item label="New Password" prop="password">
          <el-input
            v-model="resetData.password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full !rounded-lg !h-11 font-medium text-base shadow-sm mt-4 focus-visible:outline outline-2 outline-offset-2 outline-gray-500"
          :loading="isLoading"
          @click="currentStep === 'reset-password' && !forgotData.email ? handleCompleteNewPassword() : handleResetPassword()"
        >
          Update Password
        </el-button>

        <el-button text class="w-full mt-4" @click="forgotData.email ? currentStep = 'reset-code' : currentStep = 'signin'"> Back </el-button>
      </el-form>
      <el-form
        v-else-if="currentStep === 'verify'"
        ref="verifyFormRef"
        :model="verifyData"
        :rules="verifyRules"
        label-position="top"
        size="large"
        @keyup.enter="handleVerifyAccount"
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
          :loading="isLoading"
          @click="handleVerifyAccount"
        >
          Verify & Sign In
        </el-button>

        <el-button text class="w-full mt-4" @click="currentStep = 'signin'">
          Back to Sign In
        </el-button>
      </el-form>

      <div
        v-if="currentStep === 'signin'"
        class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Don't have an account?
        <router-link
          to="/register"
          class="font-medium text-gray-700 hover:text-black dark:text-gray-300 focus-visible:outline rounded"
        >
          Sign up now
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { authApi } from '@/api/auth.api';
  import { Lock, Message, View, Hide, Select } from '@element-plus/icons-vue';
  import {
    buildUserFriendlyErrorMessage,
    triggerError,
    triggerSuccess,
    triggerWarning,
    triggerInfo,
  } from '@/services/utils';
  import AuthHeader from '@/components/Auth/AuthHeader.vue';

  import { loginSchema } from '@/schemas/auth.schema';
  import { zodField } from '@/services/validation';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  type AuthStep = 'signin' | 'forgot' | 'reset-code' | 'reset-password' | 'verify';
  const currentStep = ref<AuthStep>('signin');
  const formRef = ref();
  const forgotFormRef = ref();
  const resetCodeFormRef = ref();
  const resetPasswordFormRef = ref();
  const verifyFormRef = ref();
  const isLoading = ref(false);
  const showPassword = ref(false);

  const formData = reactive({
    email: '',
    password: '',
    rememberMe: false,
  });

  const forgotData = reactive({
    email: '',
  });

  const resetData = reactive({
    code: '',
    password: '',
  });

  const verifyData = reactive({
    code: '',
  });

  const headerTitle = computed(() => {
    if (currentStep.value === 'forgot') return 'Reset Password';
    if (currentStep.value === 'reset-code') return 'Verify Reset Code';
    if (currentStep.value === 'reset-password') return 'Set New Password';
    if (currentStep.value === 'verify') return 'Verify Account';
    return 'Welcome back';
  });

  const headerSubtitle = computed(() => {
    if (currentStep.value === 'forgot') return 'Enter your email to receive a reset code';
    if (currentStep.value === 'reset-code') return 'Enter the 6-digit code sent to your email';
    if (currentStep.value === 'reset-password') return 'Choose a new password for your account';
    if (currentStep.value === 'verify')
      return 'Account exists but needs verification. Enter the code sent to your email.';
    return 'Sign in to your account to continue';
  });

  const rules = {
    email: [{ validator: zodField(loginSchema, 'email'), trigger: 'blur' }],
    password: [{ validator: zodField(loginSchema, 'password'), trigger: 'blur' }],
  };

  const forgotRules = {
    email: [{ validator: zodField(loginSchema, 'email'), trigger: 'blur' }],
  };

  const resetCodeRules = {
    code: [
      { required: true, message: 'Please enter the reset code', trigger: 'blur' },
      { min: 6, max: 6, message: 'Code must be 6 digits', trigger: 'change' },
    ],
  };

  const resetPasswordRules = {
    password: [
      { required: true, message: 'Please enter a new password', trigger: 'blur' },
      { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    ],
  };

  const verifyRules = {
    code: [
      { required: true, message: 'Please enter the verification code', trigger: 'blur' },
      { min: 6, max: 6, message: 'Code must be 6 digits', trigger: 'change' },
    ],
  };

  const stepToRoute: Record<AuthStep, string> = {
    signin: '/login',
    forgot: '/login/forgot',
    'reset-code': '/login/verify-code',
    'reset-password': '/login/new-password',
    verify: '/login/verify-account',
  };

  const routeToStep: Record<string, AuthStep> = {
    '/login': 'signin',
    '/login/forgot': 'forgot',
    '/login/verify-code': 'reset-code',
    '/login/new-password': 'reset-password',
    '/login/verify-account': 'verify',
  };

  const handleUnconfirmedUserError = async () => {
    currentStep.value = 'verify';
    triggerWarning(
      'Verify Email',
      "Your account exists but is not verified. We're sending a new code to your email."
    );

    try {
      await authApi.resendSignUpCode({ username: formData.email });
    } catch (resendErr) {
      console.error('Failed to resend code', resendErr);
    }
  };

  const handleLogin = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
          triggerError('Error', validation.error.errors?.[0]?.message || 'Validation failed');
          return;
        }

        isLoading.value = true;
        try {
          const { isSignedIn, nextStep } = await authStore.handleSignIn({
            username: formData.email,
            password: formData.password,
          });

          if (isSignedIn) {
            const redirectPath = route.query.redirect?.toString() || '/';
            router.push(redirectPath);
          } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            currentStep.value = 'reset-password';
            triggerInfo(
              'New Password Required',
              'Your account requires a new password before you can sign in.'
            );
          }
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);

          if (
            error.name === 'UserNotConfirmedException' ||
            error.__type === 'UserNotConfirmedException' ||
            error.message?.includes('UserNotConfirmedException')
          ) {
            await handleUnconfirmedUserError();
            return;
          }

          triggerError('Sign In Failed', userMsg);
        } finally {
          isLoading.value = false;
        }
      }
    });
  };

  const handleVerifyAccount = async () => {
    if (!verifyFormRef.value) return;
    await verifyFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        isLoading.value = true;
        try {
          await authApi.confirmSignUp({
            username: formData.email,
            confirmationCode: verifyData.code,
          });

          await authApi.signIn({
            username: formData.email,
            password: formData.password,
          });

          await authStore.loadCurrentUser();
          router.push('/');

          triggerSuccess('Welcome!', "Your account has been verified and you're now signed in.");
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);
          triggerError('Verification Failed', userMsg);
        } finally {
          isLoading.value = false;
        }
      }
    });
  };

  const handleForgotPassword = async () => {
    if (!forgotFormRef.value) return;
    await forgotFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        isLoading.value = true;
        try {
          await authApi.resetPassword({ username: forgotData.email });
          currentStep.value = 'reset-code';
          triggerSuccess('Code Sent', 'Please check your email for the reset code.');
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);
          triggerError('Error', userMsg);
        } finally {
          isLoading.value = false;
        }
      }
    });
  };

  const handleVerifyResetCode = async () => {
    if (!resetCodeFormRef.value) return;
    await resetCodeFormRef.value.validate((valid: boolean) => {
      if (valid) {
        currentStep.value = 'reset-password';
      }
    });
  };

  const handleResetPassword = async () => {
    if (!resetPasswordFormRef.value) return;
    await resetPasswordFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        if (resetData.password === formData.password) {
          triggerWarning(
            'Same Password',
            'New password must be different from your previous password.'
          );
          return;
        }
        isLoading.value = true;
        try {
          await authApi.confirmResetPassword({
            username: forgotData.email,
            confirmationCode: resetData.code,
            newPassword: resetData.password,
          });
          currentStep.value = 'signin';
          triggerSuccess('Success', 'Password has been reset. You can now sign in.');
          formData.email = forgotData.email;
          formData.password = '';
          resetData.code = '';
          resetData.password = '';
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);
          triggerError('Error', userMsg);
        } finally {
          isLoading.value = false;
        }
      }
    });
  };

  const handleCompleteNewPassword = async () => {
    if (!resetPasswordFormRef.value) return;
    await resetPasswordFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        isLoading.value = true;
        try {
          await authStore.handleConfirmSignIn({
            challengeResponse: resetData.password,
          });
          triggerSuccess('Success', 'Password updated and you are now signed in!');
          router.push('/');
        } catch (error: any) {
          const userMsg = buildUserFriendlyErrorMessage(error);
          triggerError('Failed to Set Password', userMsg);
        } finally {
          isLoading.value = false;
        }
      }
    });
  };

  watch(currentStep, (newStep) => {
    if (newStep === 'signin' || newStep === 'forgot') {
      resetData.password = '';
      resetData.code = '';
    }

    const targetPath = stepToRoute[newStep];
    if (targetPath && route.path !== targetPath) {
      router.replace(targetPath);
    }
  });

  onMounted(() => {
    const stepFromRoute = routeToStep[route.path];
    if (stepFromRoute) {
      currentStep.value = stepFromRoute;
    }
  });
</script>

<style scoped>
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--text-primary);
  }
</style>
