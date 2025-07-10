// src/index.js

// 1. Carga primero Bootstrap (CSS y JS)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./services/firebaseService";
console.log("▶️ index.js cargado");

import App from "./App";
import "./index.css";

import ErrorBoundary      from "./components/ErrorBoundary/ErrorBoundary";
import { IdiomaProvider } from "./context/IdiomaContext";
import { AuthProvider }   from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <IdiomaProvider>
        <AuthProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </IdiomaProvider>
    </ErrorBoundary>
  </React.StrictMode>
);