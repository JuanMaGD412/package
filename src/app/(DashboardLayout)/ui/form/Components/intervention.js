"use client";
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const Intervention = ({ onChange }) => {
  const [tipoDecisiones, setTipoDecisiones] = useState([]);
  const todayStr = new Date().toISOString().split("T")[0];
  
  useEffect(() => {
    const fetchTipoDecisiones = async () => {
      const res = await fetch("../../../../api/listas");
      const data = await res.json();
      setTipoDecisiones(data.tipo_decision || []);
    };
    fetchTipoDecisiones();
  }, []);

  return (
    <div className="...">
      <h5 className="...">Intervención y decisión</h5>
      <Separator className="my-4" />

      <Label htmlFor="tipoDecision" value="Tipo de decisión tomada" />
      <Select id="tipoDecision" name="tipoDecision" required onChange={onChange}>
        <option>Seleccione un tipo</option>
        {tipoDecisiones.map((decision, index) => (
          <option key={index} value={decision}>{decision}</option>
        ))}
      </Select>

      <Label htmlFor="decisionComite" value="Decisión del comité de convivencia" className="mt-4" />
      <Textarea id="decisionComite" name="decisionComite" placeholder="Escribe la decisión tomada" required onChange={onChange} />

      <Label htmlFor="compromisos" value="Compromisos adquiridos" className="mt-4" />
      <Textarea id="compromisos" name="compromisos" placeholder="Escribe aquí los compromisos adquiridos" required onChange={onChange} />

      <Label htmlFor="fechaCompromiso" value="Fecha límite del compromiso" className="mt-4" />
      <TextInput id="fechaCompromiso" name="fechaCompromiso" type="date" min={todayStr} required onChange={onChange} />
    </div>
  );
};

export default Intervention;
