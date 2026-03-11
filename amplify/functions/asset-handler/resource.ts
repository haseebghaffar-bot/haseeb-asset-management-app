import { defineFunction } from '@aws-amplify/backend';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { 
  DB_HOST = '', 
  DB_USER = '', 
  DB_PASSWORD = '', 
  DB_NAME = '' 
} = process.env;

if (!DB_HOST) {
  console.warn('[Amplify Synthesis] WARNING: DB_HOST is missing. Please ensure .env is loaded.');
}

export const assetHandler = defineFunction({
  name: 'asset-handler',
  entry: './src/handler.ts',
  environment: { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME },
});
