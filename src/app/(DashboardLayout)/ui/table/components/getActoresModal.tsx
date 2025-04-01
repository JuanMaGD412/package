"use client";
import React from "react";
import { TextInput } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const GetActoresModal = ({ caseData }) => {
    return (
        <div>
            <Separator className="my-4" />
            <h5 className="text-lg font-bold">Actores Involucrados</h5>
            
            {/* Estudiantes Afectados */}
            {caseData?.actores?.filter(actor => actor.rol === "afectado").map((actor, index) => (
                <div key={index} className="mb-6 border p-4 rounded-lg">
                    <h6 className="text-md font-semibold">Estudiante afectado {index + 1}</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" value={actor.nombre || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" value={actor.apellido1 || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" value={actor.apellido2 || ""} readOnly />
                        <TextInput type="text" placeholder="Tipo de documento" value={actor.tipo_documento || ""} readOnly />
                        <TextInput type="text" placeholder="Número de documento" value={actor.documento_id || ""} readOnly />
                    </div>
                    <h6 className="text-md font-semibold mt-6">Acudiente</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" value={actor.nombre_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" value={actor.apellido1_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" value={actor.apellido2_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Número de teléfono" value={actor.telefono_acudiente || ""} readOnly />
                        <TextInput type="email" placeholder="Correo electrónico" value={actor.email_acudiente || ""} readOnly />
                    </div>
                </div>
            ))}
            
            {/* Estudiantes Implicados */}
            {caseData?.actores?.filter(actor => actor.rol === "implicado").map((actor, index) => (
                <div key={index} className="mb-6 border p-4 rounded-lg">
                    <h6 className="text-md font-semibold">Estudiante implicado {index + 1}</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" value={actor.nombre || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" value={actor.apellido1 || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" value={actor.apellido2 || ""} readOnly />
                        <TextInput type="text" placeholder="Tipo de documento" value={actor.tipo_documento || ""} readOnly />
                        <TextInput type="text" placeholder="Número de documento" value={actor.documento_id || ""} readOnly />
                    </div>
                    <h6 className="text-md font-semibold mt-6">Acudiente</h6>
                    <div className="grid grid-cols-3 gap-4">
                        <TextInput type="text" placeholder="Nombres" value={actor.nombre_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 1" value={actor.apellido1_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Apellido 2" value={actor.apellido2_acudiente || ""} readOnly />
                        <TextInput type="text" placeholder="Número de teléfono" value={actor.telefono_acudiente || ""} readOnly />
                        <TextInput type="email" placeholder="Correo electrónico" value={actor.email_acudiente || ""} readOnly />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GetActoresModal;
