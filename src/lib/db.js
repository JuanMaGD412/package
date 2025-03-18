import mysql from 'mysql2/promise';

// Configuración de la conexión
const pool = mysql.createPool({
  host: '127.0.0.1', // O usa 'localhost'
  user: 'root',
  password: 'Juanma412',
  database: 'libroverde',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
