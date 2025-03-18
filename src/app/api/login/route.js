import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Configurar conexión a MySQL
const db = await mysql.createConnection({
    host: '127.0.0.1', // O usa 'localhost'
    user: 'root',
    password: 'Juanma412',
    database: 'libroverde',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Buscar usuario en la BD
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    const user = rows[0];

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login exitoso", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
