"use client";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import BasicInformation from "./Components/basicInformation";
import Actores from "./Components/actores";
import Descricription from "./Components/description";
import Evidencias from "./Components/evidencias";
import RutaAtencionForm from "./Components/rutaAtencion";
import Intervention from "./Components/intervention";
import { enviarDatos } from "./Storage/enviarDatos";

const CaseForm = () => {
  const [formData, setFormData] = useState({
    Id_Caso: "",
    fecha_caso: "",
    tipo_caso: "",
    es_confidencial: "false",
  });
  const [actores, setActores] = useState([]);
  const [descripcion, setDescripcion] = useState({
    id_caso: "", // ✅ Ahora siempre tiene un campo `id_caso`
    version_estudiante_afectado: "",
    version_estudiante_implicado: "",
    version_testigos: "",
  });
  const [evidencias, setEvidencias] = useState([]);
  const [intervencion, setIntervencion] = useState({
    id_caso: "",  
    tipoDecision: "",
    decisionComite: "",
    compromisos: "",
    fechaCompromiso: ""
  });
  const [rutaAtencion, setRuta_Atencion] = useState([]);
  useEffect(() => {
    setDescripcion((prev) => ({ ...prev, id_caso: formData.Id_Caso }));
    setIntervencion((prev) => ({ ...prev, id_caso: formData.Id_Caso }));
  }, [formData.Id_Caso]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? (value === "true").toString() : value,
    }));
  };

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDescripcion((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleIntervencionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setIntervencion((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Datos del formulario antes de enviar:", formData);
    console.log("Actores:", actores);
    console.log("Descripción con ID:", descripcion); 
    console.log("Evidencias:", evidencias); 
    console.log("Intervención:", intervencion);
    console.log("Ruta de Atención:", rutaAtencion);

    const idCasoGenerado = await enviarDatos(formData, actores, descripcion, evidencias, intervencion, rutaAtencion);

    if (idCasoGenerado) {
      setFormData((prev) => ({ ...prev, Id_Caso: idCasoGenerado }));
    }
  };

  return (
    <div className="rounded-xl shadow-md bg-white p-6 w-full">
      <BasicInformation onChange={handleChange} />
      <Actores setActores={setActores} idCaso={formData.Id_Caso} />
      <Descricription onChange={handleDescripcionChange} />
      <Evidencias setEvidencias={setEvidencias} idCaso={formData.Id_Caso} />
      <Intervention onChange={handleIntervencionChange} />
      <RutaAtencionForm setRuta_Atencion={setRuta_Atencion} idCaso={formData.Id_Caso} />

      <div className="mt-6 flex gap-3">
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>
        <Button color="error">Cancelar</Button>
      </div>
    </div>
  );
};

export default CaseForm;
