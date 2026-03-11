import { v4 as uuidv4 } from 'uuid';
import { ElNotification } from 'element-plus';
import { AssetStatus } from '@/types';

export const formatDate = (dateString?: string | null, includeTime = false): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString as string);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date encountered: "${dateString}"`);
      return String(dateString);
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (_error) {
    return dateString as string;
  }
};

export const formatFileSize = (bytes?: number | null): string => {
  if (bytes === undefined || bytes === null || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text?: string | null, maxLength = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateUniqueId = (): string => {
  return uuidv4();
};

export const formatCurrency = (amount?: number | null, currency = 'USD'): string => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const buildUserFriendlyErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  const msg = error?.message || error?.msg;
  const errorType = error?.name || error?.__type || '';
  const fullMessage = errorType
    ? `[${errorType}] ${msg || ''}`
    : msg || 'An unexpected error occurred.';

  if (
    errorType.includes('UserNotConfirmedException') ||
    msg?.includes('UserNotConfirmedException')
  ) {
    return 'Your account is not yet verified. Please check your email for the verification code.';
  }
  if (errorType.includes('UsernameExistsException') || msg?.includes('UsernameExistsException')) {
    return "This email is already registered. If you haven't verified it, please check your inbox.";
  }
  if (errorType.includes('UserNotFoundException') || msg?.includes('UserNotFoundException')) {
    return "This account doesn't exist.";
  }
  if (errorType.includes('CodeMismatchException') || msg?.includes('CodeMismatchException')) {
    return 'Invalid verification code provided, please try again.';
  }
  if (errorType.includes('NotAuthorizedException') || msg?.includes('NotAuthorizedException')) {
    if (msg?.toLowerCase().includes('already confirmed'))
      return 'This account is already verified. Please try to sign in.';
    if (msg?.toLowerCase().includes('incorrect username or password'))
      return 'Incorrect username or password. Please try again.';
    if (msg?.toLowerCase().includes('password attempts exceeded'))
      return 'Too many failed attempts. Please try again later.';
    return msg || 'You do not have permission to perform this action.';
  }
  if (!msg) return 'An unexpected error occurred. Please try again.';
  if (msg.includes('Network timeout') || msg.toLowerCase().includes('network error')) {
    return 'Connection lost. Please check your internet and try again.';
  }

  return fullMessage;
};

export const getAssetStatusType = (
  _status?: AssetStatus | string | null
): 'success' | 'warning' | 'info' | 'danger' => {
  return 'info';
};
export const triggerSuccess = (title: string, message: string, duration = 3000) => {
  ElNotification({
    title,
    message,
    type: 'success',
    duration,
    customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
  });
};

export const triggerError = (title: string, message: string, duration = 5000) => {
  ElNotification({
    title,
    message,
    type: 'error',
    duration,
    customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
  });
};

export const triggerWarning = (title: string, message: string, duration = 4000) => {
  ElNotification({
    title,
    message,
    type: 'warning',
    duration,
    customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
  });
};

export const triggerInfo = (title: string, message: string, duration = 3000) => {
  ElNotification({
    title,
    message,
    type: 'info',
    duration,
    customClass: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100',
  });
};
export const handlePasswordValidation = (
  value: string,
  callback: (error?: Error) => void,
  options: {
    isConfirm?: boolean;
    otherPassword?: string;
    strength?: number;
    formRef?: any;
    otherFieldName?: string;
  }
) => {
  if (value === '') {
    return callback(
      new Error(options.isConfirm ? 'Please input the password again' : 'Please input the password')
    );
  }

  if (options.isConfirm) {
    if (value !== options.otherPassword) {
      return callback(new Error("Two inputs don't match!"));
    }
  } else {
    if (options.strength !== undefined && options.strength < 3) {
      return callback(
        new Error('Password is too weak. Must include 8 characters, upper/lower, numbers.')
      );
    }
    if (options.otherPassword && options.formRef && options.otherFieldName) {
      options.formRef.validateField(options.otherFieldName);
    }
  }
  callback();
};
