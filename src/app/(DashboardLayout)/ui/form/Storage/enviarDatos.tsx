import { guardarCaso } from "./guardarCaso";
import { guardarActores } from "./guardarActores";
import { guardarDescripcion } from "./guardarDescripcion";
import { guardarEvidencia } from "./guardarEvidencias"; // ✅ Importar la función

export const enviarDatos = async (formData, actores, descripcion, evidencias) => {
  try {
    console.log("Datos a enviar:", { formData, actores, descripcion, evidencias });

    if (!formData || Object.keys(formData).length === 0) {
      alert("El formulario está vacío.");
      return null;
    }

    if (!Array.isArray(actores) || actores.length === 0) {
      alert("No hay actores para guardar.");
      return null;
    }

    if (!descripcion.version_estudiante_afectado && !descripcion.version_estudiante_implicado && !descripcion.version_testigos) {
      alert("Debe llenar al menos una versión del relato.");
      return null;
    }

    // ✅ Guardar el caso y obtener el ID
    const casoResponse = await guardarCaso(formData);
    if (!casoResponse.success) {
      alert(`Error al guardar el caso: ${casoResponse.message}`);
      return null;
    }

    const idCaso = casoResponse.insertId || formData.Id_Caso;
    console.log("ID del caso obtenido:", idCaso);

    if (!idCaso) {
      alert("No se pudo obtener el ID del caso.");
      return null;
    }

    // ✅ Guardar actores
    const actoresResponse = await guardarActores(idCaso, actores);
    if (!actoresResponse.success) {
      alert(`Error al guardar actores: ${actoresResponse.message}`);
      return null;
    }

    // ✅ Guardar descripción
    const descripcionResponse = await guardarDescripcion(
      idCaso,
      descripcion.version_estudiante_afectado,
      descripcion.version_estudiante_implicado,
      descripcion.version_testigos
    );

    if (!descripcionResponse.success) {
      alert(`Error al guardar descripción: ${descripcionResponse.message}`);
      return null;
    }

    // ✅ Guardar evidencias
    console.log("Enviando evidencias:", evidencias);
    const evidenciaResponse = await guardarEvidencia(idCaso, evidencias);
    if (!evidenciaResponse.success) {
        alert(`Error al guardar evidencias: ${evidenciaResponse.message}`);
        return null;
    }

    
    alert("Todos los datos fueron guardados correctamente.");
    return idCaso;

  } catch (error) {
    console.error("Error en enviarDatos:", error);
    alert("Ocurrió un error inesperado.");
    return null;
  }
};
