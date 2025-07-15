// src/services/userService.js

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseService";

/**
 * Busca el rol en /users/{uid}. Si no hay doc, retorna "user".
 */
export async function fetchUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return "user";
  const data = snap.data();
  return data.role === "admin" ? "admin" : "user";
}