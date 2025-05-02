import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (casos, logoBase64 = null) => {
  const doc = new jsPDF("landscape");

  // Logo si se pasa
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 10, 10, 30, 30);
  }

  // Encabezado
  doc.setFontSize(16);
  doc.text("INSTITUCIÓN EDUCATIVA EJEMPLO", 150, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("Reporte de Casos de Convivencia", 150, 30, { align: "center" });
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 40, { align: "center" });

  // Datos de la tabla
  const tableData = casos.map((caso) => [
    caso.id_caso,
    new Date(caso.fecha_caso).toLocaleDateString(),
    caso.es_confidencial ? "Sí" : "No",
    caso.tipo_caso,
    caso.actores?.map((a) => `${a.rol}: ${a.nombre_completo} ${a.grado ? `(${a.grado})` : ""}`).join("\n") || "Sin actores",
    caso.descripcion?.version_estudiante_afectado || "Sin descripción",
    caso.estado
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Caso", "Fecha", "Confidencial", "Tipo", "Actores", "Descripción", "Estado"]],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0 },
    theme: "grid",
  });

  // Pie de página
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text("Documento generado automáticamente por el sistema.", 14, finalY);
  doc.text("Firma Coordinador de Convivencia:", 220, finalY);
  doc.text("______________________________", 220, finalY + 10);

  doc.save("reporte-casos.pdf");
};
