/* src/hooks/useEgresosCrud.jsx
 * Descripción: Hook para CRUD de egresos.
 * Permite crear, editar y eliminar egresos en Firestore.
 */
import { useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../services/firebaseService";
import { toast } from "react-hot-toast";

/**
 * useEgresosCrud
 * — Exposición de las funciones create/edit/delete para la colección "egresos"
 * — No mantiene estado de lectura; confía en useEgresosRealtime para actualizar UI
 */
export function useEgresosCrud() {
  const createEgreso = useCallback(async (data) => {
    try {
      await addDoc(collection(db, "egresos"), data);
      toast.success("Egreso agregado");
    } catch (err) {
      console.error("Create error (egresos):", err);
      toast.error("Error al agregar egreso");
    }
  }, []);

  const editEgreso = useCallback(async (id, updates) => {
    try {
      const ref = doc(db, "egresos", id);
      await updateDoc(ref, updates);
      toast.success("Egreso actualizado");
    } catch (err) {
      console.error("Update error (egresos):", err);
      toast.error("Error al actualizar egreso");
    }
  }, []);

  const removeEgreso = useCallback(async (id) => {
    try {
      const ref = doc(db, "egresos", id);
      await deleteDoc(ref);
      toast.success("Egreso eliminado");
    } catch (err) {
      console.error("Delete error (egresos):", err);
      toast.error("Error al eliminar egreso");
    }
  }, []);

  return { createEgreso, editEgreso, removeEgreso };
}
