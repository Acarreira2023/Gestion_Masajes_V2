// src/hooks/useListadosLocal.jsx

import { useState, useEffect } from "react";
import { DEFAULT_LISTADOS } from "../data/listados";

const LS_KEY = "app_listados";

function loadAll() {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }
  return { ...DEFAULT_LISTADOS };
}

function saveAll(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

/**
 * Hook para obtener y persistir un listado en localStorage.
 * @param {string} key — nombre del listado (ej: "tiposIngreso")
 * @returns {[string[], (newItems: string[]) => void]}
 */
export function useListadosLocal(key) {
  const [items, setItems] = useState(() => {
    const all = loadAll();
    return all[key] || [];
  });

  // Escucha cambios externos al LS (p.ej. en otra pestaña)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        const all = loadAll();
        if (all[key]) {
          setItems(all[key]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  /**
   * Actualiza este listado en localStorage y state.
   * @param {string[]} newItems
   */
  const update = (newItems) => {
    const all = loadAll();
    all[key] = newItems;
    saveAll(all);
    setItems(newItems);
  };

  return [items, update];
}
