"use client";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Modal, Table } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { fetchCases } from "./funciones/fetchCase";
import CaseDetailsModal from "./components/caseDetailsModal";

const CasesTable = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchCases();
      setCases(data);
    };

    getData();
  }, []);

  const openModal = (caso) => {
    setSelectedCase(caso);
    setIsModalOpen(true);
  };

  const tableActionData = [
    { icon: "solar:eye-bold", listtitle: "Ver Detalles", action: openModal },
    { icon: "solar:pen-new-square-broken", listtitle: "Editar Caso", action: () => alert("Funcionalidad en desarrollo") },
  ];

  return (
    <div className="rounded-xl shadow-md bg-white p-6 relative w-full break-words">
      <h5 className="text-lg font-semibold">Casos de Convivencia</h5>
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
            {cases.length > 0 ? (
              cases.map((item) => (
                <Table.Row key={item.Id_Caso}>
                  <Table.Cell>{item.Id_Caso}</Table.Cell>
                  <Table.Cell>{new Date(item.fecha_caso).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{item.tipo_caso}</Table.Cell>
                  <Table.Cell>{item.actores.length > 0 ? item.actores.map(a => a.nombre).join(", ") : "Sin actores"}</Table.Cell>
                  <Table.Cell>{item.descripcion?.version_estudiante_afectado || "Sin descripción"}</Table.Cell>
                  <Table.Cell>
                    <Badge color={item.estado === "Cerrado" ? "success" : "warning"}>
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
                        <Dropdown.Item key={index} className="flex gap-3" onClick={() => actionItem.action(item)} >
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
                  No hay casos registrados
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Modal de detalles del caso */}
      <CaseDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} caseData={selectedCase} />
    </div>
  );
};

export default CasesTable;