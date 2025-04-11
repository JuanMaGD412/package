// utils/fetchCases.ts
export const fetchCases = async () => {
    try {
      const [casesRes, actoresRes, descripcionesRes, evidenciasRes, intervencionesRes, rutaRes, seguimientoRes] =
        await Promise.all([
          fetch("/api/casos"),
          fetch("/api/actores"),
          fetch("/api/descripcion"),
          fetch("/api/evidencias"),
          fetch("/api/intervencion"),
          fetch("/api/rutaAtencion"),
          fetch("/api/seguimientos"),
        ]);
  
      if (!casesRes.ok || !actoresRes.ok || !descripcionesRes.ok || !evidenciasRes.ok || !intervencionesRes.ok || !rutaRes.ok || !seguimientoRes.ok) {
        throw new Error("Error al obtener los datos");
      }
  
      const [casesData, actoresData, descripcionesData, evidenciasData, intervencionesData, rutaData, seguimientoData] = await Promise.all([
        casesRes.json(),
        actoresRes.json(),
        descripcionesRes.json(),
        evidenciasRes.json(),
        intervencionesRes.json(),
        rutaRes.json(),
        seguimientoRes.json(),
      ]);
  
      // Relacionar los datos con los casos
      const casesWithDetails = casesData.map((caso) => ({
        ...caso,
        actores: actoresData.filter((a) => a.Id_Caso === caso.Id_Caso),
        descripcion: descripcionesData.find((d) => d.id_caso === caso.Id_Caso),
        evidencias: evidenciasData.filter((e) => e.id_caso === caso.Id_Caso),
        intervencion: intervencionesData.find((i) => i.id_caso === caso.Id_Caso),
        rutaAtencion: rutaData.find((r) => r.id_caso === caso.Id_Caso),
        seguimiento: seguimientoData.find((s) => s.id_caso === caso.Id_Caso),
      }));
  
      return casesWithDetails;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  