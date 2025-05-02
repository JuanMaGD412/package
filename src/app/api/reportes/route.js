import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const casosResult = await pool.query("SELECT * FROM casos");
    const casos = casosResult.rows;

    const actoresResult = await pool.query("SELECT * FROM actores");
    const actores = actoresResult.rows;

    const descripcionesResult = await pool.query("SELECT * FROM descripciones");
    const descripciones = descripcionesResult.rows;

    const comunidadResult = await pool.query("SELECT documentoid, grado FROM comunidad");
    const comunidad = comunidadResult.rows;

    // Une datos por caso
    const casosConDetalles = casos.map((caso) => {
      const actoresCaso = actores
        .filter((a) => a.id_caso === caso.id_caso)
        .map((actor) => {
          const infoComunidad = comunidad.find((c) => c.documentoid === actor.documento_id);

          return {
            ...actor,
            grado: infoComunidad?.grado || "Sin grado",
          };
        });

      return {
        ...caso,
        actores: actoresCaso,
        descripcion: descripciones.find((d) => d.id_caso === caso.id_caso) || null,
      };
    });

    return NextResponse.json(casosConDetalles, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los casos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
