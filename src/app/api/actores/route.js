import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Conexión a la BD

export async function POST(req) {
  try {
    const { id_caso, actores } = await req.json();

    if (!id_caso) throw new Error("ID del caso no proporcionado");
    if (!actores.length) throw new Error("No hay actores para guardar");

    const values = actores.map(actor => [
      id_caso,
      actor.rol,
      actor.nombre_completo,
      actor.tipo_documento,
      actor.documento_id,
      actor.nombre_acudiente || null,
      actor.telefono_acudiente || null,
      actor.email_acudiente || null,
    ]);

    const sql = `
      INSERT INTO actores 
      (Id_Caso, rol, nombre_completo, tipo_documento, documento_id, 
       nombre_acudiente, telefono_acudiente, email_acudiente) 
      VALUES ?
    `;

    const [result] = await pool.query(sql, [values]);

    return NextResponse.json({ 
      message: "Actores guardados exitosamente", 
      affectedRows: result.affectedRows 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM actores");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
