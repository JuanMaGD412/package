import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  user: 'postgres.mepqgipnicweghojgycb',
  password: 'proyectos1234',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
});

export default pool;
