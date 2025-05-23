"use client";
import React, { useEffect, useState } from "react";
import { Modal, Label, TextInput, Textarea, Select, Button } from "flowbite-react";
import { guardarSeguimiento } from "../funciones/guardarSeguimiento";


type EstadoAvance = "En seguimiento" | "Cerrado";

interface SeguimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: {
    id_caso: string;
    tipo_caso: string;
  } | null;
}

const SeguimientoModal: React.FC<SeguimientoModalProps> = ({ isOpen, onClose, caseData }) => {
  const [responsable, setResponsable] = useState("");
  const [observacion, setObservacion] = useState("");
  const [estadoAvance, setEstadoAvance] = useState<EstadoAvance>("En seguimiento");
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaActual(hoy);
  }, []);

  const handleGuardar = async () => {
    if (!caseData?.id_caso) {
      alert("No se ha seleccionado un caso válido.");
      return;
    }
  
    const resultado = await guardarSeguimiento(
      caseData.id_caso,
      responsable,
      fechaActual,
      observacion,
      estadoAvance
    );
  
    if (resultado.success) {
      alert("Seguimiento guardado correctamente.");
  
      
      setResponsable("");
      setObservacion("");
      setEstadoAvance("En seguimiento");
      setFechaActual(new Date().toISOString().split("T")[0]);
  
      onClose(); 
    } else {
      alert("Error al guardar el seguimiento: " + resultado.message);
    }
  };
  

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <Modal.Header className="bg-blue-600 text-white">Iniciar Seguimiento</Modal.Header>
      <Modal.Body >
        <div className="space-y-4">
          {/* Info del caso */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">
              Caso seleccionado: <strong>{caseData?.id_caso}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Tipo: <strong>{caseData?.tipo_caso}</strong>
            </p>
          </div>

          {/* Responsable y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
            <div>
              <Label htmlFor="responsable" value="Responsable" />
              <TextInput
                id="responsable"
                placeholder="Nombre completo"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fecha" value="Fecha del seguimiento" />
              <TextInput
                id="fecha"
                type="text"
                value={fechaActual}
                disabled
                className="cursor-not-allowed bg-gray-100"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white p-4 rounded-lg shadow">
            <Label htmlFor="observacion" value="Observaciones del seguimiento" />
            <Textarea
              id="observacion"
              placeholder="Describa el seguimiento realizado..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          {/* Estado / Avance */}
          <div className="bg-white p-4 rounded-lg shadow">
            <Label htmlFor="estadoAvance" value="Estado / Avance del caso" />
            <Select
              id="estadoAvance"
              value={estadoAvance}
              onChange={(e) => setEstadoAvance(e.target.value as EstadoAvance)}
            >
              <option value="En seguimiento">En seguimiento</option>
              <option value="Cerrado">Cerrado</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100">
        <Button color="gray" onClick={onClose}>Cancelar</Button>
        <Button color="blue" onClick={handleGuardar}>Guardar Seguimiento</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SeguimientoModal;
