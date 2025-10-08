import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const grado = searchParams.get('grado');

  if (!grado) {
    return new Response(JSON.stringify({ message: "Debe proporcionar un grado" }), { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('comunidad')
      .select('*')
      .eq('grado', grado);

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ message: "No se encontraron datos para este grado" }), { status: 404 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return new Response(JSON.stringify({ message: "Error al obtener los datos" }), { status: 500 });
  }
}
