// src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "../services/firebaseService";
import { toast } from "react-hot-toast";

// Importar funciones para rol desde Firestore
import { fetchUserRole } from "../services/userService";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Escuchar estado de auth y leer rol desde Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Obtener rol del doc /users/{uid}, por defecto "user"
        const role = await fetchUserRole(fbUser.uid);
        setUser({
          uid:   fbUser.uid,
          email: fbUser.email,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 2) Funciones de login / registro / logout
  const login = useCallback((email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
        toast.error("Error al iniciar sesión: " + err.message);
        throw err;
      }),
    []
  );

  const register = useCallback((email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
      .catch(err => {
        toast.error("Error al registrar usuario: " + err.message);
        throw err;
      }),
    []
  );

  const logout = useCallback(() =>
    firebaseSignOut(auth).catch(err => {
      toast.error("Error al cerrar sesión: " + err.message);
      throw err;
    }),
    []
  );

  // 3) Cerrar sesión solo al cerrar la pestaña/ventana, no al recargar
  useEffect(() => {
    let isReloading = false;

    // Marcar reload si F5 o Ctrl/Cmd+R
    const onKeyDown = (e) => {
      const refresh =
        e.key === "F5" ||
        ((e.key === "r" || e.key === "R") && (e.ctrlKey || e.metaKey));
      if (refresh) isReloading = true;
    };
    window.addEventListener("keydown", onKeyDown);

    // Antes de unload, si no fue reload, disparar logout
    const onBeforeUnload = () => {
      if (!isReloading) logout();
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [logout]);

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}