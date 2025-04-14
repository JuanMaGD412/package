import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import pool from "../../../lib/db"; 

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    const user = rows[0];

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
