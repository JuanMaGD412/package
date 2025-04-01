"use client";
import React, { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { IoSearchCircle } from "react-icons/io5";
import ModalComunidad from "./modalcomunidad";

const Actores = ({ setActores, idCaso }) => {
    const [students, setStudents] = useState([{ id: 1, grado: "" }]);
    const [implicatedStudents, setImplicatedStudents] = useState([{ id: 1, grado: "" }]);
    const [affectedGrade, setAffectedGrade] = useState("");
    const [involvedGrade, setInvolvedGrade] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentType, setSelectedStudentType] = useState("");
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);

    const openModal = (grade, type, index) => {
        setSelectedGrade(grade);
        setSelectedStudentType(type);
        setSelectedStudentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addStudent = () => {
        setStudents([...students, { id: students.length + 1, grado: "" }]);
    };

    const deleteStudent = () => {
        setStudents(students.slice(0, students.length - 1)); // Elimina el último estudiante
    };

    const addImplicatedStudent = () => {
        setImplicatedStudents([...implicatedStudents, { id: implicatedStudents.length + 1, grado: "" }]);
    };

    const deleteImplicatedStudent = () => {
        setImplicatedStudents(implicatedStudents.slice(0, implicatedStudents.length - 1)); // Elimina el último estudiante
    };

    const handleVincular = (comunidad) => {
        if (!comunidad) return;
        
    
        console.log("Vinculando estudiante con idCaso:", idCaso);
    
        const estudianteActualizado = {
            id_caso: idCaso,  
            id: comunidad.Id,
            rol: selectedStudentType,
            Nombre: comunidad.Nombre,  // 🔹 Convertido a mayúscula para la UI
            Apellido1: comunidad.Apellido1,
            Apellido2: comunidad.Apellido2,
            TipoDocumento: comunidad.TipoDocumento,
            DocumentoId: comunidad.DocumentoId,
            NombreAcudiente: comunidad.NombreAcudiente,
            Apellido1Acudiente: comunidad.Apellido1Acudiente,
            Apellido2Acudiente: comunidad.Apellido2Acudiente,
            TelefonoAcudiente: comunidad.TelefonoAcudiente,
            EmailAcudiente: comunidad.EmailAcudiente,
        };
    
        if (selectedStudentType === "afectado") {
            setStudents((prev) => {
                const newStudents = [...prev];
                newStudents[selectedStudentIndex] = estudianteActualizado;
                return newStudents;
            });
        } else {
            setImplicatedStudents((prev) => {
                const newStudents = [...prev];
                newStudents[selectedStudentIndex] = estudianteActualizado;
                return newStudents;
            });
        }
    
        setActores([...students, ...implicatedStudents]); 
        closeModal();
    };
    
    
    
    

    // **Actualizar `setActores` cuando cambian `students` o `implicatedStudents`**
    useEffect(() => {
        const actoresTransformados = [...students, ...implicatedStudents].map(actor => ({
            id_caso: idCaso,
            id: actor.id,
            rol: actor.rol,
            nombre: actor.Nombre,  
            apellido1: actor.Apellido1,
            apellido2: actor.Apellido2,
            tipo_documento: actor.TipoDocumento,
            documento_id: actor.DocumentoId,
            nombre_acudiente: actor.NombreAcudiente || null,
            apellido1_acudiente: actor.Apellido1Acudiente || null,
            apellido2_acudiente: actor.Apellido2Acudiente || null,
            telefono_acudiente: actor.TelefonoAcudiente || null,
            email_acudiente: actor.EmailAcudiente || null,
        }));
    
        setActores(actoresTransformados);
    }, [students, implicatedStudents, idCaso, setActores]);
    

    return (
        <div className="mb-6 border p-4 rounded-lg">
            <h5 className="text-lg font-bold mb-4">Actores</h5>
            <Separator className="my-4" />

            {students.map((student, index) => (
                <div key={student.id} className="mb-6 border p-4 rounded-lg">
                    <h6 className="text-md font-semibold">Estudiante afectado {index + 1}</h6>
                    <div className="flex items-center gap-2">
                        <TextInput type="text" placeholder="Grado" required className="w-20" value={affectedGrade} onChange={(e) => setAffectedGrade(e.target.value)} />
                        <Button color="white" className="my-4" onClick={() => openModal(affectedGrade, "afectado", index)}>
                            <IoSearchCircle size={37} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" required value={student.Nombre || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" required value={student.Apellido1 || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" required value={student.Apellido2 || ""} readOnly />
                        <TextInput type="text" placeholder="Tipo de documento" required value={student.TipoDocumento || ""} readOnly />
                        <TextInput type="text" placeholder="Número de documento" required value={student.DocumentoId || ""} readOnly />
                    </div>

                    <h6 className="text-md font-semibold mt-6">Acudiente</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" required value={student.NombreAcudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" required value={student.Apellido1Acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" required value={student.Apellido2Acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Número de teléfono" required value={student.TelefonoAcudiente || ""} readOnly />
                        <TextInput type="email" placeholder="Correo electrónico" required value={student.EmailAcudiente || ""} readOnly />
                    </div>
                </div>
            ))}

            <Button onClick={addStudent} color="blue" className="my-4">
                Agregar otro estudiante afectado
            </Button>
            <Button onClick={deleteStudent} color="red" className="my-4" style={{ display: students.length > 1 ? 'inline-block' : 'none' }}>
                Eliminar un estudiante afectado
            </Button>

            {implicatedStudents.map((student, index) => (
                <div key={student.id} className="mb-6 border p-4 rounded-lg">
                    <h6 className="text-md font-semibold">Estudiante implicado {index + 1}</h6>
                    <div className="flex items-center gap-2">
                        <TextInput type="text" placeholder="Grado" required className="w-20" value={involvedGrade} onChange={(e) => setInvolvedGrade(e.target.value)} />
                        <Button color="white" className="my-4" onClick={() => openModal(involvedGrade, "implicado", index)}>
                            <IoSearchCircle size={37} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" required value={student.Nombre || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" required value={student.Apellido1 || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" required value={student.Apellido2 || ""} readOnly />
                        <TextInput type="text" placeholder="Tipo de documento" required value={student.TipoDocumento || ""} readOnly />
                        <TextInput type="text" placeholder="Número de documento" required value={student.DocumentoId || ""} readOnly />
                    </div>

                    <h6 className="text-md font-semibold mt-6">Acudiente</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" required value={student.NombreAcudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" required value={student.Apellido1Acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" required value={student.Apellido2Acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Número de teléfono" required value={student.TelefonoAcudiente || ""} readOnly />
                        <TextInput type="email" placeholder="Correo electrónico" required value={student.EmailAcudiente || ""} readOnly />
                    </div>
                </div>
            ))}

            <Button onClick={addImplicatedStudent} color="blue" className="my-4">
                Agregar otro estudiante implicado
            </Button>
            <Button onClick={deleteImplicatedStudent} color="red" className="my-4" style={{ display: implicatedStudents.length > 1 ? 'inline-block' : 'none' }}>
                Eliminar un estudiante afectado
            </Button>


            <ModalComunidad isOpen={isModalOpen} onClose={closeModal} selectedGrade={selectedGrade} onVincular={handleVincular} />
        </div>
    );
};

export default Actores;
