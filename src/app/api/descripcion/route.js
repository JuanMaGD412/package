import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📌 POST: insertar una nueva descripción
export async function POST(req) {
  try {
    const { id_caso, version_estudiante_vinculado, version_estudiante_implicado, version_testigos } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const { error } = await supabase.from("descripciones").insert([
      {
        id_caso,
        version_estudiante_vinculado: version_estudiante_vinculado || null,
        version_estudiante_implicado: version_estudiante_implicado || null,
        version_testigos: version_testigos || null,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Descripción guardada exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar la descripción:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 📌 GET: obtener todas las descripciones
export async function GET() {
  try {
    const { data, error } = await supabase.from("descripciones").select("*");
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las descripciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 📌 PUT: actualizar descripción por id_caso
export async function PUT(request) {
  try {
    const {
      id_caso,
      version_estudiante_vinculado,
      version_estudiante_implicado,
      version_testigos,
    } = await request.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const { error, count } = await supabase
      .from("descripciones")
      .update({
        version_estudiante_vinculado: version_estudiante_vinculado || null,
        version_estudiante_implicado: version_estudiante_implicado || null,
        version_testigos: version_testigos || null,
      })
      .eq("id_caso", id_caso)
      .select("*", { count: "exact" });

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json(
        { error: "Descripción no encontrada para este ID de caso" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Descripción actualizada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la descripción:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
