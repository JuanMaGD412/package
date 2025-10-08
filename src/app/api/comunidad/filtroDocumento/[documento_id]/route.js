import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, { params }) {
  const { documento_id } = params;

  if (!documento_id) {
    return NextResponse.json(
      { message: "Debe proporcionar un documento_id" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("comunidad")
      .select("nombre, grado, foto")
      .eq("documentoid", documento_id)
      .maybeSingle(); // trae 1 fila o null

    if (error) {
      console.error("Error en la consulta de comunidad:", error);
      return NextResponse.json(
        { message: "Error al consultar la base de datos" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Estudiante no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Excepción al obtener el estudiante:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
