import { NextResponse } from "next/server";
import pool from "../../../../lib/db"; 

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT Id_Caso FROM casos ORDER BY id DESC LIMIT 1");
    const lastId = rows.length > 0 ? rows[0].Id_Caso : null;
    return NextResponse.json({ lastId });
  } catch (error) {
    console.error("Error al obtener el último Id_Caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
