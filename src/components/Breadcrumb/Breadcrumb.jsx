// src/components/Breadcrumb/Breadcrumb.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

/**
 * Componente de migas de pan que muestra la ruta actual
 */
export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segmentos = pathname
    .split("/")
    .filter(Boolean)
    .map(seg => decodeURIComponent(seg));

  return (
    <nav aria-label="migas de pan" className={styles.breadcrumb}>
      {segmentos.map((seg, idx) => {
        const path = "/" + segmentos.slice(0, idx + 1).join("/");
        const etiqueta = seg.charAt(0).toUpperCase() + seg.slice(1);
        return (
          <span key={path}>
            <Link to={path} className={styles.link}>
              {etiqueta}
            </Link>
            {idx < segmentos.length - 1 && (
              <span className={styles.separator}>/</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}