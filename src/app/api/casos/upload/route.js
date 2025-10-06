// src/app/api/casos/upload/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// parsea listas de actores en formato documento:nombre:tipo_doc:acudiente:telefono:email;...
function parseActoresList(listStr, rol, id_caso) {
  if (!listStr) return [];
  return String(listStr)
    .split(";")
    .map((item) => {
      const parts = item.split(":").map((v) => (v ? v.trim() : null));
      const [documento_id, nombre_completo, tipo_documento, nombre_acudiente, telefono_acudiente, email_acudiente] = parts;
      return {
        id_caso,
        rol,
        documento_id: documento_id || null,
        nombre_completo: nombre_completo || null,
        tipo_documento: tipo_documento || null,
        nombre_acudiente: nombre_acudiente || null,
        telefono_acudiente: telefono_acudiente || null,
        email_acudiente: email_acudiente || null,
      };
    })
    .filter((a) => a.documento_id);
}

function parseRutaActivated(v) {
  if (v === undefined || v === null) return 0;
  const s = String(v).trim().toLowerCase();
  if (["1", "true", "si", "yes", "y"].includes(s)) return 1;
  if (["0", "false", "no", "n"].includes(s)) return 0;
  // fallback: try int
  const asInt = parseInt(s, 10);
  return Number.isNaN(asInt) ? 0 : (asInt ? 1 : 0);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];

    if (!rows.length) {
      return NextResponse.json({ error: "No se enviaron filas" }, { status: 400 });
    }

    const expectedCasos = ["id_caso", "fecha_caso", "tipo_caso", "es_confidencial"];

    const invalidRows = [];
    const casosToInsert = [];
    const actoresToInsert = [];
    const descripcionesToInsert = [];
    const evidenciasToInsert = [];
    const intervencionesToInsert = [];
    const rutaAtencionToInsert = [];

    rows.forEach((r, idx) => {
      const missing = expectedCasos.filter((f) => !r[f] || String(r[f]).trim() === "");
      if (missing.length > 0) {
        invalidRows.push({ index: idx, missing });
        return;
      }

      // Caso base
      casosToInsert.push({
        id_caso: r.id_caso,
        fecha_caso: r.fecha_caso,
        tipo_caso: r.tipo_caso,
        es_confidencial: r.es_confidencial,
        estado: r.estado || "abierto",
      });

      // Actores
      actoresToInsert.push(
        ...parseActoresList(r.implicados, "implicado", r.id_caso),
        ...parseActoresList(r.vinculados, "vinculado", r.id_caso),
        ...parseActoresList(r.testigos, "testigo", r.id_caso)
      );

      // Descripciones
      if (r.version_estudiante_vinculado || r.version_estudiante_implicado || r.version_testigos) {
        descripcionesToInsert.push({
          id_caso: r.id_caso,
          version_estudiante_vinculado: r.version_estudiante_vinculado || null,
          version_estudiante_implicado: r.version_estudiante_implicado || null,
          version_testigos: r.version_testigos || null,
        });
      }

      // Evidencias
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

      // Intervenciones
      if (r.tipo_decision) {
        intervencionesToInsert.push({
          id_caso: r.id_caso,
          tipo_decision: r.tipo_decision,
          decision_comite: r.decision_comite || "",
          compromisos: r.compromisos || "",
          fecha_compromiso: r.fecha_compromiso || null,
        });
      }

      // Ruta de atención (si se envió alguno de los campos)
      const hasRuta =
        r.ruta_activada ||
        r.tipo_remision ||
        r.fecha_ruta ||
        r.fecha ||
        r.remitido ||
        r.institucion ||
        r.contacto ||
        r.observaciones;

      if (hasRuta) {
        rutaAtencionToInsert.push({
          id_caso: r.id_caso,
          ruta_activada: parseRutaActivated(r.ruta_activada),
          tipo_remision: r.tipo_remision || null,
          // en CSV puedes usar 'fecha_ruta' o 'fecha' y será mapeado a la columna fecha en la tabla
          fecha: r.fecha_ruta || r.fecha || null,
          remitido: r.remitido || null,
          institucion: r.institucion || null,
          contacto: r.contacto || null,
          observaciones: r.observaciones || null,
        });
      }
    });

    if (invalidRows.length > 0) {
      return NextResponse.json({ error: "Algunas filas inválidas", invalidRows }, { status: 400 });
    }

    // Inserción por lotes
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
          inserted += Array.isArray(res) ? res.length : 0;
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
    insertedResults.ruta_atencion = await batchInsert("ruta_atencion", rutaAtencionToInsert);

    return NextResponse.json({
      resumen: insertedResults,
      totalCasos: casosToInsert.length,
      preview: casosToInsert.slice(0, 20),
    });
  } catch (err) {
    console.error("Upload exception:", err);
    return NextResponse.json({ error: "Error en servidor", detail: String(err) }, { status: 500 });
  }
}
