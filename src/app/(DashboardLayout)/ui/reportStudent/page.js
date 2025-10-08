"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToPDF } from "./funciones/exportToPDF";
import EnviarReporteModal from "../../ui/editCase/components/EnviarReporteModal";

export default function ReporteEstudiante() {
  const [casos, setCasos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estado, setEstado] = useState("");
  const [documento, setDocumento] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [estudiante, setEstudiante] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

   const handleEnviarReporte = () => {
    setIsModalOpen(true);
  };
  
  const handleFiltrar = async () => {
    if (!documento) return;

    try {
      const res = await fetch(`/api/reportes/${documento}`);
      if (!res.ok) {
        setEstudiante(null);
        setFiltered([]);
        setFiltroAplicado(true);
        return;
      }

      const data = await res.json();
      const { estudiante, casos } = data;

      const filtrados = casos.filter((caso) => {
        const fecha = new Date(caso.fecha_caso);

        const matchFecha =
          (!startDate || fecha >= startDate) &&
          (!endDate || fecha <= endDate);

        const matchEstado = estado
          ? caso.estado?.trim().toLowerCase() === estado.trim().toLowerCase()
          : true;

        return matchFecha && matchEstado;
      });

      setEstudiante(estudiante);
      setFiltered(filtrados);
      setFiltroAplicado(true);
    } catch (err) {
      console.error("Error al obtener el estudiante:", err);
      setEstudiante(null);
      setFiltered([]);
      setFiltroAplicado(true);
    }
  };

  return (
    <div className="rounded-xl shadow-md bg-white p-6 w-256">
      <h1 className="text-2xl font-semibold mb-4">Reporte por Estudiante</h1>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-xl shadow-md w-full">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Documento</label>
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="border px-3 py-2 rounded-md"
              placeholder="Número de documento"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Desde</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border px-3 py-2 rounded-md"
              placeholderText="Fecha inicial"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Hasta</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border px-3 py-2 rounded-md"
              placeholderText="Fecha final"
            />
          </div>

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
      <div className="mt-6">
        {estudiante && (
          <div className="mb-4 text-sm text-gray-700">
            <p><strong>Estudiante:</strong> {estudiante.nombre_completo}</p>
            <p><strong>Grado:</strong> {estudiante.grado}</p>
            <p><strong>Documento:</strong> {estudiante.documentoid}</p>
            <p><strong>Acudiente:</strong> {estudiante.acudiente.nombre_completo} - {estudiante.acudiente.telefono}</p>
          </div>
        )}

        {filtroAplicado && filtered.length > 0 ? (
          <>
            <table className="w-full text-left border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Rol</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((caso, index) => (
                  <tr key={`${caso.id_caso}-${index}`}>
                    <td className="p-2">{new Date(caso.fecha_caso).toLocaleDateString()}</td>
                    <td className="p-2">{caso.tipo_caso}</td>
                    <td className="p-2 capitalize">{caso.rol}</td>
                    <td className="p-2 max-w-[14rem] whitespace-pre-wrap">
                      {caso.descripcion || "Sin descripción"}
                    </td>
                    <td className="p-2 capitalize">{caso.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => exportToPDF(estudiante, filtered)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full"
            >
              Exportar PDF
            </button>

            <button
              onClick={handleEnviarReporte}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
            >
              Enviar Reporte
            </button>
          </div>
          </>
        ) : filtroAplicado ? (
          <p className="text-gray-500 mt-4">No se encontraron resultados.</p>
        ) : null}

        {/* Modal de Envío */}
        {estudiante && (
          <EnviarReporteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            estudiante={estudiante}
            casos={filtered}
          />
        )}
      </div>
    </div>
  );
}
