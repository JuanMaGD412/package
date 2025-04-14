import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { id_caso, ruta_activada, tipo_remision, fecha, remitido, institucion, contacto, observaciones } = await req.json();

    const ruta_activada_num = ruta_activada ? 1 : 0;

    const sql = `
      INSERT INTO ruta_atencion 
      (id_caso, ruta_activada, tipo_remision, fecha, remitido, institucion, contacto, observaciones) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const result = await pool.query(sql, [
      id_caso,
      ruta_activada_num,
      tipo_remision,
      fecha,
      remitido,
      institucion,
      contacto,
      observaciones
    ]);

    return NextResponse.json({ message: "Ruta de atención guardada exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar la ruta de atención:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM ruta_atencion");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
