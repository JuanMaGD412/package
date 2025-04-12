export const guardarIntervencion = async (
  idCaso,
  tipoDecision,
  decisionComite,
  compromisos,
  fechaCompromiso
)=> {
  try {
    if (!idCaso) throw new Error("ID del caso no proporcionado");

    const response = await fetch("/api/intervencion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_caso: idCaso,
        tipoDecision,
        decisionComite,
        compromisos,
        fechaCompromiso
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }

    return { success: true, message: "Intervención guardada correctamente" };
  } catch (error) {
      if (error instanceof Error) {
          console.error("Error al guardar la intervención:", error.message);
          return { success: false, message: error.message };
      } else {
          console.error("Error desconocido:", error);
          return { success: false, message: "Ocurrió un error inesperado" };
      }
  }
};
