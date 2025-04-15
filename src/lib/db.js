// lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

let pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
  });
  global.pgPool = pool;
} else {
  pool = global.pgPool;
}

export default pool;
