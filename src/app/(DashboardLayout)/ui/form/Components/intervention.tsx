"use client";
import {  Label, Select, TextInput, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator"


const Intervention =() => {
  return (
    <div className="mb-6 border p-4 rounded-lg">
    {/* Intervención y decisión */}
    <h5 className="text-lg font-bold mb-4">Intervención y decisión</h5>
            <Separator className="my-4" />
            <div>
            <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
            <Select id="tipoDecision" required>
                <option>Seleccione un tipo</option>
            </Select>
            </div>
            <div className="mt-4">
            <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" />
            <Textarea id="decisionComite" placeholder="Escribe la decisión tomada" required />
            </div>
            <div className="mt-4">
            <Label htmlFor="compromisos" value="Compromisos adquiridos" />
            <Textarea id="compromisos" placeholder="Escribe aquí los compromisos adquiridos" required />
            </div>
            <div className="mt-4">
            <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" />
            <TextInput id="fechaCompromiso" type="date" required />
            </div>
    </div>
  );
};

export default Intervention;
