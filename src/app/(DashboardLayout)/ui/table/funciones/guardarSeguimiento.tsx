export const guardarSeguimiento = async (
  idCaso: string | null,
  responsable: string,
  fecha: string,
  observacion: string,
  estadoAvance: "En seguimiento" | "Cerrado"
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!idCaso) throw new Error("ID del caso no proporcionado");

    // Mapeo visual -> valor aceptado por la API
    const estadoBD = estadoAvance === "En seguimiento" ? "en seguimiento" : "cerrado";

    const response = await fetch("/api/seguimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCaso,
        responsable,
        fecha,
        observacion,
        estadoAvance: estadoBD,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }

    return { success: true, message: "Seguimiento guardado correctamente" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al guardar el seguimiento:", error.message);
      return { success: false, message: error.message };
    } else {
      console.error("Error desconocido:", error);
      return { success: false, message: "Ocurrió un error inesperado" };
    }
  }
};
