/* src/App.jsx */
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";
import { useSettings } from "./hooks/useSettings";

const Login               = lazy(() => import("./pages/Login/Login"));
const Ingresar            = lazy(() => import("./pages/Ingresar/Ingresar"));
const Datos               = lazy(() => import("./pages/Datos/Datos"));
const Graficos_1          = lazy(() => import("./pages/Graficos1/Graficos1"));
const Configuracion       = lazy(() => import("./pages/Configuracion/Configuracion"));
const CambiarContraseña   = lazy(() => import("./pages/CambiarContraseña/CambiarContraseña"));
const CerrarSesion        = lazy(() => import("./pages/CerrarSesion/CerrarSesion"));

export default function App() {
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
          <Route path="ingresar"       element={<Ingresar />} />
          <Route path="datos"          element={<Datos />} />
          <Route path="graficos1"      element={<Graficos_1 />} />
          <Route path="configuracion"  element={<Configuracion />} />
          <Route path="cambiar-contrasena" element={<CambiarContraseña />} />
          <Route path="logout"         element={<CerrarSesion />} />
        </Route>

        <Route path="*" element={<Navigate to="/ingresos" replace />} />
      </Routes>
    </Suspense>
  );
}