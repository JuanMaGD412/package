import pool from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const grado = searchParams.get('grado');

  if (!grado) {
    return new Response(JSON.stringify({ message: "Debe proporcionar un grado" }), { status: 400 });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM comunidad WHERE grado = ?', [grado]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "No se encontraron datos para este grado" }), { status: 404 });
    }

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return new Response(JSON.stringify({ message: "Error al obtener los datos" }), { status: 500 });
  }
}
