"use client";
import React, { useState, useEffect } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { IoSearchCircle } from "react-icons/io5";
import ModalComunidad from "./modalcomunidad";

const Actores = ({ setActores, idCaso }) => {
  const [students, setStudents] = useState([]);
  const [studentsGrade, setStudentsGrade] = useState("");
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
    const nombreCompletoEstudiante = `${estudiante.nombre} ${estudiante.apellido1} ${estudiante.apellido2}`;
    const nombreCompletoAcudiente = `${estudiante.nombreacudiente} ${estudiante.apellido1acudiente} ${estudiante.apellido2acudiente}`;
  
    const nuevoEstudiante = {
      id_caso: idCaso,
      id: estudiante.id,
      nombre_completo: nombreCompletoEstudiante,
      tipo_documento: estudiante.tipodocumento,
      documento_id: estudiante.documentoid,
      rol: "",
      nombre_acudiente: nombreCompletoAcudiente,
      telefono_acudiente: estudiante.telefonoacudiente,
      email_acudiente: estudiante.emailacudiente,
    };
    
  
    const nuevosEstudiantes = [...students, nuevoEstudiante];
    setStudents(nuevosEstudiantes);
    setActores(nuevosEstudiantes);
    closeModal();
  };
  

  const handleRolChange = (rol, index) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) =>
        i === index ? { ...student, rol: rol } : student
      )
    );
  };
  

  useEffect(() => {
  setActores(students);
}, [students]);

  return (
    <div className="mb-6 border p-6 rounded-xl shadow-sm bg-white">
    <h5 className="text-xl font-semibold text-gray-800 mb-4">Actores</h5>
    <Separator className="my-4" />
  
    <div className="flex items-center gap-4 mb-6">
      <TextInput type="text" placeholder="Buscar por grado(Salón)"value={studentsGrade}onChange={(e) => setStudentsGrade(e.target.value)} className="w-48"/>
      <Button color="gray" onClick={() => openModal(studentsGrade)} className="p-0">
        <IoSearchCircle size={36} className="text-blue-600 hover:text-blue-800 transition" />
      </Button>
    </div>
  
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
          {students.map((student, index) => (
            <tr key={student.id}className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3">
              <Select
                value={student.rol}
                onChange={(e) => handleRolChange(e.target.value, index)}
              >
                <option value="">Seleccione un rol</option>
                <option value="afectado">Afectado</option>
                <option value="implicado">Implicado</option>
                <option value="testigo">Testigo</option>
              </Select>

              </td>
              <td className="px-4 py-3">{student.nombre_completo}</td>
              <td className="px-4 py-3">{student.tipo_documento}</td>
              <td className="px-4 py-3">{student.documento_id}</td>
              <td className="px-4 py-3">{student.nombre_acudiente}</td>
              <td className="px-4 py-3">{student.telefono_acudiente}</td>
              <td className="px-4 py-3">{student.email_acudiente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    <ModalComunidad
      isOpen={isModalOpen}
      onClose={closeModal}
      selectedGrade={selectedGrade}
      onVincular={onVincular}
      actores={students} 
    />


    </div>
  
  );
};

export default Actores;
