"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label, Select, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { actualizarCaso } from "../funciones/actualizarDatos";


const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;

  const [tipoDecisiones, setTipoDecisiones] = useState([]);
  const [tipoCaso, setTipoCaso] = useState([]);
  const [tipoRemision, setTipoRemision] = useState([]);
  const [localCaseData, setLocalCaseData] = useState(caseData);
  const todayStr = new Date().toISOString().split("T")[0];
  

  useEffect(() => {
    setLocalCaseData(caseData);
  }, [caseData]);


  
  useEffect(() => {
    const fetchListas = async () => {
      const res = await fetch("../../../../api/listas");
      const data = await res.json();
      setTipoDecisiones(data.tipo_decision || []);
      setTipoCaso(data.tipo_caso || []);
      setTipoRemision(data.tipo_remision || []);
    };
    fetchListas();
  }, []);
  

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

    setLocalCaseData((prev) => {
      const updated = { ...prev };

      if (name.startsWith("intervencion.")) {
        updated.intervencion = {
          ...updated.intervencion,
          [name.split(".")[1]]: value,
        };
      } else if (name.startsWith("rutaAtencion.")) {
        updated.rutaAtencion = {
          ...updated.rutaAtencion,
          [name.split(".")[1]]: type === "radio" ? parseInt(value) : value,
        };
      } else if (name === "es_confidencial") {
        updated[name] = parseInt(value);
      } else {
        updated[name] = value;
      }

      return updated;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split("T")[0];
  };


  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <Modal.Header className="bg-blue-600 text-white py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">Detalles del Caso #{localCaseData.id_caso}</h3>
      </Modal.Header>
      <Modal.Body className="p-6 bg-gray-50">
        <div className="space-y-4">
          {/* Estado */}
          <div>
            <p className="font-semibold text-md text-right w-full">
              Estado:
              <span className={`px-3 py-1 ml-2 rounded text-sm font-bold ${localCaseData.estado === "cerrado"
                ? "bg-red-500"
                : localCaseData.estado === "en seguimiento"
                ? "bg-yellow-500"
                : "bg-green-500"
              } text-white`}>
                {localCaseData.estado.charAt(0).toUpperCase() + localCaseData.estado.slice(1)}
              </span>
            </p>
          </div>

          {/* Datos Generales */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold border-b pb-2">Datos Generales</h5>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label value="ID del Caso" />
                <TextInput value={localCaseData.id_caso} readOnly />
              </div>
              <div>
                <Label value="Fecha del Caso" />
                <TextInput
                  type="date"
                  name="fecha_caso"
                  value={formatDate(localCaseData.fecha_caso)}
                  onChange={onChange}
                />
              </div>
              <div>
              <Label value="Tipo de Caso" />
              <Select name="tipo_caso" value={localCaseData.tipo_caso || ""} onChange={onChange}>
                <option>Seleccione un tipo</option>
                {tipoCaso.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </Select>
            </div>
                
              <div>
                <Label value="¿Es confidencial?" />
                <div className="flex gap-2 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="es_confidencial" value="1" checked={localCaseData.es_confidencial === 1} onChange={onChange} /> Sí
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="es_confidencial" value="0" checked={localCaseData.es_confidencial === 0} onChange={onChange} /> No
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actores */}
          <Separator className="my-4" />
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
                  {localCaseData.actores.map((actor, index) => (
                    <tr key={actor.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">{actor.rol}</td>
                      <td className="px-4 py-3">{actor.nombre_completo}</td>
                      <td className="px-4 py-3">{actor.tipo_documento}</td>
                      <td className="px-4 py-3">{actor.documento_id}</td>
                      <td className="px-4 py-3">{actor.nombre_acudiente}</td>
                      <td className="px-4 py-3">{actor.telefono_acudiente}</td>
                      <td className="px-4 py-3">{actor.email_acudiente}</td>
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
                {localCaseData.evidencias.map((evidencia, index) => (
                  <tr key={evidencia.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{evidencia.descripcion}</td>
                    <td className="px-4 py-3">{evidencia.tipo_archivo}</td>
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

          {/* Intervención */}
          <div className="mb-6 border p-6 rounded-xl shadow-lg bg-white">
            <h5 className="text-xl font-bold mb-4 text-gray-700">Intervención y decisión</h5>
            <Separator className="my-4" />
            <Label value="Tipo de decisión tomada" />
            <Select name="intervencion.tipo_decision" value={localCaseData.intervencion?.tipo_decision || ""} onChange={onChange}>
              <option>Seleccione un tipo</option>
              {tipoDecisiones.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </Select>

            <Label value="Decisión del comité de convivencia" className="mt-4" />
            <Textarea name="intervencion.decision_comite" value={localCaseData.intervencion?.decision_comite || ""} onChange={onChange} />

            <Label value="Compromisos adquiridos" className="mt-4" />
            <Textarea name="intervencion.compromisos" value={localCaseData.intervencion?.compromisos || ""} onChange={onChange} />

            <Label value="Fecha límite del compromiso" className="mt-4" />
            <TextInput
              type="date"
              name="intervencion.fecha_compromiso"
              value={formatDate(localCaseData.intervencion?.fecha_compromiso)}
              min={todayStr}
              onChange={onChange}
            />
          </div>

          {/* Ruta de atención */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ruta de atención</h2>
            <label className="block font-medium text-gray-600">¿Se activó ruta de atención?</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rutaAtencion.ruta_activada" value="1" checked={localCaseData.rutaAtencion?.ruta_activada === 1} onChange={onChange} /> Sí
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rutaAtencion.ruta_activada" value="0" checked={localCaseData.rutaAtencion?.ruta_activada === 0} onChange={onChange} /> No
              </label>
            </div>

            {localCaseData.rutaAtencion?.ruta_activada === 1 && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <Select name="rutaAtencion.tipo_remision" value={localCaseData.rutaAtencion?.tipo_remision || ""} onChange={onChange}>
                <option>Seleccione un tipo</option>
                {tipoRemision.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </Select>
                <TextInput name="rutaAtencion.fecha" type="date" value={formatDate(localCaseData.rutaAtencion?.fecha)} onChange={onChange} />
                <TextInput name="rutaAtencion.remitido" value={localCaseData.rutaAtencion?.remitido || ""} onChange={onChange} placeholder="Remitido a" />
                <TextInput name="rutaAtencion.institucion" value={localCaseData.rutaAtencion?.institucion || ""} onChange={onChange} placeholder="Institución" />
                <TextInput name="rutaAtencion.contacto" value={localCaseData.rutaAtencion?.contacto || ""} onChange={onChange} placeholder="Contacto" />
                <Textarea name="rutaAtencion.observaciones" value={localCaseData.rutaAtencion?.observaciones || ""} onChange={onChange} placeholder="Observaciones" />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 p-4 rounded-b-lg flex justify-end">
        <Button color="blue" onClick={actualizarCaso}>Guardar Cambios</Button>
        <Button color="gray" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseDetailsModal;
