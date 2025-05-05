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
  const [allGrades, setAllGrades] = useState([]);


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
  
  const eliminarActor = (index) => {
    const nuevosActores = [...students];
    nuevosActores.splice(index, 1);
    setStudents(nuevosActores);
    setActores(nuevosActores);
  };
  
  const handleRolChange = (rol, index) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) =>
        i === index ? { ...student, rol: rol } : student
      )
    );
  };

  const filteredGrades = allGrades.filter((grado) =>
    grado.toLowerCase().includes(studentsGrade.toLowerCase())
  );
  
  

  useEffect(() => {
  setActores(students);
}, [students]);

useEffect(() => {
  const fetchGrados = async () => {
    try {
      const response = await fetch("../../../../api/comunidad/gradoAyuda");
      const data = await response.json();
      setAllGrades(data);
    } catch (error) {
      console.error("Error al obtener grados:", error);
    }
  };

  fetchGrados();
}, []);


  return (
    <div className="mb-1 border p-4 rounded-lg shadow-sm bg-white w-320 scale-[0.75]  origin-left">
    <h5 className="text-xl font-semibold text-gray-800 mb-4">Actores</h5>
    <Separator className="my-4" />
  
    <div className="flex items-center gap-4 mb-6">
    <div className="relative w-48">
      <TextInput type="text"
        placeholder="Buscar por grado (Salón)"
        value={studentsGrade}
        onChange={(e) => setStudentsGrade(e.target.value)}
        className="w-full"/> {studentsGrade && filteredGrades.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded mt-1 shadow max-h-40 overflow-y-auto">
          {filteredGrades.map((grado, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setStudentsGrade(grado);
                openModal(grado.toUpperCase());
              }}
            >
              {grado}
            </li>
          ))}
        </ul>)} </div>
    <Button color="gray" onClick={() => openModal(studentsGrade.toUpperCase())} className="p-0">
      <IoSearchCircle size={36} className="text-blue-600 hover:text-blue-800 transition" />
    </Button>
    </div>
  
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
        <thead className="bg-gray-100 border-b border-gray-300 text-xs uppercase font-semibold">
          <tr>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Nombre completo</th>
            <th className="px-4 py-3">Documento</th>
            <th className="px-4 py-3">Acudiente</th>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Acción</th>
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
              <td className="px-4 py-3">
                {student.tipo_documento} - {student.documento_id}
              </td>
              <td className="px-4 py-3">{student.nombre_acudiente}</td>
              <td className="px-4 py-3">{student.telefono_acudiente}</td>
              <td className="px-4 py-3">{student.email_acudiente}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => eliminarActor(index)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Eliminar
                </button>
              </td>
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
