import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIdioma } from "../../context/IdiomaContext";
import { useSettings } from "../../hooks/useSettings";
import styles from "./Configuracion.module.css";

const THEME_COLORS = {
  zen:     "#6ab04c",
  oceano:  "#0288d1",
  lavanda: "#9575cd",
  selva:   "#43a047",
  piedra:  "#607d8b",
  crema:   "#ffb74d"
};

export default function Configuracion() {
  const { t, idioma, setIdioma } = useIdioma();
  const {
    settings: { theme, availableThemes },
    setTheme
  } = useSettings();
  const navigate = useNavigate();

  const [nuevoIdioma, setNuevoIdioma] = useState(idioma);
  const [nuevoTema,   setNuevoTema]   = useState(theme);

  useEffect(() => {
    setNuevoTema(theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIdioma(nuevoIdioma);
    setTheme(nuevoTema);
  };

  const handleChangePassword = () => {
    navigate("/cambiar-contrasena");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("configuracion")}</h2>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="idioma" className={styles.label}>
            {t("idioma")}:
          </label>
          <select
            id="idioma"
            value={nuevoIdioma}
            onChange={(e) => setNuevoIdioma(e.target.value)}
            className={styles.select}
          >
            <option value="es">{t("español")}</option>
            <option value="en">{t("inglés")}</option>
            <option value="pt">{t("portugués")}</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{t("tema_visual")}:</label>
          <div className={styles.selector}>
            {availableThemes.map((tName) => (
              <button
                key={tName}
                type="button"
                className={`${styles.opcion} ${
                  nuevoTema === tName ? styles.activo : ""
                }`}
                onClick={() => setNuevoTema(tName)}
                style={{ "--hover-accent": THEME_COLORS[tName] }}
              >
                <span
                  className={styles.color}
                  style={{ backgroundColor: THEME_COLORS[tName] }}
                />
                <span className={styles.nombre}>
                  {t(`tema_${tName}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`${styles.field} ${styles.centerButton}`}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleChangePassword}
          >
            {t("cambiar_contrasena")}
          </button>
        </div>

        <button type="submit" className={styles.button}>
          {t("guardar")}
        </button>
      </form>
    </div>
  );
}