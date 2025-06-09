export const actualizarEvidencias = async (idCaso, evidencias) => {
    try {
      if (!idCaso) throw new Error("ID del caso no proporcionado");
  
      const formData = new FormData();
      formData.append("id_caso", idCaso);
  
      if (Array.isArray(evidencias) && evidencias.length > 0) {
        evidencias.forEach((evidence, index) => {
          if (evidence) {
            formData.append(`evidencias[${index}][description]`, evidence.description || "");
            formData.append(`evidencias[${index}][size]`, evidence.size || "0 MB");
  
            if (evidence.file instanceof File) {
              formData.append(`evidencias[${index}][file]`, evidence.file);
            }
          }
        });
      }
  
      const response = await fetch("/api/evidencias", {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido en la API");
      }
  
      return { success: true, message: "Evidencias actualizadas correctamente" };
    } catch (error) {
      console.error("Error al actualizar evidencias:", error.message);
      return { success: false, message: error.message };
    }
  };
  