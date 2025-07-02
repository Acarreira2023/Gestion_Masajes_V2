/* src/pages/Filtros/Filtros.jsx*/

import React from "react";
import { useIdioma } from "../../context/IdiomaContext";
import styles from "./Filtros.module.css";

export default function Filtros({ filtros, onChange }) {
  const { t } = useIdioma();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    onChange({
      ...filtros,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className={styles.filtrosContainer}>
      {/* Fecha única */}
      <div className={styles.filtro}>
        <label htmlFor="fecha">{t("fecha")}:</label>
        <input
          type="date"
          name="fecha"
          value={filtros.fecha || ""}
          onChange={handleChange}
        />
      </div>

      {/* Comparar con año anterior */}
      <div className={styles.filtroCheckbox}>
        <label>
          <input
            type="checkbox"
            name="compararAnterior"
            checked={filtros.compararAnterior || false}
            onChange={handleChange}
          />
          {t("comparar_con_anio_anterior")}
        </label>
      </div>
    </div>
  );
}
