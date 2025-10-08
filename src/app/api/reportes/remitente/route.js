import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Aquí puedes determinar el ID de la institución según el usuario logueado
    // Por ahora usaremos el ID 1 (UdeA)
    const { data, error } = await supabase
      .from("email_config")
      .select("email")
      .eq("institucion_id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "No se encontró el correo institucional" }, { status: 404 });
    }

    return NextResponse.json({ email: data.email }, { status: 200 });
  } catch (err) {
    console.error("Error al obtener correo remitente:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
