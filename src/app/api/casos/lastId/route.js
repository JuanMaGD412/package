import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    // Obtener el último caso según el ID
    const { data, error } = await supabase
      .from("casos")
      .select("id_caso")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error al obtener el último Id_Caso:", error);
      return NextResponse.json(
        { error: "Error al obtener el último Id_Caso" },
        { status: 500 }
      );
    }

    const lastId = data ? data.id_caso : null;
    return NextResponse.json({ lastId }, { status: 200 });
  } catch (error) {
    console.error("Excepción al obtener el último Id_Caso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
