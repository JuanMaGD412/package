import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    // 📦 Obtener todos los registros de la tabla "listas"
    const { data, error } = await supabase.from("listas").select("*");

    if (error) throw error;

    // 🧩 Reorganizar las opciones agrupadas por tipo
    const opcionesPorTipo = data.reduce((acc, row) => {
      if (!acc[row.tipo]) acc[row.tipo] = [];
      acc[row.tipo].push(row.valor);
      return acc;
    }, {});

    return NextResponse.json(opcionesPorTipo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las opciones desplegables:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
