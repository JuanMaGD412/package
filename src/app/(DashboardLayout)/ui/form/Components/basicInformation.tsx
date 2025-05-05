"use client";
import { Label, Select, TextInput } from "flowbite-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const BasicInformation = ({ onChange, idCaso }: { onChange: (e: any) => void, idCaso: string }) => {
  const [fechaError, setFechaError] = useState("");
  const [opciones, setOpciones] = useState<any>({});

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchOpciones = async () => {
      const res = await fetch("../../../../api/listas");
      const data = await res.json();
      setOpciones(data);
    };

    fetchOpciones();
  }, []);

  const handleFechaChange = (e: any) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setFechaError("La fecha del caso no puede ser posterior al día de hoy.");
      alert("Por favor selecciona una fecha de hoy o anterior.");
    } else {
      setFechaError("");
    }

    onChange(e);
  };

  return (
    <div className="mb-1 border p-4 rounded-lg shadow-sm bg-white w-320 scale-[0.75]  origin-left">
      <h5 className="text-lg font-bold mb-4">Datos generales del Caso</h5>
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Id_Caso" value="ID del Caso" />
          <TextInput id="Id_Caso" name="Id_Caso" value={idCaso} readOnly />
        </div>
        <div>
          <Label htmlFor="fecha_caso" value="Fecha del caso" />
          <TextInput
            id="fecha_caso"
            name="fecha_caso"
            type="date"
            max={todayStr}
            onChange={handleFechaChange}
            required
          />
          {fechaError && <p className="text-red-500 text-sm mt-1">{fechaError}</p>}
        </div>
        <div>
          <Label htmlFor="tipo_caso" value="Tipo de caso" />
          <Select id="tipo_caso" name="tipo_caso" onChange={onChange} required>
            <option value="">Seleccione un tipo</option>
            {/* Cargar dinámicamente las opciones */}
            {opciones.tipo_caso && opciones.tipo_caso.map((tipo: string, index: number) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label value="¿El caso es confidencial?" />
          <div className="flex gap-2">
            <label>
              <input type="radio" name="es_confidencial" value="true" onChange={onChange} /> Sí
            </label>
            <label>
              <input type="radio" name="es_confidencial" value="false" defaultChecked onChange={onChange} /> No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
