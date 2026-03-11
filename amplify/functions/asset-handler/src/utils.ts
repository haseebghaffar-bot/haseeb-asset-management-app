import { Op } from 'sequelize';

export function translateFilter(filter: any) {
  if (!filter || typeof filter !== 'object') return {};
  const where: any = {};
  for (const key in filter) {
    const value = filter[key];
    if (value && typeof value === 'object') {
      if ('eq' in value) where[key] = value.eq;
      else if ('ne' in value) where[key] = { [Op.ne]: value.ne };
      else if ('contains' in value) where[key] = { [Op.like]: `%${value.contains}%` };
      else if ('between' in value) where[key] = { [Op.between]: value.between };
      else if ('beginsWith' in value) where[key] = { [Op.like]: `${value.beginsWith}%` };
    } else {
      where[key] = value;
    }
  }
  return where;
}

export function safeIsoDate(val: any): string | null {
  if (!val) return null;
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return String(val);
    return date.toISOString();
  } catch (e) {
    return String(val);
  }
}

export function formatAsset(asset: any) {
  if (!asset) return null;
  try {
    const data = typeof asset.toJSON === 'function' ? asset.toJSON() : asset;
    
    if (data.purchaseDate) {
      const val = data.purchaseDate;
      const dateStr = val instanceof Date ? val.toISOString() : String(val);
      data.purchaseDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    }

    ['createdAt', 'updatedAt'].forEach(key => {
      if (data[key]) {
        data[key] = safeIsoDate(data[key]);
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error formatting asset:', error);
    return { 
      id: asset.id || 'unknown', 
      name: asset.name || 'Error Formatting',
      category: asset.category || 'Other'
    };
  }
}
