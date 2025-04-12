"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";

const AuthLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login exitoso");
      window.location.href = "/dashboard";
    } else {
      setError(data.error);
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
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-primary text-white rounded-xl">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
