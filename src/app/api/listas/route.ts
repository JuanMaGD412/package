// app/api/listas/route.ts
import { createClient } from "@/utils/supabase/server";  // Asegúrate de que este esté bien importado
import { cookies } from "next/headers";  // Importar cookies de Next.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Obtener cookies del request
    const cookieStore = cookies(); 
    const supabase = createClient(cookieStore);  // Pasar el cookieStore a createClient

    const { data, error } = await supabase.from("listas").select("*");

    if (error) {
      console.error("Error al obtener datos de Supabase:", error.message);
      return NextResponse.json({ error: "Error al obtener los datos" }, { status: 500 });
    }

    const opcionesPorTipo = data.reduce((acc, row) => {
      if (!acc[row.tipo]) {
        acc[row.tipo] = [];
      }
      acc[row.tipo].push(row.valor);
      return acc;
    }, {} as Record<string, string[]>);

    return NextResponse.json(opcionesPorTipo, { status: 200 });
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
