// utils/getStudentInfo.js
export const getStudentInfo = async (documento_id) => {
  try {
    const res = await fetch(`/api/comunidad/filtroDocumento/${documento_id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo info del estudiante", error);
    return null;
  }
};
