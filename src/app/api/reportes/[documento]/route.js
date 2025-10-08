import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, { params }) {
  const documento = params.documento;

  try {
    // 1️⃣ Buscar al estudiante en la tabla "comunidad"
    const { data: estudianteData, error: estudianteError } = await supabase
      .from("comunidad")
      .select(
        `
        documentoid,
        nombre,
        apellido1,
        apellido2,
        grado,
        nombreacudiente,
        apellido1acudiente,
        apellido2acudiente,
        telefonoacudiente,
        emailacudiente,
        ruta_foto
      `
      )
      .eq("documentoid", documento)
      .maybeSingle();

    if (estudianteError) throw estudianteError;
    if (!estudianteData)
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 }
      );

    const est = estudianteData;

    // 2️⃣ Construcción de objeto del estudiante
    const estudiante = {
      documentoid: est.documentoid,
      nombre_completo: `${est.nombre ?? ""} ${est.apellido1 ?? ""} ${
        est.apellido2 ?? ""
      }`.trim(),
      grado: est.grado,
      acudiente: {
        nombre_completo: `${est.nombreacudiente ?? ""} ${
          est.apellido1acudiente ?? ""
        } ${est.apellido2acudiente ?? ""}`.trim(),
        telefono: est.telefonoacudiente ?? "",
        emailacudiente: est.emailacudiente ?? "",
      },
      foto_url: null,
    };

    // 3️⃣ Obtener URL pública de Supabase Storage si tiene foto
    if (est.ruta_foto) {
      const { data: foto } = supabase.storage
        .from("fotoscomunidad")
        .getPublicUrl(est.ruta_foto);
      estudiante.foto_url = foto.publicUrl;
    }

    // 4️⃣ Obtener casos relacionados con el estudiante
    //    (usando joins manuales porque Supabase no hace INNER JOIN entre tablas arbitrarias en cliente)
    const { data: actores, error: actoresError } = await supabase
      .from("actores")
      .select("id_caso, rol")
      .eq("documento_id", documento);

    if (actoresError) throw actoresError;

    let casos = [];
    if (actores.length > 0) {
      const idsCasos = actores.map((a) => a.id_caso);

      // Obtener detalles de los casos
      const { data: casosData, error: casosError } = await supabase
        .from("casos")
        .select("id_caso, fecha_caso, tipo_caso, estado, es_confidencial")
        .in("id_caso", idsCasos)
        .order("fecha_caso", { ascending: true });

      if (casosError) throw casosError;

      // Obtener descripciones relacionadas
      const { data: descData, error: descError } = await supabase
        .from("descripciones")
        .select("id_caso, version_estudiante_vinculado");

      if (descError) throw descError;

      // Combinar datos
      casos = casosData.map((c) => {
        const actor = actores.find((a) => a.id_caso === c.id_caso);
        const desc = descData.find((d) => d.id_caso === c.id_caso);
        return {
          id_caso: c.id_caso,
          fecha_caso: c.fecha_caso,
          tipo_caso: c.tipo_caso,
          estado: c.estado,
          es_confidencial: c.es_confidencial,
          descripcion: desc?.version_estudiante_vinculado || "",
          rol: actor?.rol || "",
        };
      });
    }

    // 5️⃣ Respuesta final
    return NextResponse.json({ estudiante, casos }, { status: 200 });
  } catch (error) {
    console.error("Error en la API de estudiante:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
