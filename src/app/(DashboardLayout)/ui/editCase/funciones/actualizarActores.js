export const actualizarActores = async (idCaso, actores) => {
    try {
      if (!idCaso) throw new Error("ID del caso no proporcionado");
      if (!Array.isArray(actores) || actores.length === 0) {
        throw new Error("No hay actores para actualizar");
      }
  
      const response = await fetch("/api/actores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_caso: idCaso, actores }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
  
      return { success: true, message: "Actores actualizados correctamente" };
    } catch (error) {
      console.error("Error al actualizar actores:", error.message);
      return { success: false, message: error.message };
    }
  };
  