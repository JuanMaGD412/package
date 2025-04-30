import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT DISTINCT grado FROM comunidad WHERE grado IS NOT NULL");
    const grados = result.rows.map(row => row.grado);
    return NextResponse.json(grados, { status: 200 });
  } catch (error) {
    console.error("Error al obtener grados:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
