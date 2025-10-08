// src/app/api/actores/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// === POST: insertar varios actores de un caso ===
export async function POST(req) {
  try {
    const { id_caso, actores } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso no proporcionado" }, { status: 400 });
    }

    if (!Array.isArray(actores) || actores.length === 0) {
      return NextResponse.json({ error: "No hay actores para guardar" }, { status: 400 });
    }

    const { error } = await supabase
      .from("actores")
      .insert(
        actores.map((actor) => ({
          id_caso,
          rol: actor.rol,
          nombre_completo: actor.nombre_completo,
          tipo_documento: actor.tipo_documento,
          documento_id: actor.documento_id,
          nombre_acudiente: actor.nombre_acudiente || null,
          telefono_acudiente: actor.telefono_acudiente || null,
          email_acudiente: actor.email_acudiente || null,
        }))
      );

    if (error) {
      console.error("Error al guardar actores:", error);
      return NextResponse.json({ error: "Error al guardar actores" }, { status: 500 });
    }

    return NextResponse.json({ message: "Actores guardados exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Excepción en POST actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// === GET: obtener todos los actores ===
export async function GET() {
  try {
    const { data, error } = await supabase.from("actores").select("*");

    if (error) {
      console.error("Error al obtener actores:", error);
      return NextResponse.json({ error: "Error al obtener los actores" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Excepción en GET actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// === PUT: actualizar un actor específico ===
export async function PUT(request) {
  try {
    const {
      id_caso,
      documento_id,
      rol,
      nombre_completo,
      tipo_documento,
      nombre_acudiente,
      telefono_acudiente,
      email_acudiente,
    } = await request.json();

    if (!id_caso || !documento_id) {
      return NextResponse.json(
        { error: "Faltan campos clave: id_caso o documento_id" },
        { status: 400 }
      );
    }

    const { error, data } = await supabase
      .from("actores")
      .update({
        rol,
        nombre_completo,
        tipo_documento,
        nombre_acudiente: nombre_acudiente || null,
        telefono_acudiente: telefono_acudiente || null,
        email_acudiente: email_acudiente || null,
      })
      .eq("id_caso", id_caso)
      .eq("documento_id", documento_id)
      .select(); // devuelve filas afectadas

    if (error) {
      console.error("Error al actualizar actor:", error);
      return NextResponse.json({ error: "Error al actualizar actor" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Actor no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Actor actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Excepción en PUT actores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
