import { NextResponse } from "next/server";
import pool from "../../../lib/db"; 

export async function POST(req) {
  try {
    const { id_caso, tipoDecision, decisionComite, compromisos, fechaCompromiso } = await req.json();

    if (!id_caso) {
      return NextResponse.json({ error: "ID del caso es obligatorio" }, { status: 400 });
    }

    const sql = `
      INSERT INTO intervenciones (id_caso, tipo_decision, decision_comite, compromisos, fecha_compromiso) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      id_caso, 
      tipoDecision || null, 
      decisionComite || null, 
      compromisos || null, 
      fechaCompromiso || null
    ]);

    return NextResponse.json({ 
      message: "Intervención guardada exitosamente", 
      affectedRows: result.affectedRows 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar la intervención:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
