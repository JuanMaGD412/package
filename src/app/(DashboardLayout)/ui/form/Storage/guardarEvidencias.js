export const guardarEvidencia = async (idCaso, evidencias) => {
    try {
        if (!idCaso) throw new Error("ID del caso no proporcionado");

        console.log("Evidencias recibidas en guardarEvidencia:", evidencias); 

        if (!Array.isArray(evidencias) || evidencias.length === 0) {
            console.error("Evidencias recibidas no son un array:", evidencias);
            throw new Error("No hay evidencias para guardar");
        }

        const formData = new FormData();
        formData.append("id_caso", idCaso);

        evidencias.forEach((evidence, index) => {
            if (evidence) {
                formData.append(`evidencias[${index}][description]`, evidence.description || "");
                if (evidence.file instanceof File) {
                    formData.append(`evidencias[${index}][file]`, evidence.file);
                }
                formData.append(`evidencias[${index}][size]`, evidence.size || "0 MB");
            }
        });

        console.log("FormData enviado:", formData); 

        const response = await fetch("/api/evidencias", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        return { success: true, message: "Evidencias guardadas correctamente" };
    } catch (error) {
        console.error("Error al guardar evidencias:", error.message);
        return { success: false, message: error.message };
    }
};
