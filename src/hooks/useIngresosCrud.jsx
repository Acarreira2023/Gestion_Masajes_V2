/* src/hooks/useIngresosCrud.jsx
 * Descripción: Hook para CRUD de ingresos.
 * Permite crear, editar y eliminar ingresos en Firestore.
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
 * Funciones de creación, edición y eliminación de ingresos.
 * No lee datos: confía en que el realtime‐hook actualizará la UI.
 */
export function useIngresosCrud() {
  const createIngreso = useCallback(async data => {
    try {
      await addDoc(collection(db, "ingresos"), data);
      toast.success("Ingreso agregado");
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Error al agregar ingreso");
    }
  }, []);

  const editIngreso = useCallback(async (id, updates) => {
    try {
      const ref = doc(db, "ingresos", id);
      await updateDoc(ref, updates);
      toast.success("Ingreso actualizado");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error al actualizar ingreso");
    }
  }, []);

  const removeIngreso = useCallback(async id => {
    try {
      const ref = doc(db, "ingresos", id);
      await deleteDoc(ref);
      toast.success("Ingreso eliminado");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error al eliminar ingreso");
    }
  }, []);

  return { createIngreso, editIngreso, removeIngreso };
}
