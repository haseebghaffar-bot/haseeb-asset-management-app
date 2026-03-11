<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-2"
              >
                {{ title }}
              </DialogTitle>

              <div class="mt-2 text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line mb-4">
                {{ message }}
              </div>

              <slot></slot>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                  @click="handleClose"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="button"
                  :class="[
                    'inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors',
                    type === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                      : type === 'success'
                        ? 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
                        : type === 'warning'
                          ? 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400'
                          : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
                    isConfirmDisabled ? 'opacity-50 cursor-not-allowed' : '',
                  ]"
                  @click="handleConfirm"
                  :disabled="isConfirmDisabled"
                >
                  <span v-if="isConfirmDisabled">Wait...</span>
                  <span v-else>{{ confirmText }}</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirm Action',
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    type: {
      type: String as () => 'primary' | 'success' | 'warning' | 'danger',
      default: 'primary',
    },
    requireDelay: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

  const isConfirmDisabled = ref(false);
  let timeoutId: number | null = null;

  const handleClose = () => {
    emit('update:modelValue', false);
    emit('cancel');
  };

  const handleConfirm = () => {
    if (isConfirmDisabled.value) return;
    emit('confirm');
    emit('update:modelValue', false);
  };

  watch(
    () => props.modelValue,
    (isVisible) => {
      if (isVisible && props.requireDelay) {
        isConfirmDisabled.value = true;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          isConfirmDisabled.value = false;
        }, 2000);
      } else {
        isConfirmDisabled.value = false;
        if (timeoutId) clearTimeout(timeoutId);
      }
    }
  );
</script>
