import { useState, useEffect } from "react";

const useComunidad = (grado) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!grado) return;

    const fetchData = async () => {
        try {
          console.log("Grado enviado a la API:", grado);
          const response = await fetch(`/api/comunidad?grado=${grado}`);
          if (!response.ok) throw new Error("Error al obtener los datos");
          const result = await response.json();
          console.log("Datos recibidos:", result);
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, [grado]);

  return { data, loading, error };
};

export default useComunidad;
