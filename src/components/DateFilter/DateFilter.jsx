// src/components/DateFilter/DateFilter.jsx
import React, { useState, useEffect } from "react";
import styles from "./DateFilter.module.css";
import { useIdioma } from "../../context/IdiomaContext";

export default function DateFilter({ onChange }) {
  const { t } = useIdioma();
  const [mode, setMode] = useState("single"); // "single" | "range"
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate]     = useState("");
  const [toDate, setToDate]         = useState("");

  // Cada vez que cambie cualquiera de los inputs, notificamos
  useEffect(() => {
    if (mode === "single") {
      onChange({ mode, date: singleDate });
    } else {
      onChange({ mode, from: fromDate, to: toDate });
    }
  }, [mode, singleDate, fromDate, toDate]);

  return (
    <div className={styles.filter}>
      <div className={styles.modes}>
        <label>
          <input
            type="radio"
            name="dateMode"
            value="single"
            checked={mode === "single"}
            onChange={() => setMode("single")}
          />
          {t("fecha_unica")}
        </label>
        <label>
          <input
            type="radio"
            name="dateMode"
            value="range"
            checked={mode === "range"}
            onChange={() => setMode("range")}
          />
          {t("rango_fechas")}
        </label>
      </div>

      {mode === "single" ? (
        <input
          type="date"
          value={singleDate}
          onChange={(e) => setSingleDate(e.target.value)}
        />
      ) : (
        <div className={styles.range}>
          <div>
            <label>{t("desde")}:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label>{t("hasta")}:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}