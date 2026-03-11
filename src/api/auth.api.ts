import {
  getCurrentUser,
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  fetchAuthSession,
  fetchUserAttributes,
  deleteUser,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  confirmSignIn,
} from 'aws-amplify/auth';
import type {
  SignInInput,
  SignUpInput,
  ConfirmSignUpInput,
  ResetPasswordInput,
  ConfirmResetPasswordInput,
  ResendSignUpCodeInput,
  ConfirmSignInInput,
} from 'aws-amplify/auth';
import apiClient from './client';
import { GET_USER_PROFILE } from '@/graphql/queries';
import { CREATE_USER_PROFILE, DELETE_USER_PROFILE, UPDATE_USER_PROFILE } from '@/graphql/mutations';
import type { UserProfile } from '@/types';

export const authApi = {
  async getCurrentUser() {
    return await getCurrentUser();
  },

  async confirmSignIn(data: ConfirmSignInInput) {
    return await confirmSignIn(data);
  },

  async deleteUserProfile(id: string) {
    const response = await apiClient.post('', {
      query: DELETE_USER_PROFILE,
      variables: { input: { id } },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message || 'Profile deletion failed');
    }

    return response.data.data.deleteUserProfile;
  },

  async resendSignUpCode(data: ResendSignUpCodeInput) {
    return await resendSignUpCode(data);
  },

  async resetPassword(data: ResetPasswordInput) {
    return await resetPassword(data);
  },

  async confirmResetPassword(data: ConfirmResetPasswordInput) {
    return await confirmResetPassword(data);
  },

  async signIn(data: SignInInput) {
    return await signIn(data);
  },

  async signUp(data: SignUpInput) {
    return await signUp(data);
  },

  async confirmSignUp(data: ConfirmSignUpInput) {
    return await confirmSignUp(data);
  },

  async signOut() {
    return await signOut({ global: false });
  },

  async deleteUser() {
    return await deleteUser();
  },

  async getActiveUser() {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();
      return { user, session, attributes };
    } catch {
      return null;
    }
  },

  async getUserProfile() {
    const response = await apiClient.post('', {
      query: GET_USER_PROFILE,
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message || 'Profile fetch failed');
    }

    const items = response.data.data.listUserProfiles?.items || [];
    return items.length > 0 ? (items[0] as UserProfile) : null;
  },

  async createUserProfile(input: any) {
    const response = await apiClient.post('', {
      query: CREATE_USER_PROFILE,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message || 'Profile creation failed');
    }

    return response.data.data.createUserProfile as UserProfile;
  },

  async updateUserProfile(input: any) {
    const response = await apiClient.post('', {
      query: UPDATE_USER_PROFILE,
      variables: { input },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message || 'Profile update failed');
    }

    return response.data.data.updateUserProfile as UserProfile;
  },
};
