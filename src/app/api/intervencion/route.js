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
      Array.isArray(compromisos) ? JSON.stringify(compromisos) : '[]',
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
