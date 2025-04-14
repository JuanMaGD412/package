import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { idCaso, responsable, fecha, observacion, estadoAvance } = await req.json();

    if (!idCaso || !responsable || !fecha) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const estadoNormalizado = estadoAvance.toLowerCase();
    const estadosValidos = ["abierto", "en seguimiento", "cerrado"];

    if (!estadosValidos.includes(estadoNormalizado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT observacion FROM seguimientos WHERE id_caso = $1 LIMIT 1",
      [idCaso]
    );

    const nuevaLinea = `[${fecha}] ${estadoNormalizado}: ${observacion}`;
    let resultado;

    if (result.rows.length > 0) {
      const observacionAnterior = result.rows[0].observacion || "";
      const observacionFinal = observacionAnterior
        ? `${observacionAnterior}\n${nuevaLinea}`
        : nuevaLinea;

      const updateSql = `
        UPDATE seguimientos
        SET responsable = $1, fecha = $2, observacion = $3
        WHERE id_caso = $4
      `;
      await pool.query(updateSql, [responsable, fecha, observacionFinal, idCaso]);
      resultado = "actualizado";
    } else {
      const insertSql = `
        INSERT INTO seguimientos (id_caso, responsable, fecha, observacion)
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(insertSql, [idCaso, responsable, fecha, nuevaLinea]);
      resultado = "insertado";
    }

    const updateEstadoSql = "UPDATE casos SET estado = $1 WHERE Id_Caso = $2";
    await pool.query(updateEstadoSql, [estadoNormalizado, idCaso]);

    return NextResponse.json({
      message: `Seguimiento ${resultado} correctamente`,
    }, { status: 200 });

  } catch (error) {
    console.error("Error al guardar el seguimiento:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM seguimientos");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
