"use client";
import React, { useState, useEffect } from "react";
import { generatePDFBase64 } from "../../reportStudent/funciones/exportTOPDFforEmail";

export default function EnviarReporteModal({ isOpen, onClose, estudiante, casos }) {
  const [asunto, setAsunto] = useState("");
  const [remitente, setRemitente] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchRemitente = async () => {
      try {
        const res = await fetch("/api/reportes/remitente");
        const data = await res.json();
        if (res.ok) {
          setRemitente(data.email);
        } else {
          console.warn("No se encontró configuración de correo institucional");
        }
      } catch (err) {
        console.error("Error al obtener remitente institucional:", err);
      }
    };

    if (isOpen) fetchRemitente();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnviar = async () => {
    setEnviando(true);
    setMensaje("");

    try {
      // 1️⃣ Generar el PDF en base64
      const pdfBase64 = await generatePDFBase64(estudiante, casos);

      // 2️⃣ Enviar correo al acudiente
      const res = await fetch("/api/reportes/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institucion_id: estudiante.institucion_id || 1,
          destinatario: estudiante.acudiente.emailacudiente,
          asunto: asunto || "Reporte de casos del estudiante",
          mensaje: `
            <p>Estimado/a ${estudiante.acudiente.nombre_completo},</p>
            <p>Adjunto encontrará el reporte de casos del estudiante <strong>${estudiante.nombre_completo}</strong>.</p>
            <p>Atentamente,<br>${remitente}</p>
          `,
          pdfBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar correo");

      setMensaje("✅ Correo enviado correctamente");
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo enviar el correo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[480px] p-6">
        <h2 className="text-xl font-semibold mb-4">Enviar reporte al acudiente</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Correo del acudiente</label>
            <input
              type="email"
              value={estudiante.acudiente.emailacudiente || ""}
              readOnly
              className="border px-3 py-2 rounded-md w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Correo remitente</label>
            <input
              type="email"
              value={remitente}
              readOnly
              className="border px-3 py-2 rounded-md w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Asunto</label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="border px-3 py-2 rounded-md w-full"
              placeholder="Ejemplo: Reporte de casos del estudiante"
            />
          </div>
        </div>

        {mensaje && <p className="mt-3 text-sm text-center">{mensaje}</p>}

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            disabled={enviando}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
