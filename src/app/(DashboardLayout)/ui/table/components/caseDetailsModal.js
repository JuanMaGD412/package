"use client";
import React from "react";
import { Modal, Button, TextInput, Label, Select, Textarea, Table } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;

  const downloadEvidence = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl); // Limpia la URL
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("No se pudo descargar el archivo.");
    }
  };
  
  

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">

      <Modal.Header className="bg-blue-600 text-white py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Detalles del Caso #{caseData.id_caso}</h3>
      </Modal.Header>
      <Modal.Body className="p-6 bg-gray-50">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-md font-medium text-right w-full">Estado: <span className={`px-3 py-1 rounded text-sm font-bold  ${caseData.estado === "cerrado" ? "bg-red-500 text-white" : caseData.estado === "en seguimiento" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>{caseData.estado.charAt(0).toUpperCase() + caseData.estado.slice(1)}</span></p>
          </div>
          {/* Información general */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold border-b pb-2">Datos Generales</h5>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label value="ID del Caso" />
                <TextInput value={caseData.id_caso} readOnly />
              </div>
              <div>
                <Label value="Fecha del Caso" />
                <TextInput type="date" value={new Date(caseData.fecha_caso).toLocaleDateString("en-CA")} readOnly />
              </div>
              <div>
                <Label value="Tipo de Caso" />
                <TextInput value={caseData.tipo_caso} readOnly />
              </div>
              <div>
                <Label value="¿Es confidencial?" />
                <div className="flex gap-2 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={caseData.es_confidencial === 1} disabled /> Sí
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" checked={caseData.es_confidencial === 0} disabled /> No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          {/* Actores */}
          <div className="mb-6 border p-6 rounded-lg shadow-md bg-gray-50">
            <h5 className="text-xl font-bold text-gray-700">Actores Involucrados</h5>
            <Separator className="my-4" />
            <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Nombre completo</th>
                        <th className="px-4 py-3">Tipo Documento</th>
                        <th className="px-4 py-3">Número Documento</th>
                        <th className="px-4 py-3">Acudiente</th>
                        <th className="px-4 py-3">Teléfono</th>
                        <th className="px-4 py-3">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseData.actores.map((actor, index) => (
                        <tr key={actor.id}className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-3">{actor.rol || ""}</td>
                          <td className="px-4 py-3">{actor.nombre_completo || ""}</td>
                          <td className="px-4 py-3">{actor.tipo_documento || ""}</td>
                          <td className="px-4 py-3">{actor.documento_id || ""}</td>
                          <td className="px-4 py-3">{actor.nombre_acudiente || ""}</td>
                          <td className="px-4 py-3">{actor.telefono_acudiente || ""}</td>
                          <td className="px-4 py-3">{actor.email_acudiente || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          </div>
          {/* Evidencias */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold border-b pb-2">Evidencias</h5>
            <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Tamaño</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {caseData.evidencias.map((evidencia, index) => (
                  <tr key={evidencia.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{evidencia.descripcion || "Sin descripción"}</td>
                    <td className="px-4 py-3">{evidencia.tipo_archivo || "Desconocido"}</td>
                    <td className="px-4 py-3">{evidencia.tamano_archivo}</td>
                    <td className="px-4 py-3">
                      <Button size="xs" color="green" onClick={() => downloadEvidence(evidencia.url_archivo, evidencia.nombre_archivo)}>
                        Descargar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Intervención y decisión */}
          <div className="mb-6 border p-6 rounded-xl shadow-lg bg-white">
            <h5 className="text-xl font-bold mb-4 text-gray-700">Intervención y decisión</h5>
            <Separator className="my-4" />

            <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" className="font-medium text-gray-600" />
            <TextInput value={caseData.intervencion?.tipo_decision || ''} readOnly /> 

            <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4 font-medium text-gray-600" />
            <Textarea
              id="decisionComite"
              value={caseData.intervencion?.decision_comite || ''}
              required
              disabled
              className="border p-2 rounded-lg w-full mt-1 bg-gray-100"
            />

            <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4 font-medium text-gray-600" />
            <Textarea
              id="compromisos"
              value={caseData.intervencion?.compromisos || ''}
              required
              disabled
              className="border p-2 rounded-lg w-full mt-1 bg-gray-100"
            />

            <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4 font-medium text-gray-600" />
            <TextInput id="fechaCompromiso" value={new Date(caseData.intervencion?.fecha_compromiso).toLocaleDateString("en-CA")} required readOnly className="border p-2 rounded-lg w-full mt-1 bg-gray-100"/>
          </div>
          {/* Ruta de atención */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ruta de atención</h2>
            <label className="block font-medium text-gray-600">¿Se activó ruta de atención?</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rutaAtencion" value="1" checked={caseData.rutaAtencion?.ruta_activada === 1} disabled />
                Sí
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rutaAtencion" value="0" checked={caseData.rutaAtencion?.ruta_activada === 0} disabled />
                No
              </label>
            </div>

            {caseData.rutaAtencion?.ruta_activada === 1 && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <label className="block font-medium text-gray-600">Tipo de remisión:</label>
                <TextInput value={caseData.rutaAtencion?.tipo_remision || ''} readOnly />  

                <label className="block font-medium text-gray-600">Fecha:</label>
                <input type="date" className="border p-2 w-full rounded-lg bg-gray-100" value={new Date(caseData.rutaAtencion?.fecha).toLocaleDateString("en-CA")} required readOnly />

                <label className="block font-medium text-gray-600">Remitido:</label>
                <input type="text" className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.rutaAtencion?.remitido} required readOnly />

                <label className="block font-medium text-gray-600">Institución a la que se remite:</label>
                <input type="text" className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.rutaAtencion?.institucion} required readOnly />

                <label className="block font-medium text-gray-600">Contacto:</label>
                <input type="text" className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.rutaAtencion?.contacto} required readOnly />

                <label className="block font-medium text-gray-600">Observaciones:</label>
                <textarea className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.rutaAtencion?.observaciones} required readOnly></textarea>
              </div>
            )}
          </div>

          {/* Seguimiento */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
                <div>
                  <Label htmlFor="responsable" value="Responsable del último seguimiento" />
                  <input type="text" className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.seguimiento?.responsable} required readOnly/>
                </div>
                <div>
                  <Label htmlFor="fecha" value="Fecha del seguimiento" />
                  <input type="date" className="border p-2 w-full rounded-lg bg-gray-100" value={new Date(caseData.seguimiento?.fecha).toLocaleDateString("en-CA")} required readOnly />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <Label htmlFor="observacion" value="Observaciones del seguimiento" />
                <textarea className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.seguimiento?.observacion} required readOnly/>
              </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 p-4 rounded-b-lg flex justify-end">
        <Button color="gray" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseDetailsModal;