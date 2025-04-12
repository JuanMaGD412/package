"use client";
import React, { useState } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { IoSearchCircle } from "react-icons/io5";
import ModalComunidad from "./modalcomunidad";

const Actores = ({ setActores, idCaso }) => {
  const [students, setStudents] = useState([]);
  const [affectedGrade, setAffectedGrade] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");

  const openModal = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onVincular = (estudiante) => {
    // Llenamos la tabla de actores con los datos del estudiante seleccionado
    setStudents((prev) => [
      ...prev,
      {
        id: estudiante.id,
        Nombre: estudiante.Nombre,
        Apellido1: estudiante.Apellido1,
        Apellido2: estudiante.Apellido2,
        TipoDocumento: estudiante.TipoDocumento,
        DocumentoId: estudiante.DocumentoId,
        rol: "Seleccione", // Esto es el valor inicial que puedes actualizar más tarde
        NombreAcudiente: estudiante.NombreAcudiente,
        Apellido1Acudiente: estudiante.Apellido1Acudiente,
        Apellido2Acudiente: estudiante.Apellido2Acudiente,
        TelefonoAcudiente: estudiante.TelefonoAcudiente,
        EmailAcudiente: estudiante.EmailAcudiente,
      },
    ]);
    closeModal();
  };

  const handleRolChange = (rol, index) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) =>
        i === index ? { ...student, rol: rol } : student
      )
    );
  };

  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h5 className="text-lg font-bold mb-4">Actores</h5>
      <Separator className="my-4" />

      <div className="mb-6">
        <TextInput
          type="text"
          placeholder="Buscar por grado"
          value={affectedGrade}
          onChange={(e) => setAffectedGrade(e.target.value)}
          className="w-40"
        />
        <Button color="white" onClick={() => openModal(affectedGrade)}>
          <IoSearchCircle size={37} />
        </Button>
      </div>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido 1</th>
            <th className="px-4 py-2">Apellido 2</th>
            <th className="px-4 py-2">Tipo Documento</th>
            <th className="px-4 py-2">Número Documento</th>
            <th className="px-4 py-2">Acudiente</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td className="px-4 py-2">
                <Select
                  value={student.rol}
                  onChange={(e) => handleRolChange(e.target.value, index)} // Actualiza el rol del estudiante seleccionado
                >
                  <option value="afectado">Afectado</option>
                  <option value="implicado">Implicado</option>
                  <option value="testigo">Testigo</option>
                  <option value="Seleccione">Seleccione</option> {/* Opción para seleccionar "Seleccione" */}
                </Select>
              </td>
              <td className="px-4 py-2">{student.Nombre}</td>
              <td className="px-4 py-2">{student.Apellido1}</td>
              <td className="px-4 py-2">{student.Apellido2}</td>
              <td className="px-4 py-2">{student.TipoDocumento}</td>
              <td className="px-4 py-2">{student.DocumentoId}</td>
              <td className="px-4 py-2">
                {student.NombreAcudiente || ""} {student.Apellido1Acudiente || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalComunidad
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedGrade={selectedGrade}
        onVincular={onVincular} // Pasamos la función onVincular como prop
      />
    </div>
  );
};

export default Actores;
