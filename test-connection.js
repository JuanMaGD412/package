// test-connection.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  user: 'postgres.mepqgipnicweghojgycb',
  password: 'ProjectsJuanma412',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Conexión exitosa:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error en la conexión:', err);
  } finally {
    pool.end();
  }
}

testConnection();
