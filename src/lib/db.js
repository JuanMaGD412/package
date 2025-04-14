// db.js o lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

let pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
  });
}

pool = global.pgPool;

export default pool;
