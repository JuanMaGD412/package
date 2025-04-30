import { guardarCaso } from "./guardarCaso";
import { guardarActores } from "./guardarActores";
import { guardarDescripcion } from "./guardarDescripcion";
import { guardarEvidencia } from "./guardarEvidencias";
import { guardarIntervencion } from "./guardarIntervencion";
import { guardarRutaAtencion } from "./guardarRutaAtencion";

export const enviarDatos = async (formData, actores, descripcion, evidencias, intervencion, rutaAtencion) => {
  try {
    console.log("Datos a enviar:", { formData, actores, descripcion, evidencias, intervencion, rutaAtencion });

    // Validaciones básicas
    if (!formData || Object.keys(formData).length === 0) {
      alert("El formulario está vacío.");
      return null;
    }

    if (!Array.isArray(actores) || actores.length === 0) {
      alert("No hay actores para guardar.");
      return null;
    }

    if (
      !descripcion.version_estudiante_afectado &&
      !descripcion.version_estudiante_implicado &&
      !descripcion.version_testigos
    ) {
      alert("Debe llenar al menos una versión del relato.");
      return null;
    }

    // 🔒 1. Guardar el caso
    const casoResponse = await guardarCaso(formData);
    if (!casoResponse.success) {
      alert(`Error al guardar el caso: ${casoResponse.message}`);
      return null;
    }

    const idCaso = casoResponse.insertId || formData.Id_Caso;
    if (!idCaso) {
      alert("No se pudo obtener el ID del caso.");
      return null;
    }

    // 🔒 2. Guardar actores
    const actoresResponse = await guardarActores(idCaso, actores);
    if (!actoresResponse.success) {
      alert(`Error al guardar actores: ${actoresResponse.message}`);
      return null;
    }

    // ✅ A partir de aquí, continuar con los demás
    const descripcionResponse = await guardarDescripcion(
      idCaso,
      descripcion.version_estudiante_afectado,
      descripcion.version_estudiante_implicado,
      descripcion.version_testigos
    );
    

    console.log("Enviando evidencias:", evidencias);
    await guardarEvidencia(idCaso, evidencias || []);

    if (rutaAtencion && rutaAtencion.activa !== null) {
      await guardarRutaAtencion(idCaso, rutaAtencion);
    }

    await guardarIntervencion(
      idCaso,
      intervencion?.tipoDecision || "",
      intervencion?.decisionComite || "",
      intervencion?.compromisos || [],
      intervencion?.fechaCompromiso || null
    );

    alert("Todos los datos fueron guardados correctamente.");
    return idCaso;

  } catch (error) {
    console.error("Error en enviarDatos:", error);
    alert("Ocurrió un error inesperado.");
    return null;
  }
};
