import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT id_caso FROM casos ORDER BY id DESC LIMIT 1");
    const lastId = result.rows.length > 0 ? result.rows[0].id_caso : null;
    return NextResponse.json({ lastId });
  } catch (error) {
    console.error("Error al obtener el último Id_Caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
