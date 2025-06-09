import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { id_caso, version_estudiante_vinculado, version_estudiante_implicado, version_testigos } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const sql = `
      INSERT INTO descripciones 
      (id_caso, version_estudiante_vinculado, version_estudiante_implicado, version_testigos) 
      VALUES ($1, $2, $3, $4)
    `;

    const result = await pool.query(sql, [
      id_caso,
      version_estudiante_vinculado || null,
      version_estudiante_implicado || null,
      version_testigos || null
    ]);

    return NextResponse.json({ 
      message: "Descripción guardada exitosamente", 
      rowCount: result.rowCount 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar la descripción:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM descripciones");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las descripciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const {
      id_caso,
      version_estudiante_vinculado,
      version_estudiante_implicado,
      version_testigos
    } = await request.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const query = `
      UPDATE descripciones
      SET version_estudiante_vinculado = $2,
          version_estudiante_implicado = $3,
          version_testigos = $4
      WHERE id_caso = $1
    `;

    const values = [
      id_caso,
      version_estudiante_vinculado || null,
      version_estudiante_implicado || null,
      version_testigos || null
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Descripción no encontrada para este ID de caso" }, { status: 404 });
    }

    return NextResponse.json({ message: "Descripción actualizada exitosamente" }, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar la descripción:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
