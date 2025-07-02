import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebaseService";

/**
 * Inicia sesión con email y password.
 * @returns {Promise<UserCredential>}
 */
export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Registra un usuario nuevo con email y password.
 * @returns {Promise<UserCredential>}
 */
export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Cierra la sesión actual.
 * @returns {Promise<void>}
 */
export function logout() {
  return firebaseSignOut(auth);
}

/**
 * Se suscribe a cambios de auth.
 * @param {(user: import('firebase/auth').User|null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}