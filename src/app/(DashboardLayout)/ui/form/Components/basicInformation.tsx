"use client";
import { Label, Select, TextInput } from "flowbite-react";
import { Separator } from "@/components/ui/separator";

const BasicInformation = ({ onChange }: { onChange: (e: any) => void }) => {
  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h5 className="text-lg font-bold mb-4">Datos generales del Caso</h5>
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Id_Caso" value="ID del Caso" />
          <TextInput id="Id_Caso" name="Id_Caso" onChange={onChange} required />
        </div>
        <div>
          <Label htmlFor="fecha_caso" value="Fecha del caso" />
          <TextInput id="fecha_caso" name="fecha_caso" type="date" onChange={onChange} required />
        </div>
        <div>
          <Label htmlFor="tipo_caso" value="Tipo de caso" />
          <Select id="tipo_caso" name="tipo_caso" onChange={onChange} required>
            <option value="">Seleccione un tipo</option>
            <option value="salud">Situación de salud</option>
            <option value="disciplinario">Disciplinario</option>
          </Select>
        </div>
        <div>
          <Label value="¿El caso es confidencial?" />
          <div className="flex gap-2">
            <label>
              <input type="radio" name="es_confidencial" value="true" onChange={onChange} /> Sí
            </label>
            <label>
              <input type="radio" name="es_confidencial" value="false" onChange={onChange} /> No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
