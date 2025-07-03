/* src/hooks/useIngresosRealtime.jsx
 * Descripción: Hook para obtener ingresos en tiempo real desde Firestore.
 * Permite leer los ingresos ordenados por fecha de forma reactiva.
 */
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseService";

/**
 * Solo lectura en tiempo real de "ingresos"
 */
export function useIngresosRealtime() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const q = query(collection(db, "ingresos"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(
      q,
      snap => {
        setIngresos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error("Realtime error:", err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { ingresos, loading, error };
}
