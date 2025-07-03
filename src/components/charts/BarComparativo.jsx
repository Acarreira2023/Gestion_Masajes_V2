// src/components/charts/BarComparativo.jsx
/*import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { useIdioma } from "../../context/IdiomaContext";

export default function BarComparativo({ data }) {
  const { t } = useIdioma();

  // Solo mostramos la serie “Anterior” si hay dos puntos de datos
  const showAnterior = data.length === 2;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={val => `$${val.toLocaleString()}`} />
        <Legend />

        {/* Serie “Actual” }
        <Bar
          dataKey="ingresos"
          name={t("Actual")}
          fill="#0088FE"
          barSize={30}
        />

        {/* Serie “Anterior” solo si corresponde }
        {showAnterior && (
          <Bar
            dataKey="ingresosAnterior"
            name={t("Anterior")}
            fill="#00C49F"
            barSize={30}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}*/

// src/components/charts/BarComparativo.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./Charts.module.css";

/**
 * Gráfico de barras comparativo de ingresos y egresos
 */
export default function BarComparativo({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} className={styles.chart}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={value => new Intl.NumberFormat().format(value)} />
        <Legend />
        <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos" />
        <Bar dataKey="egresos" fill="#8884d8" name="Egresos" />
      </BarChart>
    </ResponsiveContainer>
  );
}