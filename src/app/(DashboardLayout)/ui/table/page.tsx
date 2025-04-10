"use client";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Table, Pagination, TextInput, Button } from "flowbite-react";
import { HiOutlineDotsVertical, HiSearch } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { fetchCases } from "./funciones/fetchCase";
import CaseDetailsModal from "./components/caseDetailsModal";
import SeguimientoModal from "./components/seguimientoModal";

const CasesTable = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeguimientoOpen, setIsSeguimientoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;

  useEffect(() => {
    fetchData();
    const getData = async () => {
      const data = await fetchCases();
      setCases(data);
    };
    getData();
  }, []);

  const fetchData = async () => {
    const data = await fetchCases();
    setCases(data);
  };

  const openModal = (caso) => {
    setSelectedCase(caso);
    setIsModalOpen(true);
  };

  const openSeguimientoModal = (caso) => {
    setSelectedCase(caso);
    setIsSeguimientoOpen(true);
  };
  
  const tableActionData = [
  { icon: "solar:eye-bold", listtitle: "Ver Detalles", action: openModal },
  { icon: "solar:pen-new-square-broken", listtitle: "Iniciar seguimiento", action: openSeguimientoModal },
  ];

  const filteredCases = cases.filter((item) =>
    item.tipo_caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.actores.some(a => a.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

  return (
    <div className="rounded-xl shadow-md bg-white p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold">Gestión de Casos de Convivencia</h5>
        <div className="relative">
          <TextInput 
            placeholder="Buscar..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg"
          />
          <HiSearch className="absolute left-3 top-3 text-gray-500" size={20} />
        </div>
      </div>
      
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>ID Caso</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Tipo</Table.HeadCell>
          <Table.HeadCell>Actores</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentCases.length > 0 ? (
            currentCases.map((item) => (
              <Table.Row key={item.Id_Caso}>
                <Table.Cell>{item.Id_Caso}</Table.Cell>
                <Table.Cell>{new Date(item.fecha_caso).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{item.tipo_caso}</Table.Cell>
                <Table.Cell>{item.actores.map(a => a.nombre).join(", ")}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.estado === "cerrado" ? "failure" : item.estado === "en seguimiento" ? "warning" : "green"}>
                    {item.estado}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    label=""
                    dismissOnClick={false}
                    renderTrigger={() => (
                      <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer">
                        <HiOutlineDotsVertical size={22} />
                      </span>
                    )}
                  >
                    {tableActionData.map((actionItem, index) => (
                      <Dropdown.Item key={index} className="flex gap-3" onClick={() => actionItem.action(item)}>
                        <Icon icon={actionItem.icon} height={18} />
                        <span>{actionItem.listtitle}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center">
                No hay casos registrados
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCases.length / casesPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
      <SeguimientoModal isOpen={isSeguimientoOpen} onClose={() => { setIsSeguimientoOpen(false); fetchData();}} caseData={selectedCase} />
      <CaseDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} caseData={selectedCase} />
    </div>
  );
};

export default CasesTable;
