// src/components/charts/BarComparativo.jsx
import React from "react";
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

        {/* Serie “Actual” */}
        <Bar
          dataKey="ingresos"
          name={t("Actual")}
          fill="#0088FE"
          barSize={30}
        />

        {/* Serie “Anterior” solo si corresponde */}
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
}