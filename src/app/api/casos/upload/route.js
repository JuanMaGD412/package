// src/app/api/casos/upload/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];

    if (!rows.length) {
      return NextResponse.json(
        { error: "No se enviaron filas" },
        { status: 400 }
      );
    }

    // Campos esperados en el CSV mínimo para 'casos'
    const expectedCasos = ["id_caso", "fecha_caso", "tipo_caso", "es_confidencial"];

    const invalidRows = [];
    const casosToInsert = [];
    const actoresToInsert = [];
    const descripcionesToInsert = [];
    const evidenciasToInsert = [];
    const intervencionesToInsert = [];

    rows.forEach((r, idx) => {
      const missing = [];
      for (const f of expectedCasos) {
        if (!r[f] || String(r[f]).trim() === "") missing.push(f);
      }

      if (missing.length > 0) {
        invalidRows.push({ index: idx, missing });
      } else {
        // Caso base
        casosToInsert.push({
          id_caso: r.id_caso,
          fecha_caso: r.fecha_caso,
          tipo_caso: r.tipo_caso,
          es_confidencial: r.es_confidencial,
          estado: r.estado || "abierto",
        });

        // Si trae actor
        if (r.documento_id) {
          actoresToInsert.push({
            id_caso: r.id_caso,
            rol: r.rol || null,
            nombre_completo: r.nombre_completo || null,
            tipo_documento: r.tipo_documento,
            documento_id: r.documento_id,
            nombre_acudiente: r.nombre_acudiente || null,
            telefono_acudiente: r.telefono_acudiente || null,
            email_acudiente: r.email_acudiente || null,
          });
        }

        // Si trae descripciones
        if (r.version_estudiante_vinculado || r.version_estudiante_implicado || r.version_testigos) {
          descripcionesToInsert.push({
            id_caso: r.id_caso,
            version_estudiante_vinculado: r.version_estudiante_vinculado || null,
            version_estudiante_implicado: r.version_estudiante_implicado || null,
            version_testigos: r.version_testigos || null,
          });
        }

        // Si trae evidencias
        if (r.nombre_archivo) {
          evidenciasToInsert.push({
            id_caso: r.id_caso,
            descripcion: r.descripcion || null,
            nombre_archivo: r.nombre_archivo,
            tipo_archivo: r.tipo_archivo || null,
            tamano_archivo: r.tamano_archivo || null,
            ruta_archivo: r.ruta_archivo || null,
          });
        }

        // Si trae intervenciones
        if (r.tipo_decision) {
          intervencionesToInsert.push({
            id_caso: r.id_caso,
            tipo_decision: r.tipo_decision,
            decision_comite: r.decision_comite || "",
            compromisos: r.compromisos || "",
            fecha_compromiso: r.fecha_compromiso || null,
          });
        }
      }
    });

    if (invalidRows.length > 0) {
      return NextResponse.json(
        { error: "Algunas filas inválidas", invalidRows },
        { status: 400 }
      );
    }

    // Insertar con batches
    async function batchInsert(table, data) {
      if (!data.length) return { inserted: 0, errors: [] };
      const BATCH_SIZE = 200;
      let inserted = 0;
      const errors = [];

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const { data: res, error } = await supabase.from(table).insert(batch).select();
        if (error) {
          console.error(`Error al insertar en ${table}:`, error);
          errors.push({ table, batchStart: i, error: error.message || error });
        } else {
          inserted += res.length;
        }
      }
      return { inserted, errors };
    }

    const insertedResults = {};
    insertedResults.casos = await batchInsert("casos", casosToInsert);
    insertedResults.actores = await batchInsert("actores", actoresToInsert);
    insertedResults.descripciones = await batchInsert("descripciones", descripcionesToInsert);
    insertedResults.evidencias = await batchInsert("evidencias", evidenciasToInsert);
    insertedResults.intervenciones = await batchInsert("intervenciones", intervencionesToInsert);

    return NextResponse.json({
      resumen: insertedResults,
      totalCasos: casosToInsert.length,
      preview: casosToInsert.slice(0, 20), // Para mostrar en tabla frontend
    });
  } catch (err) {
    console.error("Upload exception:", err);
    return NextResponse.json(
      { error: "Error en servidor", detail: String(err) },
      { status: 500 }
    );
  }
}
