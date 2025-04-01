import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Conexión a la BD

export async function POST(req) {
  try {
    const { id_caso, ruta_activada, tipo_remision, fecha, remitido, institucion, contacto, observaciones } = await req.json();

    // Convertir `ruta_activada` a número (0 o 1)
    const ruta_activada_num = ruta_activada ? 1 : 0;

    const [result] = await pool.execute(
      "INSERT INTO ruta_atencion (id_caso, ruta_activada, tipo_remision, fecha, remitido, institucion, contacto, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id_caso, ruta_activada_num, tipo_remision, fecha, remitido, institucion, contacto, observaciones]
    );

    return NextResponse.json({ message: "Ruta de atención guardada exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar la ruta de atención:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
