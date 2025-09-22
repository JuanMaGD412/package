// src/app/api/comunidad/upload/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];

    if (!rows.length) {
      return NextResponse.json({ error: "No se enviaron filas" }, { status: 400 });
    }

    // Validación rápida del servidor: asegúrate de que cada fila tenga las claves esperadas
    const expected = [
      "rol",
      "tipodocumento",
      "documentoid",
      "apellido1",
      "apellido2",
      "nombre",
      "genero",
      "rolcomunidad",
      "nombreacudiente",
      "apellido1acudiente",
      "apellido2acudiente",
      "emailacudiente",
      "telefonoacudiente",
    ];

    const invalidRows = [];
    const toInsert = [];

    rows.forEach((r, idx) => {
      const missing = [];
      for (const f of expected) {
        if (!r[f] || String(r[f]).trim() === "") missing.push(f);
      }
      if (missing.length > 0) {
        invalidRows.push({ index: idx, missing });
      } else {
        // Mapea solo campos que están en la tabla
        toInsert.push({
          ruta_foto: r.ruta_foto || null,
          rol: r.rol,
          tipodocumento: r.tipodocumento,
          documentoid: r.documentoid,
          apellido1: r.apellido1,
          apellido2: r.apellido2,
          nombre: r.nombre,
          genero: r.genero,
          rolcomunidad: r.rolcomunidad,
          nombreacudiente: r.nombreacudiente,
          apellido1acudiente: r.apellido1acudiente,
          apellido2acudiente: r.apellido2acudiente,
          emailacudiente: r.emailacudiente,
          telefonoacudiente: r.telefonoacudiente,
          grado: r.grado || null,
        });
      }
    });

    if (invalidRows.length > 0) {
      return NextResponse.json({ error: "Algunas filas inválidas", invalidRows }, { status: 400 });
    }

    // Insertar en batches (p.ej. 200 por batch)
    const BATCH_SIZE = 200;
    let inserted = 0;
    const errors = [];

    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE);

      const { data, error } = await supabase.from("comunidad").insert(batch).select();

      if (error) {
        // Registra error y continúa
        console.error("Error al insertar batch:", error);
        errors.push({ batchStart: i, error: error.message || error });
      } else {
        inserted += Array.isArray(data) ? data.length : 0;
      }
    }

    return NextResponse.json({ inserted, errors, total: toInsert.length });
  } catch (err) {
    console.error("Upload exception:", err);
    return NextResponse.json({ error: "Error en servidor", detail: String(err) }, { status: 500 });
  }
}
