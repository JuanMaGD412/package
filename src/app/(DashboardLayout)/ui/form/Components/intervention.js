"use client";
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const Intervention = ({ onChange }) => {
  const [fechaError, setFechaError] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];
  const [tipoDecisiones, setTipoDecisiones] = useState([]);

  useEffect(() => {
    const fetchTipoDecisiones = async () => {
      const res = await fetch("../../../../api/listas");
      const data = await res.json();
      setTipoDecisiones(data.tipo_decision || []); 
    };

    fetchTipoDecisiones();
  }, []);

  const handleFechaChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onChange(e);
  };

  return (
    <div className="mb-1 border p-4 rounded-lg shadow-sm bg-white w-320 scale-[0.75]  origin-left">
      <h5 className="text-lg font-bold mb-4">Intervención y decisión</h5>
      <Separator className="my-4" />

      <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
      <Select id="tipoDecision" required onChange={onChange}>
        <option>Seleccione un tipo</option> 
        {tipoDecisiones.map((decision, index) => (
          <option key={index} value={decision}>{decision}</option>
        ))}
      </Select>

      <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
      <Textarea id="decisionComite" placeholder="Escribe la decisión tomada" required onChange={onChange} />

      <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
      <Textarea id="compromisos" placeholder="Escribe aquí los compromisos adquiridos" required onChange={onChange} />

      <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
      <TextInput id="fechaCompromiso" type="date" min={todayStr} required onChange={handleFechaChange} />
      {fechaError && <p className="text-red-500 text-sm mt-1">{fechaError}</p>}
    </div>
  );
};

export default Intervention;
