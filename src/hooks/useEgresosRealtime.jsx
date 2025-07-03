/* src/hooks/useEgresosRealtime.jsx
 * Descripción: Hook para obtener egresos en tiempo real desde Firestore.
 * Permite leer los egresos ordenados por fecha de forma reactiva.
 */
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseService";

/**
 * useEgresosRealtime
 * — Suscripción en tiempo real a la colección "egresos"
 * — Devuelve { egresos, loading, error }
 */
export function useEgresosRealtime() {
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const q = query(collection(db, "egresos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setEgresos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Realtime error (egresos):", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { egresos, loading, error };
}
