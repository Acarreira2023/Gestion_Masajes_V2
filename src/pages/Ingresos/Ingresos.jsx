// src/pages/Ingresos.jsx
import React from "react";
import { useIdioma } from "../../context/IdiomaContext";
import ResumenEconomico from "../../components/ResumenEconomico/ResumenEconomico";
import UtilidadComparativo from "../../components/charts/UtilidadComparativo";
import PieChartComponent from "../../components/charts/PieChart";
import { useReportData } from "../../hooks/useReportData";
import styles from "./Ingresos.module.css";

export default function Ingresos() {
  const { t } = useIdioma();

  // Obtenemos todos los datos necesarios
  const {
    byDate,
    ingresosByTipo,
    egresosByTipo,
    ingresosByCategoria,
    egresosByCategoria,
    loading
  } = useReportData({
    fecha: new Date().toISOString().slice(0, 10)
  });

  // Preparamos el resumen “Actual”
  const resumen = byDate[0] || { ingresos: 0, egresos: 0, utilidad: 0 };

  // Derivamos utilidades por tipo
  const utilidadByTipo = React.useMemo(() => {
    const map = {};
    ingresosByTipo.forEach(({ name, value }) => {
      map[name] = (map[name] || 0) + value;
    });
    egresosByTipo.forEach(({ name, value }) => {
      map[name] = (map[name] || 0) - value;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [ingresosByTipo, egresosByTipo]);

  // Derivamos utilidades por categoría
  const utilidadByCategoria = React.useMemo(() => {
    const map = {};
    ingresosByCategoria.forEach(({ name, value }) => {
      map[name] = (map[name] || 0) + value;
    });
    egresosByCategoria.forEach(({ name, value }) => {
      map[name] = (map[name] || 0) - value;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [ingresosByCategoria, egresosByCategoria]);

  return (
    <div className={styles.container}>
      <h2>{t("dashboard_financiero")}</h2>

      {loading ? (
        <p>{t("cargando_resumen")}…</p>
      ) : (
        <>
          <ResumenEconomico
            ingresos={resumen.ingresos}
            egresos={resumen.egresos}
            balance={resumen.utilidad}
          />

          {/* Barras: Utilidad actual */}
          <UtilidadComparativo data={byDate} />

          {/* Tortas: Utilidad por tipo y por categoría */}
          <div className={styles.pieContainer}>
            <PieChartComponent
              title={t("utilidad_por_tipo")}
              data={utilidadByTipo}
            />
            <PieChartComponent
              title={t("utilidad_por_categoria")}
              data={utilidadByCategoria}
            />
          </div>
        </>
      )}
    </div>
  );
}