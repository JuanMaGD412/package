"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label, Select, Textarea, Table } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;
  const [tipoDecisiones, setTipoDecisiones] = useState([]);
  const todayStr = new Date().toISOString().split("T")[0];
  const [rutaAtencion, setRutaAtencion] = useState(false);
  const [tipoRemision, setTipoRemision] = useState("");
  const [fecha, setFecha] = useState("");
  const [remitido, setRemitido] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [contacto, setContacto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [localCaseData, setLocalCaseData] = useState(caseData);



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
      window.URL.revokeObjectURL(blobUrl); 
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("No se pudo descargar el archivo.");
    }
  };

  
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setLocalCaseData(prev => {
      const updated = { ...prev };
  
      // Manejo especial para rutas anidadas
      if (name.startsWith("decision.")) {
        updated.decision = {
          ...updated.decision,
          [name.split(".")[1]]: value,
        };
      } else if (name.startsWith("rutaAtencion.")) {
        const key = name.split(".")[1];
        updated.rutaAtencion = {
          ...updated.rutaAtencion,
          [key]: type === "radio" ? parseInt(value) : value,
        };
      } else {
        updated[name] = value;
      }
  
      return updated;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  useEffect(() => {
    const fetchTipoDecisiones = async () => {
      const res = await fetch("../../../../api/listas");
      const data = await res.json();
      setTipoDecisiones(data.tipo_decision || []);
    };
    fetchTipoDecisiones();
  }, []);
  
  

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">

      <Modal.Header className="bg-blue-600 text-white py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">Detalles del Caso #{caseData.id_caso}</h3>
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
                <Select value={caseData.tipo_caso} disabled>
                  <option value="">Seleccione un tipo</option>
                  <option value="salud">Situación de salud</option>
                  <option value="disciplinario">Disciplinario</option>
                </Select>
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

            <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
            <Select id="tipoDecision" name="tipoDecision" required onChange={onChange}>
              <option>Seleccione un tipo</option>
              {tipoDecisiones.map((decision, index) => (
                <option key={index} value={decision}>{decision}</option>
              ))}
            </Select>

            <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
            <Textarea id="decisionComite" name="decisionComite" value={caseData.intervencion?.decision_comite || ''} required onChange={onChange} />

            <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
            <Textarea id="compromisos" name="compromisos" value={caseData.intervencion?.compromisos || ''} onChange={onChange} />

            <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
            <TextInput id="fechaCompromiso" name="fechaCompromiso" value={formatDate(caseData.intervencion?.fecha_compromiso)} type="date" min={todayStr} required onChange={onChange} />
          </div>
          {/* Ruta de atención */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
          <h2 className="text-lg font-semibold mb-2">Ruta de atención</h2>
          <label className="block font-medium">¿Se activa ruta de atención?</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="rutaAtencion" value="true" checked={rutaAtencion === true} onChange={() => setRutaAtencion(true)} /> Sí
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="rutaAtencion" value="false" checked={rutaAtencion === false}  onChange={() => setRutaAtencion(false)} /> No
            </label>
          </div>
          {rutaAtencion === true && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <label className="block font-medium">Tipo de remisión:</label>
              <select className="border p-2 w-full rounded" value={tipoRemision} onChange={(e) => setTipoRemision(e.target.value)}>
                <option>Seleccione un tipo</option>
                <option>Urgente</option>
                <option>Regular</option>
              </select>
              <label className="block font-medium">Fecha:</label>
              <input type="date" className="border p-2 w-full rounded" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              <label className="block font-medium">Remitido:</label>
              <input type="text" className="border p-2 w-full rounded" value={remitido} onChange={(e) => setRemitido(e.target.value)} />
              <label className="block font-medium">Institución a la que se remite:</label>
              <input type="text" className="border p-2 w-full rounded" value={institucion} onChange={(e) => setInstitucion(e.target.value)} />
              <label className="block font-medium">Contacto:</label>
              <input type="text" className="border p-2 w-full rounded" value={contacto} onChange={(e) => setContacto(e.target.value)} />
              <label className="block font-medium">Observaciones:</label>
              <textarea className="border p-2 w-full rounded" value={observaciones} onChange={(e) => setObservaciones(e.target.value)}></textarea>
            </div>
          )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 p-4 rounded-b-lg flex justify-end">
        <Button color="blue" >Guardar Cambios</Button>
        <Button color="gray" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseDetailsModal;