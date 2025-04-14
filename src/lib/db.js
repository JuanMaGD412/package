import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'db.mepqgipnicweghojgycb.supabase.co',
  user: 'postgres',
  password: 'libroverde412',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
});

export default pool;
