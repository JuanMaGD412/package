import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Ajusta si tu ruta es distinta

export async function POST(req) {
  const supabase = createClient();

  try {
    const { id_caso, actores } = await req.json();

    if (!id_caso) throw new Error("ID del caso no proporcionado");
    if (!actores.length) throw new Error("No hay actores para guardar");

    const actoresInsertados = actores.map((actor) => ({
      id_caso,
      rol: actor.rol,
      nombre_completo: actor.nombre_completo,
      tipo_documento: actor.tipo_documento,
      documento_id: actor.documento_id,
      nombre_acudiente: actor.nombre_acudiente || null,
      telefono_acudiente: actor.telefono_acudiente || null,
      email_acudiente: actor.email_acudiente || null,
    }));

    const { data, error } = await supabase.from("actores").insert(actoresInsertados);

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Actores guardados exitosamente",
        rowCount: data.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from("actores").select("*");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
