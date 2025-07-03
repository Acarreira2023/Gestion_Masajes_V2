// src/components/charts/PieChart.jsx
/*import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PieChartComponent({ title, data }) {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}*/

// src/components/charts/PieChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./Charts.module.css";

/**
 * Componente de gráfico de torta para datos categorizados
 */
export default function PieChartComponent({ title, data }) {
  const COLORES = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28EFF",
    "#FF6E6E"
  ];

  return (
    <div className={styles.pieChart} role="region" aria-label={title}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            label
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORES[idx % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip formatter={value => new Intl.NumberFormat().format(value)} />
          <Legend layout="vertical" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}