// src/context/IdiomaContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadLocale } from "../utils/i18n";

const IdiomaContext = createContext();

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de <IdiomaProvider>");
  return ctx;
}

export function IdiomaProvider({ children }) {
  // 1) Estado y setter renombrados para que coincidan con el hook
  const stored  = localStorage.getItem("idioma") || "es";
  const [idioma, _setIdioma] = useState(stored);

  // 2) Dictado de traducciones
  const [dict, setDict]     = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    loadLocale(idioma)
      .then(translations => {
        if (mounted) setDict(translations);
      })
      .catch(err => console.error("Error loading locale:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [idioma]);

  // 3) Función de traducción
  function t(key, params = {}) {
    let text = dict[key] ?? key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, v);
    });
    return text;
  }

  // 4) Setter expuesto, guarda en localStorage
  function setIdioma(newIdioma) {
    localStorage.setItem("idioma", newIdioma);
    _setIdioma(newIdioma);
  }

  // 5) Proveedor
  return (
    <IdiomaContext.Provider
      value={{ t, idioma, setIdioma, loading }}
    >
      {children}
    </IdiomaContext.Provider>
  );
}