export const guardarDescripcion = async (
    idCaso: string | null,
    version_estudiante_afectado: string,
    version_estudiante_implicado: string,
    version_testigos: string
): Promise<{ success: boolean; message: string }> => {
    try {
        if (!idCaso) throw new Error("ID del caso no proporcionado");
        if (!version_estudiante_afectado && !version_estudiante_implicado && !version_testigos) {
            throw new Error("Debe llenar al menos una versión del relato.");
        }

        const response = await fetch("/api/descripcion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id_caso: idCaso, 
                version_estudiante_afectado: version_estudiante_afectado || null, 
                version_estudiante_implicado: version_estudiante_implicado || null, 
                version_testigos: version_testigos || null 
            }),
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        return { success: true, message: "Descripción guardada correctamente" };
    } catch (error) {
        console.error("Error al guardar la descripción:", error.message);
        return { success: false, message: error.message };
    }
};
