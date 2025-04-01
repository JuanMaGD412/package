export const guardarRutaAtencion = async (idCaso: string, rutaAtencion) => {
  try {
    const response = await fetch("/api/rutaAtencion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_caso: idCaso,
        ruta_activada: rutaAtencion.ruta_activada === true ? 1 : 0,  // ✅ Conversión correcta
        tipo_remision: rutaAtencion.tipoRemision || null,
        fecha: rutaAtencion.fecha || null,
        remitido: rutaAtencion.remitido || null,
        institucion: rutaAtencion.institucion || null,
        contacto: rutaAtencion.contacto || null,
        observaciones: rutaAtencion.observaciones || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }

    return { success: true, message: "Ruta de atención guardada correctamente" };
  } catch (error) {
    console.error("Error al guardar la ruta de atención:", error.message);
    return { success: false, message: error.message };
  }
};
