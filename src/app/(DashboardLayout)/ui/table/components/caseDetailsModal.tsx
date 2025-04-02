"use client";
import React from "react";
import { Modal, Button, TextInput, Label, Select, Textarea,Table } from "flowbite-react";
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
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <h3 className="text-lg font-semibold">Detalles del Caso #{caseData.Id_Caso}</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-3">
          <p><strong>Ruta de Atención:</strong> {caseData.rutaAtencion?.ruta_activada ? "Sí" : "No"}</p>
          <p><strong>Estado:</strong> <span className={`px-2 py-1 rounded ${caseData.estado === "Cerrado" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}>{caseData.estado}</span></p>
        </div>

        <Separator className="my-4" />
        {/* Información básica */}
        <div className="mb-6 border p-4 rounded-lg">
              <h5 className="text-lg font-bold mb-4">Datos generales del Caso</h5>
              <Separator className="my-4" />
        
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="Id_Caso" value="ID del Caso" />
                  <TextInput id="Id_Caso" name="Id_Caso" value={caseData.Id_Caso} required readOnly/>
                </div>
                <div>
                  <Label htmlFor="fecha_caso" value="Fecha del caso" />
                  <TextInput id="fecha_caso" name="fecha_caso" type="date" value={new Date(caseData.fecha_caso).toLocaleDateString("en-CA")} required readOnly />
                </div>
                <div>
                  <Label htmlFor="tipo_caso" value="Tipo de caso" />
                  <Select id="tipo_caso" name="tipo_caso" value={caseData.tipo_caso} required disabled>
                    <option value="">Seleccione un tipo</option>
                    <option value="salud">Situación de salud</option>
                    <option value="disciplinario">Disciplinario</option>
                  </Select>
                </div>
                <div>
                  <Label value="¿El caso es confidencial?" />
                  <div className="flex gap-2">
                    <label>
                      <input type="radio" name="es_confidencial" value="1" checked={caseData.es_confidencial === 1} disabled /> Sí
                    </label>
                    <label>
                      <input type="radio" name="es_confidencial" value="0" checked={caseData.es_confidencial === 0} disabled /> No
                    </label>
                  </div>
                </div>
              </div>
        </div>

        {/* Actores */}
        <div className="mb-6 border p-4 rounded-lg">
        <h5 className="text-lg font-bold">Actores Involucrados</h5>
        <Separator className="my-4" />

        {/* Estudiantes Afectados */}
        {caseData.actores.filter(actor => actor.rol === "afectado").map((actor, index) => (
          <div key={index} className="mb-6 border p-4 rounded-lg">
            <h6 className="text-md font-semibold">Estudiante afectado {index + 1}</h6>
            <div className="grid grid-cols-3 gap-4">
              <TextInput type="text" placeholder="Nombres" required value={actor.nombre || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1 || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2 || ""} readOnly />
              <TextInput type="text" placeholder="Tipo de documento" required value={actor.tipo_documento || ""} readOnly />
              <TextInput type="text" placeholder="Número de documento" required value={actor.documento_id || ""} readOnly />
            </div>
            <h6 className="text-md font-semibold mt-6">Acudiente</h6>
            <div className="grid grid-cols-3 gap-4">
              <TextInput type="text" placeholder="Nombres" required value={actor.nombre_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Número de teléfono" required value={actor.telefono_acudiente || ""} readOnly />
              <TextInput type="email" placeholder="Correo electrónico" required value={actor.email_acudiente || ""} readOnly />
            </div>
          </div>
        ))}

        {/* Estudiantes Implicados */}
        {caseData.actores.filter(actor => actor.rol === "implicado").map((actor, index) => (
          <div key={index} className="mb-6 border p-4 rounded-lg">
            <h6 className="text-md font-semibold">Estudiante implicado {index + 1}</h6>
            <div className="grid grid-cols-3 gap-4">
              <TextInput type="text" placeholder="Nombres" required value={actor.nombre || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1 || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2 || ""} readOnly />
              <TextInput type="text" placeholder="Tipo de documento" required value={actor.tipo_documento || ""} readOnly />
              <TextInput type="text" placeholder="Número de documento" required value={actor.documento_id || ""} readOnly />
            </div>
            <h6 className="text-md font-semibold mt-6">Acudiente</h6>
            <div className="grid grid-cols-3 gap-4">
              <TextInput type="text" placeholder="Nombres" required value={actor.nombre_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 1" required value={actor.apellido1_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Apellido 2" required value={actor.apellido2_acudiente || ""} readOnly />
              <TextInput type="text" placeholder="Número de teléfono" required value={actor.telefono_acudiente || ""} readOnly />
              <TextInput type="email" placeholder="Correo electrónico" required value={actor.email_acudiente || ""} readOnly />
            </div>
          </div>
        ))}
        </div>
        
        {/* Descripción del caso */}
        <div className="mb-6 border p-4 rounded-lg">
                <h5 className="text-lg font-bold mb-4">Descripción del caso</h5>
                <Separator className="my-4" />
        
                <h6 className="text-md font-semibold mt-6">Versión del estudiante afectado</h6>
                <Textarea id="version_estudiante_afectado" required value={caseData.descripcion?.version_estudiante_afectado || ""} readOnly/>
                
                <h6 className="text-md font-semibold mt-6">Versión del estudiante implicado</h6>
                <Textarea id="version_estudiante_implicado" required value={caseData.descripcion?.version_estudiante_implicado  || ""} readOnly/>
                
                <h6 className="text-md font-semibold mt-6">Versión de los testigos</h6>
                <Textarea id="version_testigos" required value={caseData.descripcion?.version_testigos   || ""} readOnly />
        </div>

        {/* Tabla de evidencias */}
        <div className="mb-6 border p-4 rounded-lg">
          <h5 className="text-lg font-bold mb-4">Evidencias</h5>
          <Separator className="my-4" />
          <Table className="mt-4">
            <Table.Head>
              <Table.HeadCell>Descripción</Table.HeadCell>
              <Table.HeadCell>Tipo de Archivo</Table.HeadCell>
              <Table.HeadCell>Tamaño</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {caseData.evidencias.map((evidence, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{evidence.descripcion || "Sin descripción"}</Table.Cell>
                  <Table.Cell>{evidence.tipo_archivo || "Desconocido"}</Table.Cell>
                  <Table.Cell>{evidence.tamano_archivo} MB</Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <Button size="xs" color="green" onClick={() => downloadEvidence(evidence.file)}>Descargar</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        {/* Intervención y decisión */}
        <div className="mb-6 border p-4 rounded-lg">
          <h5 className="text-lg font-bold mb-4">Intervención y decisión</h5>
          <Separator className="my-4" />
    
          <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
          <Select id="tipoDecision" value={caseData.intervencion?.tipo_decision || ''} required disabled>
            <option>Seleccione un tipo</option>
            <option value="Tarea pedagogica">Tarea pedagogíca</option>
            <option value="Suspension">Suspensión</option>
            <option value="Reparacion">Reparación</option>
          </Select>
    
          <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
          <Textarea id="decisionComite" value={caseData.intervencion?.decision_comite || ''} required disabled/>
    
          <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
          <Textarea id="compromisos" value={caseData.intervencion?.compromisos || ''} required disabled/>
    
          <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
          <TextInput id="fechaCompromiso" value={new Date(caseData.intervencion?.fecha_compromiso).toLocaleDateString("en-CA")} required readOnly />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseDetailsModal;
