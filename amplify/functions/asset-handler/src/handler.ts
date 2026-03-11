import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { translateFilter, formatAsset } from './utils';
const mysql2 = require('mysql2');

export const handler = async (event: any, context: any) => {
  const info = event.info || event.resolveInfo || {};
  const parentTypeName = info.parentTypeName || info.typeName || event.typeName || 'Unknown';
  const fieldName = info.fieldName || event.fieldName || 'Unknown';
  const args = event.arguments || event.args || {};

  const { 
    DB_HOST: host = '', 
    DB_USER: user = '', 
    DB_PASSWORD: password = '', 
    DB_NAME: database = '' 
  } = process.env;

  const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false, 
    pool: { max: 2, min: 0, idle: 0, acquire: 3000, evict: 60000 },
    dialectOptions: { connectTimeout: 10000 }
  });

  const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    category: { type: DataTypes.STRING, allowNull: false },
    imageUrl: DataTypes.STRING,
    imageName: DataTypes.STRING,
    userId: DataTypes.STRING,
    status: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    location: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    purchasePrice: DataTypes.FLOAT,
    condition: DataTypes.STRING,
    notes: DataTypes.TEXT,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING
  }, { 
    tableName: 'haseeb_asset_info',
    timestamps: false 
  });

  const identity = event.identity || {};
  const currentUserId = identity.sub || identity.username || 'unknown';

  try {
    await sequelize.authenticate();
  } catch (dbError: any) {
    console.error('Database Connection Error:', dbError.message);
    throw dbError;
  }

  if (parentTypeName === 'Query' && fieldName === 'fetchHaseebAsset') {
    const asset = await Asset.findOne({ 
      where: { 
        id: args.id,
        userId: currentUserId
      } 
    });
    return formatAsset(asset);
  }

  if (parentTypeName === 'Query' && fieldName === 'listHaseebAssets') {
    let filterObj = {};
    if (args.filter) {
      if (typeof args.filter === 'string') {
        try {
          filterObj = JSON.parse(args.filter);
        } catch (e) {
          filterObj = args.filter; 
        }
      } else {
        filterObj = args.filter;
      }
    }
    
    const whereClause = {
      ...translateFilter(filterObj),
      userId: currentUserId
    };
    
    const assets = await Asset.findAll({ where: whereClause });
    return { items: assets.map((a: any) => formatAsset(a)) };
  }

  if (parentTypeName === 'Mutation' && fieldName === 'createHaseebAsset') {
    const now = new Date().toISOString();
    const createInput = { ...args.input };
    delete createInput.imageUrl;
    const newAsset = await Asset.create({
      id: uuidv4(),
      ...createInput,
      userId: currentUserId,
      createdAt: now,
      updatedAt: now,
    });
    return formatAsset(newAsset);
  }

  if (parentTypeName === 'Mutation' && fieldName === 'updateHaseebAsset') {
    const id = args.input.id;
    const input = { ...args.input };
    delete input.id;
    delete input.userId;
    delete input.imageUrl;
    input.updatedAt = new Date().toISOString();
    
    const asset: any = await Asset.findOne({ 
      where: { 
        id: id,
        userId: currentUserId
      } 
    });
    
    if (!asset) throw new Error(`Asset ${id} not found or access denied`);
    const updated = await asset.update(input);
    return formatAsset(updated);
  }

  if (parentTypeName === 'Mutation' && fieldName === 'deleteHaseebAsset') {
    const id = args.input.id;
    const asset: any = await Asset.findOne({ 
      where: { 
        id: id,
        userId: currentUserId
      } 
    });
    
    if (!asset) throw new Error(`Asset ${id} not found or access denied`);
    await asset.destroy();
    return formatAsset(asset);
  }

  throw new Error(`Unsupported operation: ${parentTypeName}.${fieldName}`);
};
