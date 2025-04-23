import pool from "../../../../../lib/db";

export async function GET(req, { params }) {
  const { documento_id } = params;

  if (!documento_id) {
    return new Response(JSON.stringify({ message: "Debe proporcionar un documento_id" }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      'SELECT nombre, grado, foto FROM comunidad WHERE documentoid = $1',
      [documento_id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Estudiante no encontrado" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    return new Response(JSON.stringify({ message: "Error interno del servidor" }), {
      status: 500,
    });
  }
}
