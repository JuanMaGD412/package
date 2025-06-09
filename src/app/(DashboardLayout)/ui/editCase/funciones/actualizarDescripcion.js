export const actualizarDescripcion = async (
    idCaso,
    version_estudiante_vinculado,
    version_estudiante_implicado,
    version_testigos
  ) => {
    try {
      if (!idCaso) throw new Error("ID del caso no proporcionado");
  
      if (!version_estudiante_vinculado && !version_estudiante_implicado && !version_testigos) {
        throw new Error("Debe llenar al menos una versión del relato.");
      }
  
      const response = await fetch("/api/descripcion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_caso: idCaso,
          version_estudiante_vinculado: version_estudiante_vinculado || null,
          version_estudiante_implicado: version_estudiante_implicado || null,
          version_testigos: version_testigos || null,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
  
      return { success: true, message: "Descripción actualizada correctamente" };
    } catch (error) {
      console.error("Error al actualizar la descripción:", error.message);
      return { success: false, message: error.message || "Error desconocido" };
    }
  };
  