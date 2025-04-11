"use client";
import React from "react";
import { Modal, Button, TextInput, Label, Select, Textarea, Table } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;

  const downloadEvidence = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" className="rounded-lg shadow-xl">
      <Modal.Header className="bg-blue-600 text-white py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Detalles del Caso #{caseData.Id_Caso}</h3>
      </Modal.Header>
      <Modal.Body className="p-6 bg-gray-50">
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <p className="text-md font-medium">Estado <span className="font-semibold"></span></p>
            <span className={`px-3 py-1 rounded text-sm font-bold  ${caseData.estado === "cerrado" ? "bg-red-500 text-white" : caseData.estado === "en seguimiento" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>{caseData.estado}</span>
          </div>
          {/* Información general */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold border-b pb-2">Datos Generales</h5>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label value="ID del Caso" />
                <TextInput value={caseData.Id_Caso} readOnly />
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

            {caseData.actores.map((actor, index) => (
              <div key={index} className="mb-6 border p-6 rounded-lg shadow bg-white">
                <h6 className="text-lg font-semibold text-gray-700">
                  {actor.rol === "afectado" ? `Estudiante afectado ${index + 1}` : `Estudiante implicado ${index + 1}`}
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <TextInput type="text" placeholder="Nombres" required value={actor.nombre || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1 || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2 || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Tipo de documento" required value={actor.tipo_documento || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Número de documento" required value={actor.documento_id || ""} readOnly className="rounded-md border-gray-300" />
                </div>
                <h6 className="text-md font-semibold text-gray-600 mt-6">Acudiente</h6>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  <TextInput type="text" placeholder="Nombres" required value={actor.nombre_acudiente || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1_acudiente || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2_acudiente || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="text" placeholder="Número de teléfono" required value={actor.telefono_acudiente || ""} readOnly className="rounded-md border-gray-300" />
                  <TextInput type="email" placeholder="Correo electrónico" required value={actor.email_acudiente || ""} readOnly className="rounded-md border-gray-300" />
                </div>
              </div>
            ))}
          </div>
          {/* Evidencias */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold border-b pb-2">Evidencias</h5>
            <Table className="mt-4 border rounded-lg">
              <Table.Head>
                <Table.HeadCell>Descripción</Table.HeadCell>
                <Table.HeadCell>Tipo</Table.HeadCell>
                <Table.HeadCell>Tamaño</Table.HeadCell>
                <Table.HeadCell>Acciones</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {caseData.evidencias.map((evidence, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{evidence.descripcion || "Sin descripción"}</Table.Cell>
                    <Table.Cell>{evidence.tipo_archivo || "Desconocido"}</Table.Cell>
                    <Table.Cell>{evidence.tamano_archivo} MB</Table.Cell>
                    <Table.Cell>
                      <Button size="xs" color="green" onClick={() => downloadEvidence(evidence.file)}>Descargar</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          {/* Intervención y decisión */}
          <div className="mb-6 border p-6 rounded-xl shadow-lg bg-white">
            <h5 className="text-xl font-bold mb-4 text-gray-700">Intervención y decisión</h5>
            <Separator className="my-4" />

            <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" className="font-medium text-gray-600" />
            <Select
              id="tipoDecision"
              value={caseData.intervencion?.tipo_decision || ''}
              required
              disabled
              className="border p-2 rounded-lg w-full mt-1 bg-gray-100"
            >
              <option>Seleccione un tipo</option>
              <option value="Tarea pedagogica">Tarea pedagógica</option>
              <option value="Suspension">Suspensión</option>
              <option value="Reparacion">Reparación</option>
            </Select>

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
                <select className="border p-2 w-full rounded-lg bg-gray-100" value={caseData.rutaAtencion?.tipo_remision} required disabled>
                  <option>Seleccione un tipo</option>
                  <option>Urgente</option>
                  <option>Regular</option>
                </select>

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
                  <Label htmlFor="responsable" value="Responsable" />
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
