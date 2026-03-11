import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/** Auth (Cognito), Data (AppSync/DB), and Storage (S3) */
defineBackend({
  auth,
  data,
  storage
});
