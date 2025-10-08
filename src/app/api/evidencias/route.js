import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📌 POST: subir evidencias al Storage y guardar en la tabla
export async function POST(req) {
  try {
    const formData = await req.formData();
    const id_caso = formData.get("id_caso");

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

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
        rutaArchivo = data.path;
      }

      evidencias.push({
        id_caso,
        descripcion: description,
        nombre_archivo: nombreArchivo,
        tipo_archivo: tipoArchivo,
        tamano_archivo: size,
        ruta_archivo: rutaArchivo,
      });

      index++;
    }

    if (evidencias.length === 0) {
      return NextResponse.json({ message: "No hay evidencias para guardar" }, { status: 200 });
    }

    const { error } = await supabase.from("evidencias").insert(evidencias);
    if (error) throw error;

    return NextResponse.json({ message: "Evidencias subidas a Storage y guardadas" }, { status: 201 });
  } catch (error) {
    console.error("Error al subir evidencias:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 GET: obtener todas las evidencias con URLs firmadas
export async function GET() {
  try {
    const { data: evidencias, error } = await supabase.from("evidencias").select("*");
    if (error) throw error;

    const signedEvidencias = await Promise.all(
      evidencias.map(async (e) => {
        let url = null;

        if (e.ruta_archivo) {
          const { data, error } = await supabase.storage
            .from("evidencias")
            .createSignedUrl(e.ruta_archivo, 3600); // 1 hora

          if (error) {
            console.error("Error al generar URL firmada:", error);
          } else {
            url = data?.signedUrl;
          }
        }

        return { ...e, url_archivo: url };
      })
    );

    return NextResponse.json(signedEvidencias, { status: 200 });
  } catch (error) {
    console.error("Error al obtener evidencias:", error);
    return NextResponse.json({ error: "Error al obtener evidencias" }, { status: 500 });
  }
}

// 📌 PUT: actualizar evidencia por id_evidencia
export async function PUT(request) {
  try {
    const { id_evidencia, id_caso, tipo_archivo, url_archivo } = await request.json();

    if (!id_evidencia) {
      return NextResponse.json({ error: "Falta el ID de la evidencia" }, { status: 400 });
    }

    const { error, count } = await supabase
      .from("evidencias")
      .update({
        id_caso,
        tipo_archivo,
        url_archivo,
      })
      .eq("id_evidencia", id_evidencia)
      .select("*", { count: "exact" });

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json({ error: "Evidencia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Evidencia actualizada exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la evidencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
