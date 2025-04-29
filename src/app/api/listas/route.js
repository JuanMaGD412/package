import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM listas");

    const opcionesPorTipo = result.rows.reduce((acc, row) => {
      if (!acc[row.tipo]) {
        acc[row.tipo] = [];
      }
      acc[row.tipo].push(row.valor);
      return acc;
    }, {});

    return NextResponse.json(opcionesPorTipo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las opciones desplegables:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
