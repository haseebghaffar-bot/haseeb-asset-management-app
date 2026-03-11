import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'asset-storage',
  access: (allow) => ({
    'assets/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'profile-pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
