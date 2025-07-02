import { doc, getDoc, setDoc } from "firebase/firestore";
import { db }                  from "./firebaseService";

const LISTADOS_COLLECTION = "listados";

/**
 * Lee el array de strings de `listados/{key}`.
 * @returns {Promise<string[]>}
 */
export async function obtenerListado(key) {
  const ref  = doc(db, LISTADOS_COLLECTION, key);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.items) ? data.items : [];
}

/**
 * Escribe o actualiza `items` en `listados/{key}`.
 * @returns {Promise<void>}
 */
export async function actualizarListado(key, items) {
  const ref = doc(db, LISTADOS_COLLECTION, key);
  await setDoc(ref, { items }, { merge: true });
}