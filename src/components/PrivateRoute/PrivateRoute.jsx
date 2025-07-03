// src/components/PrivateRoute/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user: currentUser, loading } = useAuth();

  // Mientras se comprueba la sesión, mostramos loader
  if (loading) {
    return <Loader />;
  }

  // Si no hay usuario autenticado, redirigimos al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado: renderizamos el layout o las rutas hijas
  return children;
}