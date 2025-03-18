import { useState } from "react";

const RutaAtencionForm = () => {
  const [rutaAtencion, setRutaAtencion] = useState<boolean | null>(null);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Ruta de atención</h2>

      <label className="block font-medium">¿Se activa ruta de atención?</label>
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="rutaAtencion"
            value="si"
            checked={rutaAtencion === true}
            onChange={() => setRutaAtencion(true)}
          />
          Sí
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="rutaAtencion"
            value="no"
            checked={rutaAtencion === false}
            onChange={() => setRutaAtencion(false)}
          />
          No
        </label>
      </div>

      {rutaAtencion === true && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <label className="block font-medium">Tipo de remisión:</label>
          <select className="border p-2 w-full rounded">
            <option>Seleccione un tipo</option>
            <option>Urgente</option>
            <option>Regular</option>
          </select>

          <label className="block font-medium">Fecha:</label>
          <input type="date" className="border p-2 w-full rounded" />

          <label className="block font-medium">Remitido:</label>
          <input type="text" className="border p-2 w-full rounded" />

          <label className="block font-medium">
            Institución a la que se remite:
          </label>
          <input type="text" className="border p-2 w-full rounded" />

          <label className="block font-medium">Contacto:</label>
          <input type="text" className="border p-2 w-full rounded" />

          <label className="block font-medium">Observaciones:</label>
          <textarea className="border p-2 w-full rounded"></textarea>
        </div>
      )}
    </div>
  );
};

export default RutaAtencionForm;
