export const guardarActores = async (idCaso: string | null, actores: any[]): Promise<{ success: boolean; message: string }> => {
    try {
        if (!idCaso) throw new Error("ID del caso no proporcionado");
        if (!actores.length) throw new Error("No hay actores para guardar");

        const response = await fetch("/api/actores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_caso: idCaso, actores }),
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        return { success: true, message: "Actores guardados correctamente" };
    } catch (error) {
        console.error("Error al guardar actores:", error.message);
        return { success: false, message: error.message };
    }
};
