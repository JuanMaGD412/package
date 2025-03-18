"use client";
import { Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const Descricription = ({ onChange }) => {
  return (
    <div className="mb-6 border p-4 rounded-lg">
        {/* Descripción del caso */}
        <h5 className="text-lg font-bold mb-4">Descripción del caso</h5>
        <Separator className="my-4" />

        <h6 className="text-md font-semibold mt-6">Versión del estudiante afectado</h6>
        <Textarea id="version_estudiante_afectado" placeholder="Escribe el relato del incidente" required onChange={onChange} />
        
        <h6 className="text-md font-semibold mt-6">Versión del estudiante implicado</h6>
        <Textarea id="version_estudiante_implicado" placeholder="Escribe el relato del incidente" required onChange={onChange} />
        
        <h6 className="text-md font-semibold mt-6">Versión de los testigos</h6>
        <Textarea id="version_testigos" placeholder="Escribe el relato del incidente" required onChange={onChange} />
    </div>
  );
};

export default Descricription;
