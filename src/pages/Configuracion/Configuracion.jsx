// src/pages/Configuracion/Configuracion.jsx
import React, { useState, useEffect } from "react";
import { useIdioma } from "../../context/IdiomaContext";
import { useSettings } from "../../hooks/useSettings";
import styles from "./Configuracion.module.css";

// Mapa de colores de acento por tema
const THEME_COLORS = {
  zen:      "#6ab04c",
  oceano:   "#0288d1",
  lavanda:  "#9575cd",
  selva:    "#43a047",
  piedra:   "#607d8b",
  crema:    "#ffb74d",
};

export default function Configuracion() {
  const { t, idioma, setIdioma } = useIdioma();
  const {
    settings: { theme, availableThemes },
    setTheme
  } = useSettings();

  const [nuevoIdioma, setNuevoIdioma] = useState(idioma);
  const [nuevoTema,   setNuevoTema]   = useState(theme);

  // Cuando cambie externamente el tema, sincronizo el botón activo
  useEffect(() => {
    setNuevoTema(theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIdioma(nuevoIdioma);
    setTheme(nuevoTema);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("configuracion")}</h2>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Selector de idioma */}
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

        {/* Selector de tema con hover coloreado */}
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
                // Inyectamos la variable CSS --hover-accent
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

        <button type="submit" className={styles.button}>
          {t("guardar")}
        </button>
      </form>
    </div>
);
}