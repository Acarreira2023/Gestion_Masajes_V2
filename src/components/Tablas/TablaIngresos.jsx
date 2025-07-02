// src/components/Tablas/TablaIngresos.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useIdioma } from "../../context/IdiomaContext";
import { useIngresosData } from "../../hooks/useIngresosData";
import { formatDateTime } from "../../utils/date";
import styles from "./Tabla.module.css";

export default function TablaIngresos() {
  const { t } = useIdioma();
  const navigate = useNavigate();
  const { ingresos, loading, removeIngreso } = useIngresosData();

  if (loading) {
    return <p>{t("cargando_ingresos")}…</p>;
  }
  if (ingresos.length === 0) {
    return <p>{t("sin_ingresos")}</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{t("fecha")}</th>
          <th>{t("tipo")}</th>
          <th>{t("inmueble")}</th>
          <th>{t("sucursal")}</th>
          <th>{t("medio")}</th>
          <th>{t("categoria")}</th>
          <th>{t("descripcion")}</th>
          <th>{t("cantidad")}</th>
          <th>{t("total")}</th>
          <th>{t("numero_documentacion")}</th>
          <th>{t("acciones")}</th>
        </tr>
      </thead>
      <tbody>
        {ingresos.map((item) => (
          <tr key={item.id}>
            <td>{formatDateTime(new Date(item.fecha))}</td>
            <td>{t(item.tipo.toLowerCase())}</td>
            <td>{t(item.inmueble.toLowerCase())}</td>
            <td>{t(item.sucursal.toLowerCase())}</td>
            <td>{t(item.medio.toLowerCase())}</td>
            <td>{t(item.categoria.toLowerCase())}</td>
            <td>{item.descripcion}</td>
            <td>{item.cantidad}</td>
            <td>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(item.total)}
            </td>
            <td>{item.numero_documentacion}</td>
            <td className={styles.actions}>
              <button
                className={styles.edit}
                onClick={() => navigate(`/ingresos/edit/${item.id}`)}
              >
                {t("editar")}
              </button>
              <button
                className={styles.delete}
                onClick={() => removeIngreso(item.id)}
              >
                {t("eliminar")}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
// Este componente muestra una tabla de ingresos con opciones para editar y eliminar cada ingreso.
// Utiliza un hook personalizado para obtener los datos de ingresos y maneja la navegación y acciones de edición y eliminación.
// También utiliza un contexto para la traducción de textos según el idioma seleccionado.