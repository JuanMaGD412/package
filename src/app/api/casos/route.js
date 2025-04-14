import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Conexión a la BD

export async function POST(req) {
  try {
    const { Id_Caso, fecha_caso, tipo_caso, es_confidencial } = await req.json();

    // Insertar en la base de datos
    const [result] = await pool.execute(
      "INSERT INTO casos (Id_Caso, fecha_caso, tipo_caso, es_confidencial) VALUES (?, ?, ?, ?)",
      [Id_Caso, fecha_caso, tipo_caso, es_confidencial === "true"]
    );

    return NextResponse.json({ message: "Caso guardado exitosamente", insertId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar el caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


export async function GET_LAST_ID() {
  try {
    const [rows] = await pool.query("SELECT Id_Caso FROM casos ORDER BY id DESC LIMIT 1");
    const lastId = rows.length > 0 ? rows[0].Id_Caso : null;
    return NextResponse.json({ lastId });
  } catch (error) {
    console.error("Error al obtener el último Id_Caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM casos");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
