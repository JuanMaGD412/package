import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Conexión a la BD

export async function POST(req) {
    try {
        const { id_caso, version_estudiante_afectado, version_estudiante_implicado, version_testigos } = await req.json();

        if (!id_caso) {
            return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
        }

        const sql = `
            INSERT INTO descripciones 
            (id_caso, version_estudiante_afectado, version_estudiante_implicado, version_testigos) 
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            id_caso, 
            version_estudiante_afectado || null, 
            version_estudiante_implicado || null, 
            version_testigos || null
        ]);

        return NextResponse.json({ 
            message: "Descripción guardada exitosamente", 
            affectedRows: result.affectedRows 
        }, { status: 201 });

    } catch (error) {
        console.error("Error al guardar la descripción:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM descripciones");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
