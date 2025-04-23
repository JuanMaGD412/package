"use client";
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Intervention = ({ onChange }) => {
  const [fechaError, setFechaError] = useState("");

  // Formatea la fecha de hoy en YYYY-MM-DD para el atributo min
  const todayStr = new Date().toISOString().split("T")[0];

  const handleFechaChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onChange(e);
  };

  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h5 className="text-lg font-bold mb-4">Intervención y decisión</h5>
      <Separator className="my-4" />

      <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
      <Select id="tipoDecision" required onChange={onChange}>
        <option>Seleccione un tipo</option>
        <option value="Tarea pedagogica">Tarea pedagógica</option>
        <option value="Suspension">Suspensión</option>
        <option value="Reparacion">Reparación</option>
      </Select>

      <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
      <Textarea id="decisionComite" placeholder="Escribe la decisión tomada" required onChange={onChange} />

      <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
      <Textarea id="compromisos" placeholder="Escribe aquí los compromisos adquiridos" required onChange={onChange} />

      <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
      <TextInput
        id="fechaCompromiso"
        type="date"
        min={todayStr}
        required
        onChange={handleFechaChange}
      />
      {fechaError && <p className="text-red-500 text-sm mt-1">{fechaError}</p>}
    </div>
  );
};

export default Intervention;
