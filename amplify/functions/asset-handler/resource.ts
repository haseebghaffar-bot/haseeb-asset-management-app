import { defineFunction, secret } from '@aws-amplify/backend';

export const assetHandler = defineFunction({
  name: 'asset-handler',
  entry: './src/handler.ts',
  timeoutSeconds: 30,
  environment: {
    DB_HOST: secret('DB_HOST'),
    DB_USER: secret('DB_USER'),
    DB_PASSWORD: secret('DB_PASSWORD'),
    DB_NAME: secret('DB_NAME'),
  },
  bundling: {
    minify: true,
  },
});