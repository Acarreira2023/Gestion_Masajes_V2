// src/pages/Graficos/Graficos.jsx
import React, { useState } from "react";
import { useIdioma } from "../../context/IdiomaContext";
import DateFilter from "../../components/DateFilter/DateFilter";
import { useReportData } from "../../hooks/useReportData";
import BarComparativo from "../../components/charts/BarComparativo";
import PieChartComponent from "../../components/charts/PieChart";
import styles from "./Graficos.module.css";

export default function Graficos() {
  const { t } = useIdioma();
  const [filter, setFilter] = useState({
    mode: "single",                              // "single" | "range"
    date: new Date().toISOString().slice(0, 10), // fecha única
    from: "",                                    // fecha desde (rango)
    to: ""                                       // fecha hasta (rango)
  });

  // Determino la fecha que pasará al hook
  const fecha =
    filter.mode === "single"
      ? filter.date
      : filter.mode === "range"
        ? filter.from
        : undefined;

  const {
    byDate,
    ingresosByTipo,
    egresosByTipo,
    ingresosByCategoria,
    egresosByCategoria,
    loading
  } = useReportData({ fecha });

  const handleDateChange = (df) => {
    setFilter((prev) => ({ ...prev, ...df }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("graficos")}</h2>

      {/* Selector de fecha única o rango */}
      <DateFilter onChange={handleDateChange} />

      {loading ? (
        <p className={styles.loading}>{t("cargando")}…</p>
      ) : (
        <>
          <div className={styles.chartSection}>
            <BarComparativo data={byDate} />
          </div>

          <div className={styles.pieSection}>
            <PieChartComponent
              title={t("ingresos_por_tipo")}
              data={ingresosByTipo}
            />
            <PieChartComponent
              title={t("egresos_por_tipo")}
              data={egresosByTipo}
            />
            <PieChartComponent
              title={t("ingresos_por_categoria")}
              data={ingresosByCategoria}
            />
            <PieChartComponent
              title={t("egresos_por_categoria")}
              data={egresosByCategoria}
            />
          </div>
        </>
      )}
    </div>
  );
}