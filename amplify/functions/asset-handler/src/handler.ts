import { v4 as uuidv4 } from 'uuid';
import { translateFilterToSql, formatAsset } from './utils';
import mysql from 'mysql2/promise';

export const handler = async (event: any, _context: any) => {
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

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    connectTimeout: 10000,
  });

  const identity = event.identity || {};
  const currentUserId = identity.sub || identity.username || 'unknown';
  const TABLE_NAME = 'haseeb_asset_info';

  try {
    if (parentTypeName === 'Query' && fieldName === 'fetchHaseebAsset') {
      const [rows]: any = await connection.execute(
        `SELECT * FROM ${TABLE_NAME} WHERE id = ? AND userId = ?`,
        [args.id, currentUserId]
      );
      return formatAsset(rows[0]);
    }

    if (parentTypeName === 'Query' && fieldName === 'listHaseebAssets') {
      let filterObj = {};
      if (args.filter) {
        if (typeof args.filter === 'string') {
          try {
            filterObj = JSON.parse(args.filter);
          } catch (_e) {
            filterObj = args.filter; 
          }
        } else {
          filterObj = args.filter;
        }
      }
      
      const { whereSql, values } = translateFilterToSql(filterObj);
      const sql = `SELECT * FROM ${TABLE_NAME} WHERE userId = ?${whereSql}`;
      const [rows]: any = await connection.execute(sql, [currentUserId, ...values]);
      
      return { items: rows.map((a: any) => formatAsset(a)) };
    }

    if (parentTypeName === 'Mutation' && fieldName === 'createHaseebAsset') {
      const now = new Date().toISOString();
      const id = uuidv4();
      const input = { ...args.input };
      delete input.imageUrl;
      delete input.id;
      delete input.userId;

      const columns = ['id', 'userId', 'createdAt', 'updatedAt', ...Object.keys(input)];
      const placeholders = columns.map(() => '?').join(', ');
      const values = [id, currentUserId, now, now, ...Object.values(input)];

      const sql = `INSERT INTO ${TABLE_NAME} (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;
      await connection.execute(sql, values);

      const [rows]: any = await connection.execute(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]);
      return formatAsset(rows[0]);
    }

    if (parentTypeName === 'Mutation' && fieldName === 'updateHaseebAsset') {
      const id = args.input.id;
      const input = { ...args.input };
      delete input.id;
      delete input.userId;
      delete input.imageUrl;
      const now = new Date().toISOString();
      input.updatedAt = now;

      const setSegments = Object.keys(input).map(key => `\`${key}\` = ?`).join(', ');
      const values = [...Object.values(input), id, currentUserId];

      const sql = `UPDATE ${TABLE_NAME} SET ${setSegments} WHERE id = ? AND userId = ?`;
      const [result]: any = await connection.execute(sql, values);

      if (result.affectedRows === 0) {
        throw new Error(`Asset ${id} not found or access denied`);
      }

      const [rows]: any = await connection.execute(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]);
      return formatAsset(rows[0]);
    }

    if (parentTypeName === 'Mutation' && fieldName === 'deleteHaseebAsset') {
      const id = args.input.id;
      
      const [rows]: any = await connection.execute(
        `SELECT * FROM ${TABLE_NAME} WHERE id = ? AND userId = ?`,
        [id, currentUserId]
      );
      
      if (rows.length === 0) {
        throw new Error(`Asset ${id} not found or access denied`);
      }

      await connection.execute(`DELETE FROM ${TABLE_NAME} WHERE id = ? AND userId = ?`, [id, currentUserId]);
      return formatAsset(rows[0]);
    }

    throw new Error(`Unsupported operation: ${parentTypeName}.${fieldName}`);
  } catch (err: any) {
    console.error('Operation failed:', err);
    throw err;
  } finally {
    await connection.end();
  }
};
