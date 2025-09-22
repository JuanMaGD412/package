"use client";

import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

type RawRow = Record<string, string | undefined>;

type CasoPreview = {
  id_caso: string;
  fecha_caso: string;
  tipo_caso: string;
  es_confidencial: string | number;
  estado?: string;
  // campos opcionales que podrían venir en el CSV para actores/descripciones/etc.
  documento_id?: string;
  tipo_documento?: string;
  rol?: string;
  nombre_completo?: string;
  nombre_acudiente?: string;
  telefono_acudiente?: string;
  email_acudiente?: string;
  version_estudiante_vinculado?: string;
  version_estudiante_implicado?: string;
  version_testigos?: string;
  nombre_archivo?: string;
  descripcion?: string;
  tipo_archivo?: string;
  tamano_archivo?: string;
  ruta_archivo?: string;
  tipo_decision?: string;
  decision_comite?: string;
  compromisos?: string;
  fecha_compromiso?: string;
};

export default function CasosUploadPage() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<CasoPreview[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  const expectedCasos = ["id_caso", "fecha_caso", "tipo_caso", "es_confidencial"];

  function normalizeKey(k?: string) {
    return (k || "").trim().toLowerCase();
  }

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
      transformHeader: (h) => (h ? h.trim() : h),
      complete: (results: ParseResult<RawRow>) => {
        const data = results.data;
        const localErrors: string[] = [];
        const cleaned: CasoPreview[] = [];

        data.forEach((r, idx) => {
          const row: Record<string, string | undefined> = {};
          for (const k in r) {
            const nk = normalizeKey(k);
            row[nk] = typeof r[k] === "string" ? (r[k] as string).trim() : r[k];
          }

          const missing: string[] = [];
          for (const f of expectedCasos) {
            if (!row[f] || String(row[f]).trim() === "") missing.push(f);
          }

          if (missing.length > 0) {
            localErrors.push(`Fila ${idx + 2}: faltan campos: ${missing.join(", ")}`);
            return;
          }

          cleaned.push({
            id_caso: row["id_caso"] as string,
            fecha_caso: row["fecha_caso"] as string,
            tipo_caso: row["tipo_caso"] as string,
            es_confidencial: row["es_confidencial"] as string,
            estado: (row["estado"] as string) || "abierto",
            documento_id: row["documento_id"],
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  };

  const handleUpload = async () => {
    setServerErrors([]);
    setUploadResult(null);

    if (rows.length === 0) {
      setServerErrors(["No hay filas válidas para subir."]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/casos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.invalidRows) {
          setServerErrors([
            "La API reportó filas inválidas. Revisa el CSV.",
            JSON.stringify(data.invalidRows).slice(0, 1000),
          ]);
        } else {
          setServerErrors([data?.error || "Error en la API"]);
        }
      } else {
        setUploadResult(data);
        // router.push("/casos"); // si quieres redirigir
      }
    } catch (err: any) {
      console.error(err);
      setServerErrors([err?.message || "Error al conectar con servidor"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Carga masiva de Casos (CSV)</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sube un archivo CSV con los campos mínimos: <span className="font-medium">id_caso, fecha_caso, tipo_caso, es_confidencial</span>.
        </p>

        {/* file selector */}
        <div className="mb-6">
          <label
            htmlFor="csv-file"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-slate-800 text-white cursor-pointer hover:opacity-90 shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0l3 3M12 3l-3 3" />
            </svg>
            Seleccionar archivo
          </label>
          <input id="csv-file" type="file" accept=".csv,text/csv" onChange={onFileChange} className="hidden" />

          {fileName ? (
            <span className="ml-4 inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded">
              <strong className="text-sm">{fileName}</strong>
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  setRows([]);
                  setParseErrors([]);
                  setUploadResult(null);
                  setServerErrors([]);
                  (document.getElementById("csv-file") as HTMLInputElement | null)?.value && ((document.getElementById("csv-file") as HTMLInputElement).value = "");
                }}
                className="text-xs text-slate-500 hover:text-red-600"
                aria-label="Eliminar archivo"
              >
                ✕
              </button>
            </span>
          ) : (
            <span className="ml-4 text-sm text-gray-400">No hay archivo seleccionado</span>
          )}

          <div className="mt-3 text-xs text-gray-400">
            Puedes subir hasta 10.000 filas. La previsualización muestra las primeras filas válidas.
          </div>
        </div>

        {/* preview + errors */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="overflow-auto border rounded-lg max-h-72">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">id_caso</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">fecha_caso</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">tipo_caso</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">confidencial</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">estado</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">documento</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 200).map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{r.id_caso}</td>
                      <td className="px-3 py-2">{r.fecha_caso}</td>
                      <td className="px-3 py-2">{r.tipo_caso}</td>
                      <td className="px-3 py-2">{String(r.es_confidencial)}</td>
                      <td className="px-3 py-2">{r.estado ?? "abierto"}</td>
                      <td className="px-3 py-2">{r.documento_id ?? "-"}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-sm text-gray-500" colSpan={7}>
                        No hay filas previsualizadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
                  // color prop queda visible; si usas flowbite, color="purple" o "primary"
                >
                  {loading ? "Enviando..." : "Enviar a la base (API)"}
                </Button>

                <Button
                  color="gray"
                  onClick={() => {
                    setRows([]);
                    setFileName(null);
                    setParseErrors([]);
                    setUploadResult(null);
                    setServerErrors([]);
                    (document.getElementById("csv-file") as HTMLInputElement | null)?.value && ((document.getElementById("csv-file") as HTMLInputElement).value = "");
                  }}
                  className="w-full"
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 text-emerald-700 text-sm">
              <strong>Consejo:</strong>
              <div className="text-xs">Asegúrate de que <code>id_caso</code> sea único para evitar errores de clave duplicada.</div>
            </div>
          </div>
        </div>

        {/* server errors + result */}
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
              <pre className="text-xs overflow-auto mt-2 max-h-48">{JSON.stringify(uploadResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
