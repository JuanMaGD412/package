import { actualizarCaso } from "./actualizarCaso";
import { actualizarActores } from "./actualizarActores";
import { actualizarDescripcion } from "./actualizarDescripcion";
import { actualizarEvidencia } from "./actualizarEvidencias";
import { actualizarIntervencion } from "./actualizarIntervencion";

export const actualizarDatos = async (
  formData,
  actores,
  descripcion,
  evidencias,
  intervencion,
  rutaAtencion
) => {
  try {
    if (!formData || Object.keys(formData).length === 0) {
      alert("El formulario está vacío.");
      return null;
    }

    if (!Array.isArray(actores) || actores.length === 0) {
      alert("No hay actores para actualizar.");
      return null;
    }

    if (
      !descripcion.version_estudiante_vinculado &&
      !descripcion.version_estudiante_implicado &&
      !descripcion.version_testigos
    ) {
      alert("Debe llenar al menos una versión del relato.");
      return null;
    }

    // 🔄 1. Actualizar el caso
    const casoResponse = await actualizarCaso(formData);

    if (!casoResponse.success) {
      alert(`Error al actualizar el caso: ${casoResponse.message}`);
      return null;
    }

    const idCaso = formData.Id_Caso;
    if (!idCaso) {
      alert("ID del caso inválido o no encontrado.");
      return null;
    }

    // 🔄 2. Actualizar datos relacionados
    const actoresResponse = await actualizarActores(idCaso, actores);
    if (!actoresResponse.success) {
      alert(`Error al actualizar actores: ${actoresResponse.message}`);
      return null;
    }

    await actualizarDescripcion(
      idCaso,
      descripcion.version_estudiante_vinculado,
      descripcion.version_estudiante_implicado,
      descripcion.version_testigos
    );

    await actualizarEvidencia(idCaso, evidencias || []);

    if (rutaAtencion && rutaAtencion.activa !== null) {
      await actualizarRutaAtencion(idCaso, rutaAtencion);
    }

    await actualizarIntervencion(
      idCaso,
      intervencion?.tipoDecision || "",
      intervencion?.decisionComite || "",
      intervencion?.compromisos || [],
      intervencion?.fechaCompromiso || null
    );

    alert("Datos actualizados correctamente.");
    window.location.reload();
    return idCaso;

  } catch (error) {
    console.error("Error en actualizarDatos:", error);
    alert("Ocurrió un error inesperado al actualizar los datos.");
    return null;
  }
};
