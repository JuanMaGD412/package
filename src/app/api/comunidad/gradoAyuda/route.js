import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    // Seleccionar los grados distintos que no sean nulos
    const { data, error } = await supabase
      .from("comunidad")
      .select("grado")
      .not("grado", "is", null);

    if (error) {
      console.error("Error al obtener grados:", error);
      return NextResponse.json(
        { error: "Error al obtener los grados" },
        { status: 500 }
      );
    }

    // Eliminar duplicados usando un Set
    const gradosUnicos = [...new Set(data.map((row) => row.grado))];

    return NextResponse.json(gradosUnicos, { status: 200 });
  } catch (error) {
    console.error("Excepción al obtener grados:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
