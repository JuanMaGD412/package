"use client";

import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

type ComunidadRow = {
  ruta_foto?: string | null;
  rol: string;
  tipodocumento: string;
  documentoid: string;
  apellido1: string;
  apellido2: string;
  nombre: string;
  genero: string;
  rolcomunidad: string;
  nombreacudiente: string;
  apellido1acudiente: string;
  apellido2acudiente: string;
  emailacudiente: string;
  telefonoacudiente: string;
  grado?: string | null;
};

export default function ComunidadUploadPage() {
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ComunidadRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const router = useRouter();

  const requiredFields = [
    "rol",
    "tipodocumento",
    "documentoid",
    "apellido1",
    "apellido2",
    "nombre",
    "genero",
    "rolcomunidad",
    "nombreacudiente",
    "apellido1acudiente",
    "apellido2acudiente",
    "emailacudiente",
    "telefonoacudiente",
  ];

  function normalizeKey(k?: string) {
    return (k || "").trim().toLowerCase();
  }

  const handleFile = (file: File | null) => {
    setErrors([]);
    setUploadResult(null);
    if (!file) return;
    setCsvFileName(file.name);

    Papa.parse<Partial<Record<string, string>>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => (h ? h.trim() : h),
      complete: (results: ParseResult<Partial<Record<string, string>>>) => {
        const data = results.data as Partial<Record<string, string>>[];
        const parseErrors: string[] = [];
        const cleanedRows: ComunidadRow[] = [];

        data.forEach((r, i) => {
          // Normalizar claves y valores (lowercase keys)
          const row: Record<string, string | undefined> = {};
          for (const k in r) {
            const key = normalizeKey(k);
            row[key] = typeof r[k] === "string" ? (r[k] as string).trim() : (r[k] as any);
          }

          // Validación básica por fila
          const missing: string[] = [];
          for (const f of requiredFields) {
            if (!row[f] || String(row[f]).trim() === "") missing.push(f);
          }

          if (missing.length > 0) {
            parseErrors.push(`Fila ${i + 2}: faltan campos: ${missing.join(", ")}`);
            return;
          }

          // Mapeo seguro
          cleanedRows.push({
            ruta_foto: (row["ruta_foto"] as string) || null,
            rol: row["rol"] as string,
            tipodocumento: row["tipodocumento"] as string,
            documentoid: row["documentoid"] as string,
            apellido1: row["apellido1"] as string,
            apellido2: row["apellido2"] as string,
            nombre: row["nombre"] as string,
            genero: row["genero"] as string,
            rolcomunidad: row["rolcomunidad"] as string,
            nombreacudiente: row["nombreacudiente"] as string,
            apellido1acudiente: row["apellido1acudiente"] as string,
            apellido2acudiente: row["apellido2acudiente"] as string,
            emailacudiente: row["emailacudiente"] as string,
            telefonoacudiente: row["telefonoacudiente"] as string,
            grado: (row["grado"] as string) || null,
          });
        });

        setErrors(parseErrors);
        setRows(cleanedRows);
      },
      error: (err: any) => {
        setErrors([`Error al parsear CSV: ${err?.message || String(err)}`]);
        setRows([]);
      },
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleUpload = async () => {
    if (rows.length === 0) {
      setErrors(["No hay filas válidas para subir"]);
      return;
    }
    setLoading(true);
    setUploadResult(null);
    setErrors([]);

    try {
      const res = await fetch("/api/comunidad/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors([data?.error || "Error en el servidor al subir"]);
      } else {
        setUploadResult(
          `Inserción completa. Insertados: ${data.inserted || 0}. Errores: ${data.errors?.length || 0}`
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrors([err.message || "Error desconocido al conectar con servidor"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Carga masiva - Comunidad (CSV)</h1>
        <p className="text-sm text-gray-500 mb-6">
          Suba un CSV con los campos requeridos. Previsualización muestra las primeras filas válidas.
        </p>

        {/* file selector */}
        <div className="mb-6 flex items-center gap-4">
          <label
            htmlFor="com-file"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-slate-800 text-white cursor-pointer hover:opacity-90 shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0l3 3M12 3l-3 3" />
            </svg>
            Seleccionar archivo
          </label>
          <input id="com-file" type="file" accept=".csv,text/csv" onChange={handleFileInputChange} className="hidden" />

          {csvFileName ? (
            <span className="ml-2 inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded">
              <strong className="text-sm">{csvFileName}</strong>
              <button
                type="button"
                onClick={() => {
                  setCsvFileName(null);
                  setRows([]);
                  setErrors([]);
                  setUploadResult(null);
                  (document.getElementById("com-file") as HTMLInputElement | null)?.value && ((document.getElementById("com-file") as HTMLInputElement).value = "");
                }}
                className="text-xs text-slate-500 hover:text-red-600"
                aria-label="Eliminar archivo"
              >
                ✕
              </button>
            </span>
          ) : (
            <span className="text-sm text-gray-400">No hay archivo seleccionado</span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="overflow-auto border rounded-lg max-h-72">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">documentoid</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">nombre</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">apellido1</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">apellido2</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">rol</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">email acudiente</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">tel. acudiente</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-sm text-gray-500" colSpan={8}>
                        No hay filas previsualizadas.
                      </td>
                    </tr>
                  )}

                  {rows.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{r.documentoid}</td>
                      <td className="px-3 py-2">{r.nombre}</td>
                      <td className="px-3 py-2">{r.apellido1}</td>
                      <td className="px-3 py-2">{r.apellido2}</td>
                      <td className="px-3 py-2">{r.rol}</td>
                      <td className="px-3 py-2">{r.emailacudiente}</td>
                      <td className="px-3 py-2">{r.telefonoacudiente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:col-span-1 space-y-4">
            {errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded">
                <strong className="text-sm text-red-700">Errores en CSV</strong>
                <ul className="list-disc ml-5 mt-2 text-xs text-red-700 max-h-36 overflow-auto">
                  {errors.slice(0, 20).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-xs text-gray-600 mb-2">Acciones</div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleUpload} disabled={loading || rows.length === 0} className="w-full">
                  {loading ? "Subiendo..." : "Enviar a Supabase"}
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setRows([]);
                    setErrors([]);
                    setCsvFileName(null);
                    setUploadResult(null);
                    (document.getElementById("com-file") as HTMLInputElement | null)?.value && ((document.getElementById("com-file") as HTMLInputElement).value = "");
                  }}
                  className="w-full"
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 text-emerald-700 text-sm">
              <strong>Consejo:</strong>
              <div className="text-xs">Asegúrate de que <code>documentoid</code> sea único y que los correos estén bien formateados.</div>
            </div>
          </div>
        </div>

        {/* server feedback */}
        <div className="mt-6 space-y-3">
          {uploadResult && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
              <strong>Resultado:</strong>
              <div className="text-sm mt-1">{uploadResult}</div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="p-3 bg-red-50 text-red-800 rounded border border-red-100">
              <strong>Detalles:</strong>
              <ul className="mt-2 text-sm">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
