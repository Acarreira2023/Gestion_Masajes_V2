// src/components/PrivateRoute/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  console.log("🔒 PrivateRoute useAuth():", { user, loading });

  if (loading) {
    console.log("🔄 PrivateRoute: todavía loading");
    return <Loader />;
  }
  if (!user) {
    console.log("⛔ PrivateRoute: no hay user, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ PrivateRoute: hay user, renderizando children");
  return children;
}