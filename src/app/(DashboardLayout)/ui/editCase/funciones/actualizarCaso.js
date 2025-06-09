export const actualizarCaso = async (formData) => {
  try {
      const response = await fetch(`/api/casos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });

      if (response.ok) {
          return { success: true, message: "Caso actualizado exitosamente" };
      } else {
          return { success: false, message: "Error al actualizar el caso" };
      }
  } catch (error) {
      console.error("Error al actualizar los datos:", error);
      return { success: false, message: "Error en el servidor" };
  }
};
