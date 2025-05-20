"use client";
import React, { useState, useEffect } from "react";

const RutaAtencionForm = ({setRuta_Atencion, idCaso}) => {
  const [rutaAtencion, setRutaAtencion] = useState(false);
  const [tipoRemision, setTipoRemision] = useState("");
  const [fecha, setFecha] = useState("");
  const [remitido, setRemitido] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [contacto, setContacto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [opciones, setOpciones] = useState({});
  
  useEffect(() => {
    const rutaAtencionData = {
      id_caso: idCaso,
      ruta_activada: rutaAtencion !== null ? rutaAtencion : false,
      tipoRemision,
      fecha,
      remitido,
      institucion,
      contacto,
      observaciones,
    };
    setRuta_Atencion(rutaAtencionData);
  }, [idCaso, rutaAtencion, tipoRemision, fecha, remitido, institucion, contacto, observaciones]); 

  useEffect(() => {
      const fetchOpciones = async () => {
        const res = await fetch("../../../../api/listas");
        const data = await res.json();
        setOpciones(data);
      };
  
      fetchOpciones();
    }, []);

  return (
    <div className="mb-1 p-4 border rounded-lg shadow-md bg-white w-320 scale-[0.75]  origin-left">
      <h2 className="text-lg font-semibold mb-2">Ruta de atención</h2>
      <label className="block font-medium">¿Se activa ruta de atención?</label>
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="rutaAtencion" value="true" checked={rutaAtencion === true} onChange={() => setRutaAtencion(true)} /> Sí
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="rutaAtencion" value="false" checked={rutaAtencion === false}  onChange={() => setRutaAtencion(false)} /> No
        </label>
      </div>
      {rutaAtencion === true && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <label className="block font-medium">Tipo de remisión:</label>
          <select className="border p-2 w-full rounded" value={tipoRemision} onChange={(e) => setTipoRemision(e.target.value)}>
            <option>Seleccione un tipo</option>
            {/* Cargar dinámicamente las opciones */}
            {opciones.tipo_remision && opciones.tipo_remision.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
          <label className="block font-medium">Fecha:</label>
          <input type="date" className="border p-2 w-full rounded" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <label className="block font-medium">Remitido:</label>
          <input type="text" className="border p-2 w-full rounded" value={remitido} onChange={(e) => setRemitido(e.target.value)} />
          <label className="block font-medium">Institución a la que se remite:</label>
          <input type="text" className="border p-2 w-full rounded" value={institucion} onChange={(e) => setInstitucion(e.target.value)} />
          <label className="block font-medium">Contacto:</label>
          <input type="text" className="border p-2 w-full rounded" value={contacto} onChange={(e) => setContacto(e.target.value)} />
          <label className="block font-medium">Observaciones:</label>
          <textarea className="border p-2 w-full rounded" value={observaciones} onChange={(e) => setObservaciones(e.target.value)}></textarea>
        </div>
      )}
    
    </div>
  );
};

export default RutaAtencionForm;
