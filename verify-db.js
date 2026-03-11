import pkg from 'sequelize';
const { Sequelize } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { 
  DB_HOST: host, 
  DB_USER: user, 
  DB_PASSWORD: password, 
  DB_NAME: database 
} = process.env;

console.log(`Connecting to AWS RDS: ${host}...`);

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000
  }
});

async function verify() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to AWS RDS successfully.');
    
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', results);
    
    try {
      const [assets] = await sequelize.query('SELECT * FROM haseeb_asset_info LIMIT 5');
      console.log('Recent Assets in RDS (haseeb_asset_info):', assets);
    } catch (tableError) {
      console.log('⚠️  Table "haseeb_asset_info" does not exist yet. This is expected if the first deployment is still pending.');
    }
    
    try {
      const [oldAssets] = await sequelize.query('SELECT * FROM assets LIMIT 5');
      console.log('Recent Assets in RDS (old "assets" table):', oldAssets);
    } catch (e) {
      console.log('old table might be gone or not exist');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
}

verify();
