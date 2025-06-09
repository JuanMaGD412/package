export const actualizarIntervencion = async (
    idCaso,
    tipoDecision,
    decisionComite,
    compromisos,
    fechaCompromiso
  ) => {
    try {
      if (!idCaso) throw new Error("ID del caso no proporcionado");
  
      const response = await fetch("/api/intervencion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_caso: idCaso,
          tipoDecision,
          decisionComite,
          compromisos,
          fechaCompromiso,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
  
      return { success: true, message: "Intervención actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar la intervención:", error.message);
      return { success: false, message: error.message || "Error inesperado" };
    }
  };
  