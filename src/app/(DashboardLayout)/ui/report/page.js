"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToPDF } from "@/utils/export/exportToPDF";


export default function Reportes() {
  const [casos, setCasos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estado, setEstado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [filtroAplicado, setFiltroAplicado] = useState(false);


  useEffect(() => {
    fetchGrupos();
    fetchData();
  }, []);

  const fetchGrupos = async () => {
    const res = await fetch("../../../api/comunidad/gradoAyuda");
    const data = await res.json();
  
    // Ordena los grupos alfabéticamente o con lógica personalizada
    const gruposOrdenados = data.sort((a, b) => {
      // Orden por grado escolar, por ejemplo: 6A, 6B, 7A, 7B, ..., 11B
      const regex = /^(\d+)([A-Z])$/;
      const parse = (str) => {
        const match = str.match(regex);
        return match ? [parseInt(match[1]), match[2].charCodeAt(0)] : [0, 0];
      };
      const [numA, letraA] = parse(a);
      const [numB, letraB] = parse(b);
      return numA - numB || letraA - letraB;
    });
  
    setGruposDisponibles(gruposOrdenados);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("../../../api/reportes");
      const data = await res.json();
      setCasos(data);
    } catch (error) {
      console.error("Error al obtener los casos:", error);
    }
  };
  

  const handleFiltrar = () => {
    const resultado = casos.filter((caso) => {
      const fechaCaso = new Date(caso.fecha_caso);
  
      const matchFecha =
        (!startDate || fechaCaso >= startDate) &&
        (!endDate || fechaCaso <= endDate);
  
        const matchEstado = estado ? caso.estado?.trim().toLowerCase() === estado.trim().toLowerCase() : true;
  
      const matchGrupo = grupo
        ? caso.actores?.some((actor) => actor.grado === grupo)
        : true;
  
      return matchFecha && matchEstado && matchGrupo;
    });
  
    setFiltered(resultado);
    setFiltroAplicado(true);
  };

  return (
    <div className="rounded-xl shadow-md bg-white p-6  w-256">
      <div className="w-320 scale-[0.85] origin-top-left">
          <div className="p-3">
          <h1 className="text-2xl font-semibold mb-4">Generar Reportes</h1>

          {/* Filtros */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-md w-[69rem]">
            <div className="flex justify-between items-end flex-wrap gap-4">
              {/* Bloque de filtros */}
              <div className="flex flex-wrap gap-4">
                {/* Fechas */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Desde</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="border px-3 py-2 rounded-md"
                    placeholderText="Selecciona una fecha"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Hasta</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="border px-3 py-2 rounded-md"
                    placeholderText="Selecciona una fecha"
                  />
                </div>

                {/* Grupo */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Grupo</label>
                  <select
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                  >
                    <option value="">Todos</option>
                    {gruposDisponibles.map((g, i) => (
                      <option key={i} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="abierto">Abierto</option>
                    <option value="en seguimiento">En seguimiento</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              {/* Botón */}
              <div className="self-end">
                <button
                  onClick={handleFiltrar}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2"
                >
                  <Search size={18} />
                  Buscar
                </button>
              </div>
            </div>
          </div>


          {/* Resultados */}
          <div className="mt-6 w-[69rem]">
            {filtroAplicado && filtered.length > 0 && (
              <>
              <table className="w-full text-left border mt-2 w-[69rem]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Caso</th>
                    <th className="p-2">Fecha</th>
                    <th className="p-2">Confidencial</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Actores</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((caso) => (
                    <tr key={caso.id}>
                      <td className="p-2">{caso.id_caso}</td>
                      <td className="p-2">{new Date(caso.fecha_caso).toLocaleDateString()}</td>
                      <td className="p-2">{caso.es_confidencial ? "Sí" : "No"}</td>
                      <td className="p-2">{caso.tipo_caso}</td>
                      <td className="p-2">
                      {caso.actores?.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {caso.actores.map((a, i) => (
                            <li key={i} className="ml-2">
                              <span className="capitalize">{a.rol}:</span> {a.nombre_completo}
                              {a.grado ? ` (${a.grado})` : ""}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "Sin actores"
                      )}
                      </td>
                      <td className="p-2 max-w-[12rem] break-words whitespace-pre-wrap">
                        {caso.descripcion?.version_estudiante_vinculado || "Sin descripción"}
                      </td>

                      <td className="p-2 capitalize">{caso.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => exportToPDF(filtered)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full"
              >
                Exportar PDF
              </button>

              </>
            )}

            {filtroAplicado && filtered.length === 0 && (
              <p className="text-gray-500 mt-4">No se encontraron resultados.</p>
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
}
