// src/components/NavBar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/ingresos">Ingresos</Link>
      <Link to="/egresos">Egresos</Link>
      {user?.role === "developer" && (
        <Link to="/register">Registrar usuario</Link>
      )}
      <button onClick={logout}>Salir</button>
    </nav>
  );
}
// Este componente NavBar muestra enlaces de navegación y un botón de salida.
// Utiliza el contexto de autenticación para acceder al usuario actual y su rol.