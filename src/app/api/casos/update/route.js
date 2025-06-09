import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req) {
  const client = await pool.connect();
  try {
    const {
      caso,
      actores,
      descripcion,
      intervencion,
      ruta_atencion,
      evidencias
    } = await req.json();

    await client.query("BEGIN");

    // Actualiza tabla 'casos'
    const updateCasoQuery = `
     UPDATE casos
      SET fecha_caso = $2,
          tipo_caso = $3,
          es_confidencial = $4
      WHERE id_caso = $1
    `;
    await client.query(updateCasoQuery, [
      caso.id_caso,
      caso.tipo_caso,
      caso.fecha_caso
    ]);

    // Actualiza actores
    if (actores?.length) {
      for (const actor of actores) {
        const updateActorQuery = `
          UPDATE actores
          SET rol = $3,
              nombre_completo = $4,
              tipo_documento = $5,
              nombre_acudiente = $6,
              telefono_acudiente = $7,
              email_acudiente = $8
          WHERE id_caso = $1 AND documento_id = $2
        `;
        await client.query(updateActorQuery, [
          caso.id_caso,
          actor.documento_id,
          actor.rol,
          actor.nombre_completo,
          actor.tipo_documento,
          actor.nombre_acudiente || null,
          actor.telefono_acudiente || null,
          actor.email_acudiente || null
        ]);
      }
    }

    // Actualiza descripción
    if (descripcion) {
      const updateDescQuery = `
        UPDATE descripciones
        SET version_estudiante_vinculado = $2,
            version_estudiante_implicado = $3,
            version_testigos = $4
        WHERE id_caso = $1
      `;
      await client.query(updateDescQuery, [
        caso.id_caso,
        descripcion.version_estudiante_vinculado || null,
        descripcion.version_estudiante_implicado || null,
        descripcion.version_testigos || null
      ]);
    }

    // Actualiza intervención
    if (intervencion) {
      const updateIntervencionQuery = `
        UPDATE intervenciones
        SET tipo_decision = $2,
            decision_comite = $3,
            compromisos = $4,
            fecha_compromiso = $5
        WHERE id_caso = $1
      `;
      await client.query(updateIntervencionQuery, [
        caso.id_caso,
        intervencion.tipoDecision ?? '',
        intervencion.decisionComite ?? '',
        intervencion.compromisos ?? '',
        intervencion.fechaCompromiso ?? null
      ]);
    }

    // Actualiza ruta de atención
    if (ruta_atencion) {
      const updateRutaQuery = `
        UPDATE ruta_atencion
        SET ruta_activada = $2,
            tipo_remision = $3,
            fecha = $4,
            remitido = $5,
            institucion = $6,
            contacto = $7,
            observaciones = $8
        WHERE id_caso = $1
      `;
      await client.query(updateRutaQuery, [
        caso.id_caso,
        ruta_atencion.ruta_activada ? 1 : 0,
        ruta_atencion.tipo_remision,
        ruta_atencion.fecha,
        ruta_atencion.remitido,
        ruta_atencion.institucion,
        ruta_atencion.contacto,
        ruta_atencion.observaciones
      ]);
    }

    // Actualiza evidencias (sólo si tienen id_evidencia, lo cual implica que ya existen)
    if (evidencias?.length) {
      for (const evidencia of evidencias) {
        if (evidencia.id_evidencia) {
          const updateEvidenciaQuery = `
            UPDATE evidencias
            SET id_caso = $2,
                tipo_archivo = $3,
                url_archivo = $4
            WHERE id_evidencia = $1
          `;
          await client.query(updateEvidenciaQuery, [
            evidencia.id_evidencia,
            caso.id_caso,
            evidencia.tipo_archivo,
            evidencia.url_archivo
          ]);
        }
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ message: "Caso actualizado exitosamente" }, { status: 200 });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en updateCaso:", error);
    return NextResponse.json({ error: "Error interno al actualizar el caso" }, { status: 500 });
  } finally {
    client.release();
  }
}
