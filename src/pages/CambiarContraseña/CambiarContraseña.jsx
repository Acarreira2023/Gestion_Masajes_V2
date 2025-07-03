/* src/pages/CambiarContraseña/CambiarContraseña.jsx */

import React, { useState } from "react";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useIdioma } from "../../context/IdiomaContext";
import styles from "./CambiarContraseña.module.css";

export default function CambiarContraseña() {
  const { t } = useIdioma();
  const navigate = useNavigate();
  const [actualPassword, setActualPassword]   = useState("");
  const [nuevaPassword, setNuevaPassword]     = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje]                 = useState("");
  const [error, setError]                     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nuevaPassword !== confirmarPassword) {
      setError(t("las_contraseñas_no_coinciden"));
      return;
    }
    if (nuevaPassword.length < 6) {
      setError(t("la_contraseña_debe_tener_al_menos_6_caracteres"));
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user?.email) {
      try {
        const cred = EmailAuthProvider.credential(user.email, actualPassword);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, nuevaPassword);
        setMensaje(t("contraseña_actualizada_correctamente"));
        setActualPassword("");
        setNuevaPassword("");
        setConfirmarPassword("");
      } catch (err) {
        if (err.code === "auth/wrong-password") {
          setError(t("la_contraseña_actual_es_incorrecta"));
        } else {
          setError(t("error_al_cambiar_la_contraseña"));
        }
      }
    } else {
      setError(t("no_hay_usuario_autenticado"));
    }
  };

  const handleCerrarSesion = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  const handleAtras = () => navigate(-1);

  return (
    <div className={styles.formulario}>
      <h2 className={styles.title}>{t("cambiar_contrasena")}</h2>

      {mensaje && (
        <p className={`${styles.message} ${styles.success}`}>{mensaje}</p>
      )}
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="actualPassword">{t("contrasena_actual")}</label>
          <input
            type="password"
            id="actualPassword"
            value={actualPassword}
            onChange={(e) => setActualPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="nuevaPassword">{t("nueva_contrasena")}</label>
          <input
            type="password"
            id="nuevaPassword"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmarPassword">
            {t("confirmar_contrasena")}
          </label>
          <input
            type="password"
            id="confirmarPassword"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.primary}>
            {t("cambiar_contrasena")}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={handleAtras}
          >
            {t("volver")}
          </button>
        </div>
      </form>
    </div>
  );
}