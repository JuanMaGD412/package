import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { id_caso, actores } = await req.json();

    if (!id_caso) throw new Error("ID del caso no proporcionado");
    if (!actores.length) throw new Error("No hay actores para guardar");

    const values = [];
    const placeholders = [];

    actores.forEach((actor, index) => {
      const offset = index * 8;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`);

      values.push(
        id_caso,
        actor.rol,
        actor.nombre_completo,
        actor.tipo_documento,
        actor.documento_id,
        actor.nombre_acudiente || null,
        actor.telefono_acudiente || null,
        actor.email_acudiente || null
      );
    });

    const sql = `
      INSERT INTO actores 
      (id_caso, rol, nombre_completo, tipo_documento, documento_id, 
       nombre_acudiente, telefono_acudiente, email_acudiente) 
      VALUES ${placeholders.join(", ")}
    `;

    const result = await pool.query(sql, values);

    return NextResponse.json({ 
      message: "Actores guardados exitosamente", 
      rowCount: result.rowCount 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM actores");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const {
      id_caso,
      documento_id,
      rol,
      nombre_completo,
      tipo_documento,
      nombre_acudiente,
      telefono_acudiente,
      email_acudiente
    } = await request.json();

    if (!id_caso || !documento_id) {
      return NextResponse.json({ error: 'Faltan campos clave: id_caso o documento_id' }, { status: 400 });
    }

    const query = `
      UPDATE actores
      SET rol = $3,
          nombre_completo = $4,
          tipo_documento = $5,
          nombre_acudiente = $6,
          telefono_acudiente = $7,
          email_acudiente = $8
      WHERE id_caso = $1 AND documento_id = $2
    `;

    const values = [
      id_caso,
      documento_id,
      rol,
      nombre_completo,
      tipo_documento,
      nombre_acudiente || null,
      telefono_acudiente || null,
      email_acudiente || null
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Actor no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Actor actualizado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar el actor:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
