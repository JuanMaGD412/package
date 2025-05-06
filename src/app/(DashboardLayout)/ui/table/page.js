"use client";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Modal, Table, TextInput, Pagination } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { fetchCases } from "../../../api/fetchCase/fetchCase";
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

  const fetchData = async () => {
    const data = await fetchCases();
    setCases(data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

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

  const filteredCases = cases.filter((caso) => {
    const search = searchTerm.toLowerCase();
    const actorMatch = caso.actores?.some((actor) =>
      actor.nombre_completo?.toLowerCase().includes(search)
    );
    const idMatch = caso.Id_Caso?.toString().includes(search);
    const fechaMatch = new Date(caso.fecha_caso).toLocaleDateString().toLowerCase().includes(search);
    return actorMatch || idMatch || fechaMatch;
  });

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const paginatedCases = filteredCases.slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage);

  return (
    <div className="rounded-xl shadow-md bg-white pt-6 px-6 pb-6 relative w-full break-words w-[62rem]">
      <div className="w-320 scale-[0.75] origin-top-left">
        <h5 className="text-lg font-semibold mt-0">Gestión de Casos de Convivencia</h5>

        <div className="mb-4 flex justify-end">
          <TextInput
            placeholder="Buscar por ID, actor o fecha"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-80"
          />
        </div>

        <div className="mt-3 overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>ID Caso</Table.HeadCell>
              <Table.HeadCell>Fecha</Table.HeadCell>
              <Table.HeadCell>Tipo</Table.HeadCell>
              <Table.HeadCell>Actores Involucrados</Table.HeadCell>
              <Table.HeadCell>Descripción</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {paginatedCases.length > 0 ? (
                paginatedCases.map((item) => (
                  <Table.Row key={item.id_caso}>
                    <Table.Cell>{item.id_caso}</Table.Cell>
                    <Table.Cell>{new Date(item.fecha_caso).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{item.tipo_caso}</Table.Cell>
                    <Table.Cell>
                      {item.actores?.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {item.actores.map((a, i) => (
                            <li key={i} className="ml-2">{a.nombre_completo}</li>
                          ))}
                        </ul>
                      ) : (
                        "Sin actores"
                      )}
                    </Table.Cell>
                    <Table.Cell>{item.descripcion?.version_estudiante_afectado || "Sin descripción"}</Table.Cell>
                    <Table.Cell>
                      <Badge color={item.estado === "cerrado" ? "failure" : item.estado === "en seguimiento" ? "warning" : "green"}>
                      {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
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
                  <Table.Cell colSpan={7} className="text-center">
                    No se encontraron resultados
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        </div>
      </div>

      {/* Modal de detalles del caso */}
      <SeguimientoModal isOpen={isSeguimientoOpen} onClose={() => { setIsSeguimientoOpen(false); fetchData();}} caseData={selectedCase} />
      <CaseDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} caseData={selectedCase} />
    </div>
  );
};

export default CasesTable;
