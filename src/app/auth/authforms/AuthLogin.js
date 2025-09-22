"use client";

import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AuthLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Si tu API devuelve data.usuario, lo guardamos para la UI cliente
        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
        }
        // La cookie httpOnly con el token (si la API la setea) ya está en el navegador
        router.push("/dashboard");
      } else {
        // Mostrar el mensaje de error enviado por la API o uno genérico
        setError(data?.error || "Credenciales inválidas.");
      }
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <Label htmlFor="username" value="Username" />
          <TextInput
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="usuario"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-primary text-white rounded-xl"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Sign in"}
        </Button>

        <div className="mt-4 text-center">
          <Link href="/auth/register" className="text-primary text-sm font-medium">
            Create an account
          </Link>
        </div>
      </form>
    </>
  );
};

export default AuthLogin;
