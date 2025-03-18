"use client";
import { Button, Table } from "flowbite-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator"
import ModalEvidencias from "./ModalEvidencias";
const Evidencias = ({setEvidencias, idCaso }) => {
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [evidences, setLocalEvidences] = useState([]);
    const [newEvidence, setNewEvidence] = useState({ id_caso: idCaso, description: "", file: null, size: "" });
    const openEvidenceModal = () => {
         setNewEvidence({ id_caso: idCaso, description: "", file: null, size: "" });
         setIsEvidenceModalOpen(true);
    };
    const closeEvidenceModal = () => {
        setIsEvidenceModalOpen(false);
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setNewEvidence({ ...newEvidence, file, size: `${(file.size / 1024 / 1024).toFixed(2)} MB` });
        }
      };
      const addEvidence = () => {
        if (newEvidence.description && newEvidence.file) {
          const updatedEvidence = { 
            ...newEvidence, 
            id_caso: idCaso // ✅ Agregamos el id del caso correctamente dentro del objeto
        };
        const updatedEvidences = [...evidences, updatedEvidence];
          setLocalEvidences(updatedEvidences);
          setEvidencias(updatedEvidences); // ✅ Actualizamos el estado global
          closeEvidenceModal();
        }
      };
      const deleteEvidence = (index) => {
        setEvidences(evidences.filter((_, i) => i !== index));
      };
    
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
        <div className="mb-6 border p-4 rounded-lg">
        {/* Evidencias */}
        <h5 className="text-lg font-bold mb-4">Evidencias</h5>
              <Separator className="my-4" />
              <Button onClick={openEvidenceModal} color="blue" className="my-4">Agregar evidencia</Button>
              <Table className="mt-4">
              <Table.Head>
                <Table.HeadCell>Fecha</Table.HeadCell>
                <Table.HeadCell>Descripción</Table.HeadCell>
                <Table.HeadCell>Tipo de Archivo</Table.HeadCell> {/* Nueva columna */}
                <Table.HeadCell>Tamaño</Table.HeadCell>
                <Table.HeadCell>Acciones</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                  {evidences.map((evidence, index) => (
                      <Table.Row key={index}>
                          <Table.Cell>{new Date().toLocaleDateString()}</Table.Cell>
                          <Table.Cell>{evidence.description}</Table.Cell>
                          <Table.Cell>{evidence.file.type}</Table.Cell> {/* Mostrar el tipo de archivo */}
                          <Table.Cell>{evidence.size}</Table.Cell>
                          <Table.Cell className="flex gap-2">
                              <Button size="xs" color="red" onClick={() => deleteEvidence(index)}>Eliminar</Button>
                              <Button size="xs" color="green" onClick={() => downloadEvidence(evidence.file)}>Descargar</Button>
                          </Table.Cell>
                      </Table.Row>
                  ))}
              </Table.Body>
              </Table>
              {/* Modal de Evidencias */}
            <ModalEvidencias isOpen={isEvidenceModalOpen} onClose={closeEvidenceModal} newEvidence={newEvidence} setNewEvidence={setNewEvidence} addEvidence={addEvidence} handleFileChange={handleFileChange} />
      </div>
    
      );
};

export default Evidencias;
