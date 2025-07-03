// src/components/ChartModeToggle/ChartModeToggle.jsx
import React from "react";
import styles from "./ChartModeToggle.module.css";

/**
 * Componente para alternar entre gráfico de barras y de tortas
 */
export default function ChartModeToggle({ mode, onChange }) {
  return (
    <div className={styles.toggle}>
      <button
        className={mode === "bar" ? styles.active : ""}
        onClick={() => onChange("bar")}
        aria-pressed={mode === "bar"}
      >
        Barras
      </button>
      <button
        className={mode === "pie" ? styles.active : ""}
        onClick={() => onChange("pie")}
        aria-pressed={mode === "pie"}
      >
        Tortas
      </button>
    </div>
  );
}