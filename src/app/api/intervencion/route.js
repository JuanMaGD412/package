import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📌 POST: insertar una nueva intervención
export async function POST(req) {
  try {
    const { id_caso, tipoDecision, decisionComite, compromisos, fechaCompromiso } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const { error } = await supabase.from("intervenciones").insert([
      {
        id_caso,
        tipo_decision: tipoDecision ?? "",
        decision_comite: decisionComite ?? "",
        compromisos: compromisos ?? "",
        fecha_compromiso: fechaCompromiso ?? null,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Intervención guardada exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar la intervención:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// 📌 GET: obtener todas las intervenciones
export async function GET() {
  try {
    const { data, error } = await supabase.from("intervenciones").select("*");
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las intervenciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// 📌 PUT: actualizar intervención por id_caso
export async function PUT(request) {
  try {
    const { id_caso, tipoDecision, decisionComite, compromisos, fechaCompromiso } = await request.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const { error, count } = await supabase
      .from("intervenciones")
      .update({
        tipo_decision: tipoDecision ?? "",
        decision_comite: decisionComite ?? "",
        compromisos: compromisos ?? "",
        fecha_compromiso: fechaCompromiso ?? null,
      })
      .eq("id_caso", id_caso)
      .select("*", { count: "exact" });

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json(
        { error: "No se encontró intervención para este ID de caso" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Intervención actualizada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la intervención:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
