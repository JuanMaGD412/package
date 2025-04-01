"use client";
import { useState } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";

const ModalEvidencias = ({ isOpen, onClose, newEvidence, setNewEvidence, addEvidence }) => {
  const [preview, setPreview] = useState(null); // Estado para la vista previa

  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewEvidence({ ...newEvidence, file });

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(file.name);
    }
  };

  const handleClose = () => {
    setPreview(null); // Limpiar la vista previa
    setNewEvidence({ description: "", file: null }); // Reiniciar datos
    onClose(); // Llamar la función original de cierre
  };

  const handleAccept = () => {
    addEvidence(); // Agregar evidencia
    setPreview(null); // Limpiar la vista previa
    setNewEvidence({ description: "", file: null }); // Reiniciar datos
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <Modal.Header>Agregar Evidencia</Modal.Header>
      <Modal.Body>
        <div>
          <Label htmlFor="descripcionEvidencia" value="Descripción del archivo" />
          <TextInput
            id="descripcionEvidencia"
            value={newEvidence.description}
            onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="archivoEvidencia" value="Subir archivo" />
          <input id="archivoEvidencia" type="file" onChange={handleFilePreview} className="block w-full border p-2 rounded" />
        </div>

        {preview && (
          <div className="mt-4 border p-2 rounded bg-gray-100">
            <Label value="Vista previa" className="block font-semibold" />
            {typeof preview === "string" && preview.startsWith("data:image") ? (
              <img src={preview} alt="Vista previa" className="mt-2 max-w-full h-auto rounded-lg shadow-md" />
            ) : (
              <p className="mt-2 text-gray-700">{preview}</p>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button color="blue" onClick={handleAccept}>
          Aceptar
        </Button>
        <Button color="gray" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEvidencias;
