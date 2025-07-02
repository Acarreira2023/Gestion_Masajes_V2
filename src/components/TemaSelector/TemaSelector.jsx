import React from "react";
import { useSettings } from "../../hooks/useSettings";
import { useIdioma } from "../../context/IdiomaContext";
import styles from "./TemaSelector.module.css";

export default function TemaSelector() {
  const { t } = useIdioma();
  const {
    settings: { theme, availableThemes },
    setTheme
  } = useSettings();

  return (
    <div className={styles.selector}>
      {availableThemes.map((tName) => (
        <button
          key={tName}
          type="button"
          className={`${styles.opcion} ${
            theme === tName ? styles.activo : ""
          }`}
          onClick={() => setTheme(tName)}
        >
          <span className={styles.nombre}>{t(`tema_${tName}`)}</span>
        </button>
      ))}
    </div>
  );
}