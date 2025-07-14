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
  signOut as firebaseSignOut,
  getIdTokenResult
} from "firebase/auth";
import { auth } from "../services/firebaseService";
import { toast } from "react-hot-toast";

// 1) Contexto y hook
export const AuthContext = createContext(null);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

// 2) Provider
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("🟢 AuthProvider montado. loading=", loading, "user=", user);

  // Estado de autenticación
  useEffect(() => {
    console.log("→ Registrando onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("← callback onAuthStateChanged:", fbUser);

      if (fbUser) {
        let role = null;
        try {
          const idTokenRes = await getIdTokenResult(fbUser, false);
          role = idTokenRes.claims.role || null;
        } catch (err) {
          console.warn("No se pudo leer custom claims:", err);
        }
        setUser({
          uid:   fbUser.uid,
          email: fbUser.email,
          name:  fbUser.displayName || "",
          role
        });
      } else {
        setUser(null);
      }

      setLoading(false);
      console.log(
        "⚙️ onAuthStateChanged finalizado. loading=",
        false,
        "user=",
        fbUser
      );
    });

    return () => {
      console.log("→ Desinscribiendo onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  // Funciones de login / register / logout
  const login = useCallback((email, password) =>
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      toast.error("Error al iniciar sesión: " + err.message);
      throw err;
    }), []
  );

  const register = useCallback((email, password) => {
    if (user?.role !== "developer") {
      toast.error("Sin permisos para crear usuarios");
      return Promise.reject(new Error("Sin permisos para crear usuarios"));
    }
    return createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        toast.success("Usuario creado: " + email);
        return cred;
      })
      .catch((err) => {
        toast.error("Error al registrar usuario: " + err.message);
        throw err;
      });
  }, [user]);

  const logout = useCallback(() =>
    firebaseSignOut(auth).catch((err) => {
      toast.error("Error al cerrar sesión: " + err.message);
      throw err;
    }), []
  );

  // 3) Efecto para cerrar sesión sólo al cerrar la pestaña/ventana
  useEffect(() => {
    let isReloading = false;

    // Detectar F5 o Ctrl+R / ⌘+R
    const onKeyDown = (e) => {
      const refresh =
        e.key === "F5" ||
        ((e.key === "r" || e.key === "R") && (e.ctrlKey || e.metaKey));
      if (refresh) isReloading = true;
    };
    window.addEventListener("keydown", onKeyDown);

    // Antes de descargar la página, si NO fue recarga, cierra sesión
    const onBeforeUnload = () => {
      if (!isReloading) {
        logout();
      }
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