import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";


export async function GET(req, { params }) {
  const documento = params.documento;

  try {
    // 1. Trae los datos del estudiante
// 1. Trae los datos del estudiante
    const estudianteRes = await pool.query(
      `SELECT 
        documentoid, nombre, apellido1, apellido2, grado, 
        nombreacudiente, apellido1acudiente, apellido2acudiente,
        telefonoacudiente, emailacudiente, ruta_foto
      FROM comunidad
      WHERE documentoid = $1`,
      [documento]
    );


    if (estudianteRes.rows.length === 0) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const est = estudianteRes.rows[0];

    // 2. Construye nombre y datos
    const estudiante = {
      documentoid: est.documentoid,
      nombre_completo: `${est.nombre} ${est.apellido1 || ""} ${est.apellido2 || ""}`.trim(),
      grado: est.grado,
      acudiente: {
        nombre_completo: `${est.nombreacudiente || ""} ${est.apellido1acudiente || ""} ${est.apellido2acudiente || ""}`.trim(),
        telefono: est.telefonoacudiente || "",
        emailacudiente: est.emailacudiente || "",
      },
      foto_url: null
    };


    // 3. Obtener URL pública de Supabase
    if (est.ruta_foto) {
      const { data } = supabase.storage.from("fotoscomunidad").getPublicUrl(est.ruta_foto);
      estudiante.foto_url = data.publicUrl;
    }

    // 4. Traer los casos relacionados
    const casosRes = await pool.query(
      `SELECT ca.*, 
              d.version_estudiante_vinculado, 
              a.rol
       FROM casos ca
       INNER JOIN actores a ON ca.id_caso = a.id_caso
       LEFT JOIN descripciones d ON ca.id_caso = d.id_caso
       WHERE a.documento_id = $1
       ORDER BY ca.fecha_caso ASC`,
      [documento]
    );

    const casos = casosRes.rows.map((row) => ({
      id_caso: row.id_caso,
      fecha_caso: row.fecha_caso,
      tipo_caso: row.tipo_caso,
      estado: row.estado,
      es_confidencial: row.es_confidencial,
      descripcion: row.version_estudiante_vinculado,
      rol: row.rol,
    }));

    return NextResponse.json({ estudiante, casos }, { status: 200 });
  } catch (error) {
    console.error("Error en la API de estudiante:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
