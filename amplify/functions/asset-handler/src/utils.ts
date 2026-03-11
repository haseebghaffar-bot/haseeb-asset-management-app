
export function translateFilterToSql(filter: any) {
  if (!filter || typeof filter !== 'object') return { whereSql: '', values: [] };
  
  const segments: string[] = [];
  const values: any[] = [];
  
  for (const key in filter) {
    const value = filter[key];
    if (value && typeof value === 'object') {
      if ('eq' in value) {
        segments.push(`\`${key}\` = ?`);
        values.push(value.eq);
      } else if ('ne' in value) {
        segments.push(`\`${key}\` != ?`);
        values.push(value.ne);
      } else if ('contains' in value) {
        segments.push(`\`${key}\` LIKE ?`);
        values.push(`%${value.contains}%`);
      } else if ('between' in value) {
        if (Array.isArray(value.between) && value.between.length === 2) {
          segments.push(`\`${key}\` BETWEEN ? AND ?`);
          values.push(value.between[0], value.between[1]);
        }
      } else if ('beginsWith' in value) {
        segments.push(`\`${key}\` LIKE ?`);
        values.push(`${value.beginsWith}%`);
      }
    } else {
      segments.push(`\`${key}\` = ?`);
      values.push(value);
    }
  }
  
  return {
    whereSql: segments.length > 0 ? ' AND ' + segments.join(' AND ') : '',
    values
  };
}

export function safeIsoDate(val: any): string | null {
  if (!val) return null;
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return String(val);
    return date.toISOString();
  } catch (_e) {
    return String(val);
  }
}

export function formatAsset(asset: any) {
  if (!asset) return null;
  try {
    const data = { ...asset };
    
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
