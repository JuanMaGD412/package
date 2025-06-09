export const actualizarRutaAtencion = async (idCaso, rutaAtencion) => {
    try {
      if (!idCaso) throw new Error("ID del caso no proporcionado");
  
      const response = await fetch("/api/rutaAtencion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_caso: idCaso,
          ruta_activada: rutaAtencion.ruta_activada === true ? 1 : 0,
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
  
      return { success: true, message: "Ruta de atención actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar la ruta de atención:", error.message);
      return { success: false, message: error.message || "Error inesperado" };
    }
  };
  