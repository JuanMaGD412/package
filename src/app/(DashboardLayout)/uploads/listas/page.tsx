"use client";

import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

type RawRow = Record<string, string | undefined>;

type ListaRow = {
  tipo: string;
  valor: string;
};

export default function ListasUploadPage() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ListaRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  const expectedFields = ["tipo", "valor"];

  /** Normaliza encabezados */
  function normalizeKey(k?: string) {
    return (k || "").trim().toLowerCase();
  }

  /** Parse CSV */
  const handleFile = (file: File | null) => {
    setParseErrors([]);
    setServerErrors([]);
    setUploadResult(null);
    setRows([]);
    if (!file) return;
    setFileName(file.name);

    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8", // 👈 Fuerza lectura UTF-8 (soluciona los signos raros)
      transformHeader: (h) => (h ? h.trim() : h),
      complete: (results: ParseResult<RawRow>) => {
        const data = results.data;
        const localErrors: string[] = [];
        const cleaned: ListaRow[] = [];

        data.forEach((r, idx) => {
          const row: Record<string, string | undefined> = {};
          for (const k in r) {
            const nk = normalizeKey(k);
            row[nk] = typeof r[k] === "string" ? (r[k] as string).trim() : r[k];
          }

          const missing: string[] = [];
          for (const f of expectedFields) {
            if (!row[f] || String(row[f]).trim() === "") missing.push(f);
          }

          if (missing.length > 0) {
            localErrors.push(
              `Fila ${idx + 2}: faltan campos: ${missing.join(", ")}`
            );
            return;
          }

          cleaned.push({
            tipo: row["tipo"] as string,
            valor: row["valor"] as string,
          });
        });

        setParseErrors(localErrors);
        setRows(cleaned);
      },
      error: (err: any) => {
        setParseErrors([`Error parseando CSV: ${err?.message || String(err)}`]);
        setRows([]);
      },
    });
  };

  /** Cambio de archivo */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  };

  /** Subida a la API */
  const handleUpload = async () => {
    setServerErrors([]);
    setUploadResult(null);

    if (rows.length === 0) {
      setServerErrors(["No hay filas válidas para subir."]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/listas/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerErrors([data?.error || "Error en la API"]);
      } else {
        setUploadResult(data);
      }
    } catch (err: any) {
      console.error(err);
      setServerErrors([err?.message || "Error al conectar con servidor"]);
    } finally {
      setLoading(false);
    }
  };

  /** Reset */
  const resetAll = () => {
    setRows([]);
    setFileName(null);
    setParseErrors([]);
    setUploadResult(null);
    setServerErrors([]);
    const input = document.getElementById("csv-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Carga masiva de Listas (CSV)
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Sube un archivo CSV con los campos:{" "}
          <span className="font-medium">tipo, valor</span>.
        </p>

        {/* Selector de archivo */}
        <div className="mb-6">
          <label
            htmlFor="csv-file"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-slate-800 text-white cursor-pointer hover:opacity-90 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0l3 3M12 3l-3 3"
              />
            </svg>
            Seleccionar archivo
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
            className="hidden"
          />

          {fileName ? (
            <span className="ml-4 inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded">
              <strong className="text-sm">{fileName}</strong>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-500 hover:text-red-600"
                aria-label="Eliminar archivo"
              >
                ✕
              </button>
            </span>
          ) : (
            <span className="ml-4 text-sm text-gray-400">
              No hay archivo seleccionado
            </span>
          )}
        </div>

        {/* Tabla de previsualización */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="overflow-auto border rounded-lg max-h-72">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                      Tipo
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 200).map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{r.tipo}</td>
                      <td className="px-3 py-2">{r.valor}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        className="p-6 text-center text-sm text-gray-500"
                        colSpan={3}
                      >
                        No hay filas previsualizadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="md:col-span-1 space-y-4">
            {parseErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded">
                <strong className="text-sm text-red-700">Errores en parseo</strong>
                <ul className="list-disc ml-5 mt-2 text-xs text-red-700 max-h-36 overflow-auto">
                  {parseErrors.slice(0, 10).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-xs text-gray-600 mb-2">Acciones</div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={loading || rows.length === 0}
                  className="w-full"
                >
                  {loading ? "Cargando..." : "Subir a Supabase"}
                </Button>

                <Button color="gray" onClick={resetAll} className="w-full">
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 text-emerald-700 text-sm">
              <strong>Consejo:</strong>
              <div className="text-xs">
                Asegúrate de que los tipos sean consistentes, por ejemplo:{" "}
                <code>tipo_caso</code>, <code>tipo_decision</code>,{" "}
                <code>tipo_remision</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Errores del servidor / Resultado */}
        <div className="mt-6 space-y-3">
          {serverErrors.length > 0 && (
            <div className="p-3 bg-red-50 text-red-800 rounded border border-red-100">
              <strong>Errores del servidor:</strong>
              <ul className="mt-2 text-sm">
                {serverErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {uploadResult && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
              <strong>Resultado de la importación</strong>
              <pre className="text-xs overflow-auto mt-2 max-h-48">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
