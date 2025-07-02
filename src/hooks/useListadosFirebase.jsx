// src/hooks/useListadosFirebase.jsx

import { useState, useEffect, useCallback } from "react";
import { obtenerListado, actualizarListado } from "../services/listadosService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

/**
 * Hook para cargar y editar un listado almacenado en Firestore.
 * @param {string} key — nombre del documento en /listados
 */
export function useListadosFirebase(key) {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial del listado
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    obtenerListado(key)
      .then((arr) => {
        if (mounted) setItems(arr);
      })
      .catch((err) => {
        console.error(`Error cargando listado ${key}:`, err);
        toast.error("Error cargando datos");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [key]);

  // Añade un nuevo ítem al listado en memoria
  const addItem = useCallback((value) => {
    const v = value.trim();
    if (!v) return;
    setItems((prev) => [...prev, v]);
  }, []);

  // Elimina un ítem por índice en memoria
  const removeItem = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Guarda cambios en Firestore (solo developer)
  const save = useCallback(async () => {
    if (user?.role !== "developer") {
      return toast.error("Sin permisos para modificar listados");
    }
    try {
      await actualizarListado(key, items);
      toast.success("Listado actualizado");
    } catch (err) {
      console.error(`Error guardando listado ${key}:`, err);
      toast.error("Error al guardar datos");
    }
  }, [key, items, user]);

  return { items, loading, addItem, removeItem, save };
}
