// src/App.jsx

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";
import { useSettings } from "./hooks/useSettings";

const Login         = lazy(() => import("./pages/Login/Login"));
const Ingresar      = lazy(() => import("./pages/Ingresar/Ingresar"));
const Datos         = lazy(() => import("./pages/Datos/Datos"));
const Ingresos      = lazy(() => import("./pages/Ingresos/Ingresos"));
const Graficos      = lazy(() => import("./pages/Graficos/Graficos"));
const Configuracion = lazy(() => import("./pages/Configuracion/Configuracion"));
const CerrarSesion  = lazy(() => import("./pages/CerrarSesion/CerrarSesion"));

export default function App() {
  // Engancha la lógica de tema al body
  useSettings();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="ingresos" replace />} />
          <Route path="ingresar"      element={<Ingresar />} />
          <Route path="datos"         element={<Datos />} />
          <Route path="ingresos"      element={<Ingresos />} />
          <Route path="graficos"      element={<Graficos />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="logout"        element={<CerrarSesion />} />
        </Route>

        <Route path="*" element={<Navigate to="/ingresos" replace />} />
      </Routes>
    </Suspense>
  );
}