// src/hooks/useReportData.jsx
import { useMemo } from "react";
import { useIngresosRealtime } from "./useIngresosRealtime";
import { useEgresosRealtime }  from "./useEgresosRealtime";

export function useReportData({ fecha }) {
  const { ingresos, loading: loadingI } = useIngresosRealtime();
  const { egresos,  loading: loadingE } = useEgresosRealtime();
  const loading = loadingI || loadingE;

  return useMemo(() => {
    if (!fecha) {
      return {
        byDate: [],
        ingresosByTipo: [],
        egresosByTipo: [],
        ingresosByCategoria: [],
        egresosByCategoria: [],
        loading
      };
    }

    // Convierte cualquier formato de fecha a JS Date
    const parseDate = (f) => {
      if (f?.toDate) return f.toDate();
      if (f instanceof Date) return f;
      if (f?.seconds) return new Date(f.seconds * 1000);
      if (typeof f === "string") {
        const d = new Date(f);
        return isNaN(d) ? null : d;
      }
      return null;
    };

    // Compara si dos fechas son el mismo día
    const sameDay = (a, b) =>
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth()    === b.getMonth() &&
      a.getDate()     === b.getDate();

    // Obtiene el valor numérico de total o valor
    const getValue = (item) => Number(item.total ?? item.valor ?? 0);

    const actualDate = parseDate(fecha);

    // byDate con un solo set “Actual”
    const ingresosSum = ingresos
      .filter(i => sameDay(parseDate(i.fecha), actualDate))
      .reduce((acc, i) => acc + getValue(i), 0);

    const egresosSum = egresos
      .filter(e => sameDay(parseDate(e.fecha), actualDate))
      .reduce((acc, e) => acc + getValue(e), 0);

    const byDate = [
      { name: "Actual", ingresos: ingresosSum, egresos: egresosSum }
    ].map(d => ({ ...d, utilidad: d.ingresos - d.egresos }));

    // Datos del día actual para los pies de gráfico
    const todayI = ingresos.filter(i => sameDay(parseDate(i.fecha), actualDate));
    const todayE = egresos.filter(e => sameDay(parseDate(e.fecha), actualDate));

    const groupBy = (arr, key) =>
      Object.entries(
        arr.reduce((acc, item) => {
          const k = item[key] || "Sin definir";
          acc[k] = (acc[k] || 0) + getValue(item);
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }));

    return {
      byDate,
      ingresosByTipo:      groupBy(todayI, "tipo"),
      egresosByTipo:       groupBy(todayE, "tipo"),
      ingresosByCategoria: groupBy(todayI, "categoria"),
      egresosByCategoria:  groupBy(todayE, "categoria"),
      loading
    };
  }, [ingresos, egresos, fecha, loading]);
}