// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useIdioma } from "../../context/IdiomaContext";
import fondoImg from "../../assets/imagenes/Login-Spa.jpg";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const { t } = useIdioma();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate("/home");
    } catch (err) {
      setError(err.message || t("error_login") || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${fondoImg})` }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{t("Bienvenido")}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          {t("Usuario")}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          {t("Contraseña")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            {t("Recordar")}
          </label>
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={loading}
        >
          {loading ? `${t("Ingresar")}...` : t("Ingresar")}
        </button>
      </form>
    </div>
  );
}