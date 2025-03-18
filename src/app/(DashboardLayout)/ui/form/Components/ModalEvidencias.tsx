"use client";
import { Modal, Button, Label, TextInput } from "flowbite-react";

const ModalEvidencias = ({ isOpen, onClose, newEvidence, setNewEvidence, addEvidence, handleFileChange }) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <Modal.Header>Agregar Evidencia</Modal.Header>
      <Modal.Body>
        <Label htmlFor="descripcionEvidencia" value="Descripción del archivo" />
        <TextInput
          id="descripcionEvidencia"
          value={newEvidence.description}
          onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
          required
        />

        <Label htmlFor="archivoEvidencia" value="Subir archivo" className="mt-4" />
        <input id="archivoEvidencia" type="file" onChange={handleFileChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={addEvidence}>
          Aceptar
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEvidencias;
