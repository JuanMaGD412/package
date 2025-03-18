export const guardarCaso = async (formData: any) => {
    try {
        const response = await fetch("/api/casos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            return { success: true, message: "Caso guardado exitosamente" };
        } else {
            return { success: false, message: "Error al guardar el caso" };
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        return { success: false, message: "Error en el servidor" };
    }
};
