// src/components/ResumenEconomico/ResumenEconomico.jsx
import React, { useMemo } from "react";
import { useReportData }    from "../../hooks/useReportData";
import { useIdioma }        from "../../context/IdiomaContext";
import styles               from "./ResumenEconomico.module.css";

export default function ResumenEconomico() {
  const { t } = useIdioma();
  const {
    totalIngresosHoy = 0,
    totalEgresosHoy  = 0,
    balanceHoy       = 0,
    loading,
    error
  } = useReportData({ comparar: false });

  const safe = (n) => (Number.isFinite(n) ? n : 0);

  const { utilidad, indice, margen } = useMemo(() => {
    const util = safe(balanceHoy);
    const ind  = totalEgresosHoy > 0
      ? util / totalEgresosHoy
      : 0;  // no Infinity
    const mar  = totalIngresosHoy > 0
      ? (util / totalIngresosHoy) * 100
      : 0;

    return {
      utilidad: util,
      indice: safe(ind),
      margen: safe(mar)
    };
  }, [totalIngresosHoy, totalEgresosHoy, balanceHoy]);

  if (loading) return <p>{t("cargando_resumen")}…</p>;
  if (error)   return <p>{t("error")}</p>;

  const formatCurrency = (v) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0
    }).format(v);

  const formatPercent = (v) =>
    new Intl.NumberFormat("es-AR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(v / 100);

  const Arrow = ({ positive }) => (
    <span className={positive ? styles.up : styles.down}>
      {positive ? "▲" : "▼"}
    </span>
  );

  return (
    <div className={styles.container}>
      {/* Total Ingresos */}
      <div className={styles.card}>
        <h3>{t("total_ingresos")}</h3>
        <p className={`${styles.value} ${styles.positive}`}>
          <Arrow positive /> {formatCurrency(totalIngresosHoy)}
        </p>
      </div>

      {/* Total Egresos */}
      <div className={styles.card}>
        <h3>{t("total_egresos")}</h3>
        <p className={`${styles.value} ${styles.negative}`}>
          <Arrow positive={false} /> {formatCurrency(totalEgresosHoy)}
        </p>
      </div>

      {/* Utilidad */}
      <div className={styles.card}>
        <h3>{t("utilidad")}</h3>
        <p className={`${styles.value} ${utilidad >= 0 ? styles.positive : styles.negative}`}>
          <Arrow positive={utilidad >= 0} /> {formatCurrency(utilidad)}
        </p>
      </div>

      {/* Índice (Ingresos / Egresos) */}
      <div className={styles.card}>
        <h3>{t("indice")}</h3>
        <p className={`${styles.value} ${indice >= 1 ? styles.positive : styles.negative}`}>
          <Arrow positive={indice >= 1} /> {indice.toFixed(2)}
        </p>
      </div>

      {/* Margen de utilidad */}
      <div className={styles.card}>
        <h3>{t("margen_utilidad")}</h3>
        <p className={`${styles.value} ${margen >= 0 ? styles.positive : styles.negative}`}>
          <Arrow positive={margen >= 0} /> {formatPercent(margen)}
        </p>
      </div>
    </div>
  );
}