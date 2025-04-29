import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // ajusta la ruta si es diferente

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("casos")
      .select("id_caso")
      .order("id", { ascending: false })
      .limit(1);

    if (error) throw error;

    const lastId = data.length > 0 ? data[0].id_caso : null;
    return NextResponse.json({ lastId });
  } catch (error) {
    console.error("Error al obtener el último Id_Caso:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
