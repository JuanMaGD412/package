"use client";
import React, { useEffect, useState } from "react";
import { Table, Select, Label, Card, Spinner, Button } from "flowbite-react";
import { fetchCases } from "../../../app/api/fetchCase/fetchCase";
import { getStudentInfo } from "../../api/comunidad/filtroDocumento/getStudentInfo";

const CaseRanking = () => {
  const [cases, setCases] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedRole, setSelectedRole] = useState("vinculado");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadCases = async () => {
      setLoading(true);
      const data = await fetchCases();
      setCases(data);
      setLoading(false);
    };

    loadCases();
  }, []);

  useEffect(() => {
    const fetchRanking = async () => {
      if (!cases || cases.length === 0) return;

      const roleMap = {};
      const documentMap = {};

      cases.forEach((caso) => {
        caso.actores.forEach((actor) => {
          if (actor.rol === selectedRole) {
            const key = actor.documento_id;
            if (!roleMap[key]) {
              roleMap[key] = {
                nombre: actor.nombre_completo,
                casos: 0,
              };
              documentMap[key] = true;
            }
            roleMap[key].casos += 1;
          }
        });
      });

      const documentos = Object.keys(documentMap);
      const studentInfos = await Promise.all(
        documentos.map((doc) => getStudentInfo(doc))
      );

      documentos.forEach((doc, idx) => {
        const info = studentInfos[idx];
        if (info && roleMap[doc]) {
          roleMap[doc].grado = info.grado || "";
          roleMap[doc].foto = info.foto || null;
        } else {
          roleMap[doc].grado = "";
          roleMap[doc].foto = null;
        }
      });

      const totalCasos = Object.values(roleMap).reduce((acc, actor) => acc + actor.casos, 0);

      const sortedRanking = Object.values(roleMap)
        .map((actor) => ({
          ...actor,
          porcentaje: ((actor.casos / totalCasos) * 100).toFixed(1),
        }))
        .sort((a, b) => b.casos - a.casos);

      setRanking(sortedRanking);
      setCurrentPage(1);
    };

    fetchRanking();
  }, [cases, selectedRole]);

  const totalPages = Math.ceil(ranking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = ranking.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card className="p-6 mt-4 shadow-md bg-white">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Ranking por número de casos</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="rolFilter" value="Filtrar por rol:" />
          <Select
            id="rolFilter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-40"
          >
            <option value="vinculado">Vinculados</option>
            <option value="implicado">Implicados</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table hoverable className="text-sm text-left text-gray-700">
              <Table.Head>
                <Table.HeadCell>Foto</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Grado</Table.HeadCell>
                <Table.HeadCell>Casos</Table.HeadCell>
                <Table.HeadCell>Participación (%)</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {currentItems.length > 0 ? (
                  currentItems.map((persona, index) => (
                    <Table.Row key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <Table.Cell className="py-2">
                        {persona.foto ? (
                          <img
                            src={persona.foto}
                            alt="Foto"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                            Sin foto
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell>{persona.nombre}</Table.Cell>
                      <Table.Cell>{persona.grado}</Table.Cell>
                      <Table.Cell>{persona.casos}</Table.Cell>
                      <Table.Cell>{persona.porcentaje} %</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4 text-gray-500">
                      No hay datos disponibles para este rol.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>

          {/* Controles de paginación mejorados */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" disabled={currentPage === 1} onClick={handlePrevious}>
                Anterior
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  color={page === currentPage ? "primary" : "gray"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CaseRanking;
