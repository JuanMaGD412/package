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

    // Consultar si ya existe un seguimiento para el caso
    const [rows] = await pool.query(
      "SELECT observacion FROM seguimientos WHERE id_caso = ? LIMIT 1",
      [idCaso]
    );

    const nuevaLinea = `[${fecha}] ${estadoNormalizado}: ${observacion}`;
    let resultado;

    if (rows.length > 0) {
      // Ya existe: concatenar observación y actualizar
      const observacionAnterior = rows[0].observacion || "";
      const observacionFinal = observacionAnterior
        ? `${observacionAnterior}\n${nuevaLinea}`
        : nuevaLinea;

      const updateSql = `
        UPDATE seguimientos
        SET responsable = ?, fecha = ?, observacion = ?
        WHERE id_caso = ?
      `;
      await pool.query(updateSql, [responsable, fecha, observacionFinal, idCaso]);
      resultado = "actualizado";
    } else {
      // No existe: insertar nuevo
      const insertSql = `
        INSERT INTO seguimientos (id_caso, responsable, fecha, observacion)
        VALUES (?, ?, ?, ?)
      `;
      await pool.query(insertSql, [idCaso, responsable, fecha, nuevaLinea]);
      resultado = "insertado";
    }

    // Actualizar estado del caso en tabla 'casos'
    const updateEstadoSql = "UPDATE casos SET estado = ? WHERE Id_Caso = ?";
    await pool.query(updateEstadoSql, [estadoNormalizado, idCaso]);

    return NextResponse.json({
      message: `Seguimiento ${resultado} correctamente`,
    }, { status: 200 });

  } catch (error) {
    console.error("Error al guardar el seguimiento:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
