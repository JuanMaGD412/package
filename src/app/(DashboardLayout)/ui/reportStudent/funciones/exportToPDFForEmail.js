import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Función para obtener imagen desde una URL y convertirla a base64
async function getImageFromUrl(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// Función principal para generar PDF en base64 (sin descargarlo)
export async function generatePDFBase64(estudiante, casos) {
  const doc = new jsPDF();

  // Cargar imagen del estudiante (si tiene)
  const imageData = estudiante.foto_url
    ? await getImageFromUrl(estudiante.foto_url)
    : null;

  // ===============================
  // TABLA DE INFORMACIÓN DEL ESTUDIANTE
  // ===============================

  const estudianteInfo = [
    ["Nombre y Apellidos del Estudiante:", estudiante.nombre_completo],
    ["Documento:", estudiante.documentoid],
    ["Grado:", estudiante.grado],
    ["Nombre y Apellidos del Acudiente:", estudiante.acudiente.nombre_completo],
    ["Teléfono de Contacto:", estudiante.acudiente.telefono],
  ];

  const startY = 20;

  autoTable(doc, {
    startY,
    styles: { fontSize: 10, valign: "middle" },
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold" },
      1: { cellWidth: 100 },
    },
    body: estudianteInfo,
    margin: { left: 14 },
  });

  // Agregar imagen a la derecha
  if (imageData) {
    const tableHeight = doc.lastAutoTable.finalY - startY;
    const imgHeight = 40;
    const offsetY = startY + (tableHeight - imgHeight) / 2;

    doc.setDrawColor(200);
    doc.rect(175, startY, 25, tableHeight); // Marco
    doc.addImage(imageData, "JPEG", 176, offsetY, 23, imgHeight);
  }

  const afterInfoY = doc.lastAutoTable.finalY + 5;
  doc.setDrawColor(180);
  doc.line(14, afterInfoY, 196, afterInfoY);

  // ===============================
  // TÍTULO Y TEXTO DESCRIPTIVO
  // ===============================

  const textStartY = afterInfoY + 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PROCESOS DEL ESTUDIANTE", 14, textStartY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    [
      "• Luego de hacer la descripción de la situación, se describe el nombre legible de quien hace el reporte y se firma.",
      "• Lo mismo luego de que el estudiante y/o el acudiente escriban los respectivos descargos y compromisos.",
      "• La descripción de los hechos estará apoyada en el manual de convivencia.",
      "• Se sugiere hacer registros positivos a los estudiantes que se destacan por su comportamiento social y/o proyección institucional.",
    ],
    14,
    textStartY + 8
  );

  const beforeCasosY = textStartY + 35;
  doc.setDrawColor(180);
  doc.line(14, beforeCasosY, 196, beforeCasosY);

  // ===============================
  // TABLA DE CASOS
  // ===============================

  autoTable(doc, {
    startY: beforeCasosY + 5,
    head: [["Fecha", "Descripción de la situación", "Descargos", "Compromisos"]],
    body: casos.map((c) => [
      new Date(c.fecha_caso).toLocaleDateString(),
      c.descripcion || "Sin descripción",
      "-",
      "-",
    ]),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [200, 200, 200],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 75 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setDrawColor(180);
  doc.line(14, finalY - 8, 196, finalY - 8);
  doc.text("Firma del docente: __________________________", 14, finalY);
  doc.text("Firma del estudiante/acudiente: __________________________", 100, finalY);

  // ===============================
  // DEVOLVER PDF EN BASE64
  // ===============================
  return doc.output("datauristring").split(",")[1]; // solo base64 puro
}
