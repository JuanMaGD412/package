"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Select } from "flowbite-react";
import { ApexOptions } from "apexcharts";
import { fetchCases } from "../../api/fetchCase/fetchCase"; // Ajusta la ruta si es diferente

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CasesStatusChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Semana");
  const [casesData, setCasesData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCases();
      setCasesData(data);
    };
    loadData();
  }, []);

  const filterCasesByPeriod = (period: string) => {
    const now = new Date();
    return casesData.filter((caso) => {
      const fecha = new Date(caso.fecha_caso);
      if (period === "Semana") {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return fecha >= start && fecha <= now;
      }
      if (period === "Mes") {
        return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
      }
      if (period === "Año") {
        return fecha.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const getChartData = (period: string) => {
    const filtered = filterCasesByPeriod(period);

    const abiertos = filtered.filter(c => c.estado === "abierto").length;
    const cerrados = filtered.filter(c => c.estado === "cerrado").length;
    const seguimiento = filtered.filter(c => c.estado === "en seguimiento").length;

    return {
      series: [{
        name: "Casos",
        data: [abiertos, seguimiento, cerrados],
      }],
    };
  };

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["Abiertos", "En seguimiento", "Cerrados"],
    },
    colors: ["#3B82F6"], // azul
    tooltip: {
      theme: "dark",
    },
  };

  const chartData = getChartData(selectedPeriod);

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">Estado de los Casos</h5>
        <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="Semana">Esta Semana</option>
          <option value="Mes">Este Mes</option>
          <option value="Año">Este Año</option>
        </Select>
      </div>
      <Chart options={options} series={chartData.series} type="bar" height="300px" />
    </div>
  );
};

export default CasesStatusChart;
