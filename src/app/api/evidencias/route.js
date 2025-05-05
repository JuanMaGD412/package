import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id_caso = formData.get("id_caso");

    const evidencias = [];
    let index = 0;

    while (formData.has(`evidencias[${index}][description]`)) {
      const description = formData.get(`evidencias[${index}][description]`) || "";
      const file = formData.get(`evidencias[${index}][file]`);
      const size = formData.get(`evidencias[${index}][size]`) || "";

      let nombreArchivo = "";
      let tipoArchivo = "";
      let rutaArchivo = "";

      if (file instanceof Blob && file.size > 0) {
        const ext = file.name.split(".").pop();
        nombreArchivo = file.name;
        tipoArchivo = file.type;

        const storagePath = `caso-${id_caso}/${Date.now()}-${nombreArchivo}`;
        const { data, error } = await supabase.storage
          .from("evidencias")
          .upload(storagePath, file, {
            contentType: file.type,
          });

        if (error) throw error;
        rutaArchivo = data.path; // Guarda esta ruta en la base de datos
      }

      evidencias.push([
        id_caso,
        description,
        nombreArchivo,
        tipoArchivo,
        size,
        rutaArchivo,
      ]);

      index++;
    }

    if (evidencias.length > 0) {
      const values = [];
      const placeholders = evidencias.map((_, i) => {
        const offset = i * 6;
        values.push(...evidencias[i]);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
      });

      const sql = `
        INSERT INTO evidencias 
        (id_caso, descripcion, nombre_archivo, tipo_archivo, tamano_archivo, ruta_archivo)
        VALUES ${placeholders.join(", ")}
      `;

      await pool.query(sql, values);

      return NextResponse.json({ message: "Evidencias subidas a Storage y guardadas" }, { status: 201 });
    }

    return NextResponse.json({ message: "No hay evidencias para guardar" }, { status: 200 });
  } catch (error) {
    console.error("Error al subir evidencias:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM evidencias");

    const evidencias = await Promise.all(
      rows.map(async (e) => {
        let url = null;

        if (e.ruta_archivo) {
          const { data, error } = await supabase.storage
            .from("evidencias")
            .createSignedUrl(e.ruta_archivo, 3600); // 1 hora

          if (data?.signedUrl) {
            url = data.signedUrl;
          } else {
            console.error("Error al generar URL firmada:", error);
          }
        }

        return {
          ...e,
          url_archivo: url,
        };
      })
    );

    return NextResponse.json(evidencias, { status: 200 });
  } catch (error) {
    console.error("Error al obtener evidencias:", error);
    return NextResponse.json({ error: "Error al obtener evidencias" }, { status: 500 });
  }
}
