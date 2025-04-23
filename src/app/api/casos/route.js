import { NextResponse } from "next/server";
import pool from "../../../lib/db"; 

export async function POST(req) {
  try {
    const { Id_Caso, fecha_caso, tipo_caso, es_confidencial } = await req.json();

    const result = await pool.query(
      "INSERT INTO casos (id_caso, fecha_caso, tipo_caso, es_confidencial) VALUES ($1, $2, $3, $4) RETURNING id",
      [Id_Caso, fecha_caso, tipo_caso, es_confidencial === "true" ? 1 : 0]
    );

    return NextResponse.json({ message: "Caso guardado exitosamente", insertId: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar el caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM casos");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
