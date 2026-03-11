import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { assetHandler } from '../functions/asset-handler/resource';

const schema = a.schema({
  Asset: a.customType({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    category: a.string().required(),
    imageUrl: a.string(),
    imageName: a.string(),
    userId: a.string(),
    status: a.string(),
    serialNumber: a.string(),
    location: a.string(),
    purchaseDate: a.string(),
    purchasePrice: a.float(),
    condition: a.string(),
    notes: a.string(),
    createdAt: a.string(),
    updatedAt: a.string()
  }),

  AssetList: a.customType({
    items: a.ref('Asset').array().required(),
    nextToken: a.string()
  }),

  CreateAsset: a.customType({
    name: a.string().required(),
    description: a.string(),
    category: a.string().required(),
    imageUrl: a.string(),
    imageName: a.string(),
    userId: a.string(),
    status: a.string(),
    serialNumber: a.string(),
    location: a.string(),
    purchaseDate: a.string(),
    purchasePrice: a.float(),
    condition: a.string(),
    notes: a.string()
  }),

  UpdateAsset: a.customType({
    id: a.id().required(),
    name: a.string(),
    description: a.string(),
    category: a.string(),
    imageUrl: a.string(),
    imageName: a.string(),
    userId: a.string(),
    status: a.string(),
    serialNumber: a.string(),
    location: a.string(),
    purchaseDate: a.string(),
    purchasePrice: a.float(),
    condition: a.string(),
    notes: a.string()
  }),

  DeleteAsset: a.customType({
    id: a.id().required()
  }),
  // AppSync Operation
  fetchHaseebAsset: a.query()
    .arguments({ id: a.id().required() })
    .returns(a.ref('Asset'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(assetHandler)),

  listHaseebAssets: a.query()
    .arguments({ limit: a.integer(), nextToken: a.string(), filter: a.string() })
    .returns(a.ref('AssetList'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(assetHandler)),

  createHaseebAsset: a.mutation()
    .arguments({ input: a.ref('CreateAsset').required() })
    .returns(a.ref('Asset'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(assetHandler)),

  updateHaseebAsset: a.mutation()
    .arguments({ input: a.ref('UpdateAsset').required() })
    .returns(a.ref('Asset'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(assetHandler)),

  deleteHaseebAsset: a.mutation()
    .arguments({ input: a.ref('DeleteAsset').required() })
    .returns(a.ref('Asset'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(assetHandler)),

  Tag: a.model({
    name: a.string().required(),
    color: a.string(),
    assetId: a.string().required(),
    userId: a.string()
  }).authorization(allow => [
    allow.ownerDefinedIn('userId')
  ]),

  HaseebAssetInfo: a.model({
    action: a.string(),
    assetId: a.string().required(),
    userId: a.string(),
    timestamp: a.datetime(),
    details: a.string(),
    ipAddress: a.string(),
    userAgent: a.string()
  }).authorization(allow => [
    allow.ownerDefinedIn('userId')
  ]),

  UserProfile: a.model({
    email: a.string().required(),
    name: a.string(),
    phone: a.string(),
    avatarUrl: a.string(),
    company: a.string(),
    department: a.string(),
    jobTitle: a.string(),
    theme: a.string(),
    language: a.string(),
    status: a.string(),
    storageUsed: a.float(),
    storageLimit: a.float(),
    lastLoginAt: a.datetime()
  }).authorization(allow => [
    allow.owner()
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
