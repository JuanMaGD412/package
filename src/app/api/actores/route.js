import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Conexión a la BD

export async function POST(req) {
  try {
    const { id_caso, actores } = await req.json();

    console.log("ID del caso recibido:", id_caso); // ✅ Imprime el ID del caso

    if (!id_caso) throw new Error("ID del caso no proporcionado");
    if (!actores.length) throw new Error("No hay actores para guardar");

    // Construimos la consulta SQL de inserción múltiple
    const values = actores.map(actor => [
      id_caso,
      actor.rol,
      actor.nombre,
      actor.apellido1,
      actor.apellido2,
      actor.tipo_documento,
      actor.documento_id,
      actor.nombre_acudiente || null,
      actor.apellido1_acudiente || null,
      actor.apellido2_acudiente || null,
      actor.telefono_acudiente || null,
      actor.email_acudiente || null,
    ]);

    // Consulta para insertar múltiples filas a la vez
    const sql = `
      INSERT INTO actores 
      (Id_Caso, rol, nombre, apellido1, apellido2, tipo_documento, documento_id, 
      nombre_acudiente, apellido1_acudiente, apellido2_acudiente, telefono_acudiente, email_acudiente) 
      VALUES ?
    `;

    // Ejecutamos la consulta
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
