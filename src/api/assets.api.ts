import apiClient from './client';
import { LIST_ASSETS, GET_ASSET } from '@/graphql/queries';
import { CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET } from '@/graphql/mutations';
import type { Asset } from '@/types';

async function graphqlRequest<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await apiClient.post('', {
    query,
    variables,
  });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message || 'GraphQL Error');
  }

  return response.data.data;
}

export const assetsApi = {
  async listAssets(variables: { limit?: number; nextToken?: string | null; filter?: any }) {
    const cleanedVariables = { ...variables };
    if (cleanedVariables.filter && Object.keys(cleanedVariables.filter).length === 0) {
      delete cleanedVariables.filter;
    }

    const data = await graphqlRequest<{ listHaseebAssets: { items: Asset[]; nextToken: string | null } }>(
      LIST_ASSETS,
      {
        ...cleanedVariables,
        filter: cleanedVariables.filter ? JSON.stringify(cleanedVariables.filter) : undefined
      }
    );
    return data.listHaseebAssets;
  },

  async getAsset(id: string) {
    const data = await graphqlRequest<{ fetchHaseebAsset: Asset }>(GET_ASSET, { id });
    return data.fetchHaseebAsset;
  },

  async createAsset(input: any) {
    const data = await graphqlRequest<{ createHaseebAsset: Asset }>(CREATE_ASSET, { input });
    return data.createHaseebAsset;
  },

  async updateAsset(input: any) {
    const data = await graphqlRequest<{ updateHaseebAsset: Asset }>(UPDATE_ASSET, { input });
    return data.updateHaseebAsset;
  },

  async deleteAsset(id: string) {
    const data = await graphqlRequest<{ deleteHaseebAsset: { id: string } }>(DELETE_ASSET, {
      input: { id },
    });
    return data.deleteHaseebAsset;
  },

  async batchDeleteByFilter(filter: any) {
    let nextToken: string | null = null;
    let totalDeleted = 0;

    do {
      const response = await this.listAssets({
        filter,
        nextToken,
        limit: 100,
      });

      const items = response.items;
      nextToken = response.nextToken;

      if (items.length > 0) {
        await Promise.all(items.map((item) => this.deleteAsset(item.id)));
        totalDeleted += items.length;
      }
    } while (nextToken);

    return { totalDeleted };
  },
};
