"use client";
import React, { useEffect, useState } from "react";
import { fetchCases } from "../../api/fetchCase/fetchCase"; 

const getColor = (estado, fechaCompromiso) => {
  const hoy = new Date();
  const fecha = new Date(fechaCompromiso);

  if (estado === "cerrado") return "bg-green-500";
  if ((estado === "abierto" || estado === "en seguimiento") && fecha < hoy)
    return "bg-red-600";
  return "bg-gray-300";
};

const DailyActivity = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const allCases = await fetchCases();

     
      const cerrados = allCases
        .filter(c => c.estado === "cerrado" && c.intervencion?.fecha_compromiso)
        .sort((a, b) =>
          new Date(b.intervencion.fecha_compromiso) - new Date(a.intervencion.fecha_compromiso)
        )
        .slice(0, 5);


      const hoy = new Date();
      const vencidos = allCases.filter(c => {
        const fecha = new Date(c.intervencion?.fecha_compromiso);
        return (
          (c.estado === "abierto" || c.estado === "en seguimiento") &&
          c.intervencion?.fecha_compromiso &&
          fecha < hoy
        );
      });

      const actividades = [...vencidos, ...cerrados]
        .sort((a, b) =>
          new Date(b.intervencion.fecha_compromiso) - new Date(a.intervencion.fecha_compromiso)
        )
        .map(caso => ({
          Time: new Date(caso.intervencion.fecha_compromiso).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          action: `Compromiso del caso ${caso.id_caso} - ${caso.estado}`,
          color: getColor(caso.estado, caso.intervencion.fecha_compromiso),
        }));

      setActivityData(actividades);
    };

    getData();
  }, []);

  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full">
      <h5 className="text-lg font-semibold mb-4">Compromisos recientes y vencidos</h5>
      <div className="flex flex-col mt-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <ul>
          {activityData.map((item, index) => (
            <li key={index}>
              <div className="flex gap-4 min-h-16">
                <div>
                  <p>{item.Time}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`rounded-full ${item.color} p-1.5 w-fit`}></div>
                  {index < activityData.length - 1 && (
                    <div className="h-full w-px bg-gray-300"></div>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 text-start">{item.action}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyActivity;