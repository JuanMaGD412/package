"use client";
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const Intervention = ({ onChange }) => {
  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h5 className="text-lg font-bold mb-4">Intervención y decisión</h5>
      <Separator className="my-4" />

      <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
      <Select id="tipoDecision" required onChange={onChange}>
        <option>Seleccione un tipo</option>
        <option value="Tarea pedagogica">Tarea pedagogíca</option>
        <option value="Suspension">Suspensión</option>
        <option value="Reparacion">Reparación</option>
      </Select>

      <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
      <Textarea id="decisionComite" placeholder="Escribe la decisión tomada" required onChange={onChange} />

      <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
      <Textarea id="compromisos" placeholder="Escribe aquí los compromisos adquiridos" required onChange={onChange} />

      <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
      <TextInput id="fechaCompromiso" type="date" required onChange={onChange} />
    </div>
  );
};

export default Intervention;
