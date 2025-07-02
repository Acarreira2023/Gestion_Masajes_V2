// src/hooks/useDashboard.jsx

import { useMemo } from "react";
import { useReportData } from "./useReportData";
import { formatFechaCorta } from "../utils/dateUtils";

/**
 * useDashboard
 *
 * Recoge datos en tiempo real de ingresos/egresos “hoy”,
 * opcionalmente compara con “mismo día hace 1 año”,
 * y transforma los movimientos en series para gráficos:
 *  - ingresos:          [ { name: tipo, value: monto }, … ]
 *  - egresos:           [ { name: tipo, value: monto }, … ]
 *  - ingresosComparativa (si comparar=true)
 *  - egresosComparativa  (si comparar=true)
 *
 * @param {Object} options
 * @param {boolean} options.comparar — si debe traer datos del año anterior
 * @param {string}  options.idioma  — “es” | “en” | “pt” (para formatear ejes si hiciera falta)
 *
 * @returns {{
 *   ingresos: Array,
 *   egresos: Array,
 *   ingresosComparativa: Array,
 *   egresosComparativa: Array,
 *   loading: boolean,
 *   error: any
 * }}
 */
export function useDashboard({ comparar = false, idioma = "es" } = {}) {
  // Este hook se suscribe en real‐time a Firestore y filtra “hoy”
  // y carga datos del año anterior si comparar=true
  const {
    ingresosHoy,
    egresosHoy,
    ingresosHaceUnAno,
    egresosHaceUnAno,
    loading,
    error
  } = useReportData({ comparar });

  // Memoriza la transformación para no recalcular en cada render
  const {
    ingresos,
    egresos,
    ingresosComparativa,
    egresosComparativa
  } = useMemo(() => {
    if (loading || error) {
      return {
        ingresos: [],
        egresos: [],
        ingresosComparativa: [],
        egresosComparativa: []
      };
    }

    // Agrupa un array de movimientos por su propiedad `tipo`
    const agruparPorTipo = (arr) => {
      const map = {};
      arr.forEach((mov) => {
        map[mov.tipo] = (map[mov.tipo] || 0) + mov.monto;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    };

    const ingresos = agruparPorTipo(ingresosHoy);
    const egresos  = agruparPorTipo(egresosHoy);
    const ingresosComparativa = comparar
      ? agruparPorTipo(ingresosHaceUnAno)
      : [];
    const egresosComparativa = comparar
      ? agruparPorTipo(egresosHaceUnAno)
      : [];

    return { ingresos, egresos, ingresosComparativa, egresosComparativa };
  }, [
    ingresosHoy,
    egresosHoy,
    ingresosHaceUnAno,
    egresosHaceUnAno,
    loading,
    error,
    comparar,
    idioma
  ]);

  return {
    ingresos,
    egresos,
    ingresosComparativa,
    egresosComparativa,
    loading,
    error
  };
}