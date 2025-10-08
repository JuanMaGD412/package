// src/app/api/casos/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// === POST: insertar nuevo caso ===
export async function POST(req) {
  try {
    const { Id_Caso, fecha_caso, tipo_caso, es_confidencial } = await req.json();

    if (!Id_Caso || !fecha_caso || !tipo_caso) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("casos")
      .insert([
        {
          id_caso: Id_Caso,
          fecha_caso,
          tipo_caso,
          es_confidencial: es_confidencial === "true" || es_confidencial === true ? 1 : 0,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error al guardar el caso:", error);
      return NextResponse.json({ error: "Error al guardar el caso" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Caso guardado exitosamente", insertId: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Excepción al guardar el caso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// === GET: obtener todos los casos ===
export async function GET() {
  try {
    const { data, error } = await supabase.from("casos").select("*");

    if (error) {
      console.error("Error al obtener los casos:", error);
      return NextResponse.json({ error: "Error al obtener los casos" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Excepción al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// === PUT: actualizar un caso existente ===
export async function PUT(request) {
  try {
    const { id_caso, fecha_caso, tipo_caso, es_confidencial } = await request.json();

    if (!id_caso) {
      return NextResponse.json({ error: "Falta el ID del caso" }, { status: 400 });
    }

    const { error, data } = await supabase
      .from("casos")
      .update({
        fecha_caso,
        tipo_caso,
        es_confidencial:
          es_confidencial === "true" || es_confidencial === true ? 1 : 0,
      })
      .eq("id_caso", id_caso)
      .select();

    if (error) {
      console.error("Error al actualizar el caso:", error);
      return NextResponse.json({ error: "Error al actualizar el caso" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Caso actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Excepción al actualizar el caso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
