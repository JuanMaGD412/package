import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { id_caso, tipoDecision, decisionComite, compromisos, fechaCompromiso } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const sql = `
      INSERT INTO intervenciones 
      (id_caso, tipo_decision, decision_comite, compromisos, fecha_compromiso) 
      VALUES ($1, $2, $3, $4, $5)
    `;

    const result = await pool.query(sql, [
      id_caso,
      tipoDecision ?? '',
      decisionComite ?? '',
      compromisos ?? '',
      fechaCompromiso ?? null
    ]);
    

    return NextResponse.json({
      message: "Intervención guardada exitosamente",
      rowCount: result.rowCount
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar la intervención:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM intervenciones");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las intervenciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const {
      id_caso,
      tipoDecision,
      decisionComite,
      compromisos,
      fechaCompromiso
    } = await request.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const query = `
      UPDATE intervenciones
      SET tipo_decision = $2,
          decision_comite = $3,
          compromisos = $4,
          fecha_compromiso = $5
      WHERE id_caso = $1
    `;

    const values = [
      id_caso,
      tipoDecision ?? '',
      decisionComite ?? '',
      compromisos ?? '',
      fechaCompromiso ?? null
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "No se encontró intervención para este ID de caso" }, { status: 404 });
    }

    return NextResponse.json({ message: "Intervención actualizada exitosamente" }, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar la intervención:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
