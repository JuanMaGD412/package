import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Datos recibidos:", body);

    const { institucion_id, destinatario, asunto, mensaje, pdfBase64 } = body;

    if (!institucion_id) throw new Error("Falta el institucion_id");

    // 1️⃣ Conexión a Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("🔎 Buscando configuración de correo...");
    const { data: config, error } = await supabase
      .from("email_config")
      .select("*")
      .eq("institucion_id", institucion_id)
      .single();

    if (error) {
      console.error("❌ Error consultando email_config:", error);
      throw new Error("Error al consultar configuración del correo");
    }
    if (!config) throw new Error("No se encontró configuración de correo");

    console.log("✅ Configuración encontrada:", {
      host: config.smtp_host,
      port: config.smtp_port,
      user: config.smtp_user,
    });

    // 2️⃣ Crear transporter SMTP
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: Number(config.smtp_port) === 465, // true si es SSL (465)
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password,
      },
    });

    // 3️⃣ Verificar conexión
    await transporter.verify();
    console.log("✅ Conexión SMTP verificada correctamente");

    // 4️⃣ Convertir PDF base64 → Buffer
    const cleanBase64 = pdfBase64.split("base64,").pop(); // elimina prefijo si existe
    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    // 5️⃣ Crear correo
    const mailOptions = {
      from: `"${config.nombre_remitente || "Institución"}" <${config.smtp_user}>`,
      to: destinatario,
      subject: asunto || "Reporte del estudiante",
      html: mensaje || "<p>Adjunto el reporte del estudiante.</p>",
      attachments: [
        {
          filename: "ReporteCasosEstudiante.pdf",
          content: pdfBuffer,
          encoding: "base64", // ✅ importante: especificar codificación
          contentType: "application/pdf",
        },
      ],
    };

    console.log("📤 Enviando correo...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado correctamente:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Correo enviado correctamente",
      info,
    });
  } catch (error) {
    console.error("💥 Error completo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
    