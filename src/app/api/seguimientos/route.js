// src/app/api/seguimientos/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { idCaso, responsable, fecha, observacion, estadoAvance } = await req.json();

    if (!idCaso || !responsable || !fecha) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const estadoNormalizado = (estadoAvance || "").toLowerCase();
    const estadosValidos = ["abierto", "en seguimiento", "cerrado"];

    if (!estadosValidos.includes(estadoNormalizado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    // 1️⃣ Buscar si ya existe seguimiento para el caso
    const { data: existente, error: errorSelect } = await supabase
      .from("seguimientos")
      .select("observacion")
      .eq("id_caso", idCaso)
      .limit(1)
      .single();

    if (errorSelect && errorSelect.code !== "PGRST116") {
      console.error("Error al buscar seguimiento:", errorSelect);
      return NextResponse.json({ error: "Error al consultar seguimiento" }, { status: 500 });
    }

    const nuevaLinea = `[${fecha}] ${estadoNormalizado}: ${observacion}, seguimiento realizado por: ${responsable}`;
    let resultado;

    // 2️⃣ Si existe → actualizar concatenando observación
    if (existente) {
      const observacionAnterior = existente.observacion || "";
      const observacionFinal = observacionAnterior
        ? `${observacionAnterior}\n${nuevaLinea}`
        : nuevaLinea;

      const { error: errorUpdate } = await supabase
        .from("seguimientos")
        .update({
          responsable,
          fecha,
          observacion: observacionFinal,
        })
        .eq("id_caso", idCaso);

      if (errorUpdate) {
        console.error("Error al actualizar seguimiento:", errorUpdate);
        return NextResponse.json({ error: "Error al actualizar seguimiento" }, { status: 500 });
      }

      resultado = "actualizado";
    } else {
      // 3️⃣ Si no existe → insertar nuevo
      const { error: errorInsert } = await supabase
        .from("seguimientos")
        .insert([
          {
            id_caso: idCaso,
            responsable,
            fecha,
            observacion: nuevaLinea,
          },
        ]);

      if (errorInsert) {
        console.error("Error al insertar seguimiento:", errorInsert);
        return NextResponse.json({ error: "Error al insertar seguimiento" }, { status: 500 });
      }

      resultado = "insertado";
    }

    // 4️⃣ Actualizar el estado del caso en la tabla casos
    const { error: errorEstado } = await supabase
      .from("casos")
      .update({ estado: estadoNormalizado })
      .eq("id_caso", idCaso);

    if (errorEstado) {
      console.error("Error al actualizar estado del caso:", errorEstado);
      return NextResponse.json({ error: "Error al actualizar estado del caso" }, { status: 500 });
    }

    // 5️⃣ Respuesta final
    return NextResponse.json(
      { message: `Seguimiento ${resultado} correctamente` },
      { status: 200 }
    );

  } catch (error) {
    console.error("Excepción en POST seguimiento:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// === GET: obtener todos los seguimientos ===
export async function GET() {
  try {
    const { data, error } = await supabase.from("seguimientos").select("*");

    if (error) {
      console.error("Error al obtener seguimientos:", error);
      return NextResponse.json({ error: "Error al obtener los seguimientos" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Excepción en GET seguimientos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
