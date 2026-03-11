import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth.api';
import { assetsApi } from '@/api/assets.api';
import { useAssetStore } from '@/stores/assets';
import type {
  SignInInput,
  SignUpInput,
  ConfirmSignUpInput,
  ConfirmSignInInput,
} from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';
import { loginSchema, signUpSchema } from '@/schemas/auth.schema';
import { UserProfile } from '@/types';
import { storageApi } from '@/api/storage.api';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AuthUser | null>(null);
  const userAttributes = ref<Record<string, string | undefined>>({});
  const userProfile = ref<UserProfile | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const authError = ref<string | null>(null);
  const sessionTimeoutId = ref<number | null>(null);
  const assetStore = useAssetStore();

  const isLoggedIn = computed(() => isAuthenticated.value && currentUser.value !== null);
  const userName = computed(
    () =>
      userProfile.value?.name || userAttributes.value?.name || currentUser.value?.username || 'User'
  );
  
  const resolvedAvatarUrl = ref('');
  const userAvatar = computed(() => resolvedAvatarUrl.value || userProfile.value?.avatarUrl || '');
  const userEmail = computed(
    () => userAttributes.value?.email || currentUser.value?.signInDetails?.loginId || ''
  );
  const isAdmin = computed(() => false);

  async function resolveAvatarUrl(profile: UserProfile) {
    if (!profile.avatarUrl || !profile.avatarUrl.startsWith('profile-pictures/')) return;
    try {
      resolvedAvatarUrl.value = await storageApi.getSignedImageUrl(profile.avatarUrl);
    } catch (e) {
      console.warn('Failed to resolve avatar URL', e);
    }
  }

  async function handleProfileCreationFallback() {
    try {
      userProfile.value = await authApi.createUserProfile({
        email: userAttributes.value?.email || '',
        name: userAttributes.value?.name || 'User',
        status: 'active',
        theme: 'auto',
        language: 'en',
      });
    } catch (createErr) {
      console.error('Failed to create user profile after error', createErr);
    }
  }

  async function fetchAndSetupUserProfile() {
    try {
      const profile = await authApi.getUserProfile();
      if (profile) {
        userProfile.value = profile;
        await resolveAvatarUrl(profile);
      } else {
        await handleProfileCreationFallback();
      }
    } catch (err) {
      await handleProfileCreationFallback();
    }
  }

  async function loadCurrentUser() {
    isLoading.value = true;
    authError.value = null;
    try {
      const activeData = await authApi.getActiveUser();
      
      if (activeData?.user) {
        currentUser.value = activeData.user;
        userAttributes.value = (activeData.attributes as Record<string, string>) || {};
        isAuthenticated.value = true;
        await fetchAndSetupUserProfile();
      } else {
        resetLocalUser();
      }
    } catch (error: any) {
      console.error('Failed to load user session', error);
      resetLocalUser();
    } finally {
      isLoading.value = false;
    }
  }

  function resetLocalUser() {
    currentUser.value = null;
    userAttributes.value = {};
    userProfile.value = null;
    isAuthenticated.value = false;
  }

  async function handleSignIn(data: SignInInput) {
    const validation = loginSchema.safeParse({
      email: data.username,
      password: data.password,
    });

    if (!validation.success) {
      authError.value = validation.error.errors?.[0]?.message || 'Validation failed';
      throw new Error(authError.value);
    }

    if (!data.username) {
      authError.value = 'Username/Email is required';
      throw new Error(authError.value);
    }
    authError.value = null;
    try {
      const { isSignedIn, nextStep } = await authApi.signIn(data);
      if (isSignedIn) {
        await loadCurrentUser();
      }
      return { isSignedIn, nextStep };
    } catch (error: any) {
      authError.value = error.message || 'Failed to sign in';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleConfirmSignIn(data: ConfirmSignInInput) {
    isLoading.value = true;
    authError.value = null;
    try {
      const { isSignedIn, nextStep } = await authApi.confirmSignIn(data);
      if (isSignedIn) {
        await loadCurrentUser();
      }
      return { isSignedIn, nextStep };
    } catch (error: any) {
      authError.value = error.message || 'Failed to confirm sign in';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSignUp(data: SignUpInput) {
    const validation = signUpSchema.safeParse({
      email: data.username,
      password: data.password,
      confirmPassword: data.password,
    });

    if (!validation.success) {
      authError.value = validation.error.errors?.[0]?.message || 'Validation failed';
      throw new Error(authError.value);
    }

    isLoading.value = true;
    authError.value = null;
    try {
      return await authApi.signUp(data);
    } catch (error: any) {
      authError.value = error.message || 'Failed to sign up';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleVerifyEmail(data: ConfirmSignUpInput) {
    isLoading.value = true;
    authError.value = null;
    try {
      return await authApi.confirmSignUp(data);
    } catch (error: any) {
      authError.value = error.message || 'Failed to verify email';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSignOut() {
    isLoading.value = true;
    try {
      await authApi.signOut();
      resetAuthState();
    } catch (error) {
      console.error('Sign out error', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function handleDeleteAccount() {
    isLoading.value = true;
    try {
      await assetsApi.batchDeleteByFilter({});
      if (userProfile.value?.id) {
        await authApi.deleteUserProfile(userProfile.value.id);
      }
      await authApi.deleteUser();
      resetAuthState();
    } catch (error: any) {
      authError.value = error.message || 'Failed to delete account';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleUpdateProfile(data: {
    name?: string;
    company?: string;
    department?: string;
    avatarFile?: File;
  }) {
    if (!userProfile.value?.id) throw new Error('No user profile found to update');

    isLoading.value = true;
    try {
      let newAvatarUrl = userProfile.value.avatarUrl;
      
      if (data.avatarFile) {
        const { key } = await storageApi.uploadProfileImage(data.avatarFile);
        newAvatarUrl = key;
        resolvedAvatarUrl.value = await storageApi.getSignedImageUrl(key);
      }

      const updated = await authApi.updateUserProfile({
        id: userProfile.value.id,
        name: data.name,
        company: data.company,
        department: data.department,
        ...(newAvatarUrl ? { avatarUrl: newAvatarUrl } : {}),
      });
      userProfile.value = updated;
      return updated;
    } catch (error: any) {
      authError.value = error.message || 'Failed to update profile';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function resetAuthState() {
    currentUser.value = null;
    userAttributes.value = {};
    userProfile.value = null;
    isAuthenticated.value = false;
    assetStore.clearStore();
  }

  async function resolveRouteGuard(to: any) {
    if (isLoading.value) {
      await loadCurrentUser();
    }

    const isAuth = isAuthenticated.value;

    if (to.meta.requiresAuth && !isAuth) {
      return { name: 'Login', query: { redirect: to.fullPath } };
    }

    if (to.meta.guestOnly && isAuth) {
      return { name: 'Dashboard' };
    }

    return null;
  }

  function refreshSession() {
    if (sessionTimeoutId.value) {
      window.clearTimeout(sessionTimeoutId.value);
    }
    sessionTimeoutId.value = window.setTimeout(
      () => {
        handleSignOut();
      },
      60 * 60 * 1000
    );
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    authError,
    isLoggedIn,
    userName,
    userEmail,
    isAdmin,
    userAvatar,
    userProfile,
    loadCurrentUser,
    handleSignIn,
    handleConfirmSignIn,
    handleSignUp,
    handleVerifyEmail,
    handleSignOut,
    handleDeleteAccount,
    handleUpdateProfile,
    refreshSession,
    resolveRouteGuard,
  };
});
