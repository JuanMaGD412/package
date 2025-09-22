// src/app/api/login/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_this";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
    }

    // Normalizar username igual que en registro si aplicaste normalización
    const usernameNorm = username.trim();

    // Buscar usuario
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", usernameNorm)
      .limit(1)
      .single();

    if (error || !user) {
      // Si quieres menos información a un posible atacante, puedes devolver 401 genérico
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // === Comparación en texto plano (temporal) ===
    if (user.password !== password) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Generar token JWT (útil para proteger rutas server-side)
    const payload = {
      id: user.id,
      username: user.username,
      rol: user.rol,
      colegio: user.colegio,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    // Preparar respuesta: devolver usuario (sin contraseña)
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: user.id,
        username: user.username,
        rol: user.rol,
        colegio: user.colegio,
      },
    });

    // Poner cookie httpOnly con el token (más seguro que localStorage)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 horas
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login exception:", err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
