import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id_caso = formData.get("id_caso");

    if (!id_caso) throw new Error("ID del caso no proporcionado");

    const evidencias = [];
    let index = 0;

    while (formData.has(`evidencias[${index}][description]`)) {
      const description = formData.get(`evidencias[${index}][description]`);
      const file = formData.get(`evidencias[${index}][file]`);
      const size = formData.get(`evidencias[${index}][size]`);

      if (!description || !file || !(file instanceof Blob)) {
        throw new Error("Datos de evidencia incompletos o incorrectos");
      }

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      evidencias.push([id_caso, description, fileBuffer, file.type, size]);
      index++;
    }

    if (!evidencias.length) throw new Error("No hay evidencias para guardar");

    const sql = `
      INSERT INTO evidencias (id_caso, descripcion, archivo, tipo_archivo, tamano_archivo) 
      VALUES ?
    `;

    const [result] = await pool.query(sql, [evidencias]);

    return NextResponse.json({
      message: "Evidencias guardadas exitosamente",
      affectedRows: result.affectedRows
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar evidencias:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM evidencias");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}