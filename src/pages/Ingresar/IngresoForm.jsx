// src/pages/Ingresar/IngresoForm.jsx

import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import styles from "./IngresoForm.module.css";
import { guardarIngreso } from "../../services/firebaseService";
import {
  tiposIngreso,
  sucursales,
  inmuebles,
  mediosIngreso,
  categoriasIngreso
} from "../../utils/listados";
import { useIdioma } from "../../context/IdiomaContext";

export default function IngresoForm({ onBack }) {
  const { t } = useIdioma();
  const [f, setF] = useState({
    fecha: "",
    tipo: "",
    inmueble: "",
    sucursal: "",
    medio: "",
    categoria: "",
    cantidad: 1,
    numeroDoc: "",
    descripcion: "",
    cliente: "",
    total: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setF((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...f };

    if (data.tipo !== "INMUEBLE") data.inmueble = "";
    if (data.tipo !== "SUCURSALES") data.sucursal = "";

    // Parsear fecha a medianoche local (UTC−3)
    const [year, month, day] = data.fecha.split("-").map(Number);
    const dtLocal = new Date(year, month - 1, day);
    data.fecha = Timestamp.fromDate(dtLocal);

    const res = await guardarIngreso(data);
    if (res.success) {
      alert(t("ingreso_guardado_correctamente"));
      onBack();
    } else {
      alert(t("error_guardar_ingreso"));
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h2>{t("formulario_ingreso")}</h2>

      {/* Fecha */}
      <div className={styles.field}>
        <label htmlFor="fecha">{t("fecha")}</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={f.fecha}
          onChange={handleChange}
          required
        />
      </div>

      {/* Resto de campos... */}
      {/* Tipo */}
      <div className={styles.field}>
        <label htmlFor="tipo">{t("tipo")}</label>
        <select
          id="tipo"
          name="tipo"
          value={f.tipo}
          onChange={handleChange}
          required
        >
          <option value="">{t("seleccionar_tipo")}</option>
          {tiposIngreso.map((opt) => (
            <option key={opt} value={opt}>
              {t(opt)}
            </option>
          ))}
        </select>
      </div>

      {f.tipo === "INMUEBLE" && (
        <div className={styles.field}>
          <label htmlFor="inmueble">{t("inmueble")}</label>
          <select
            id="inmueble"
            name="inmueble"
            value={f.inmueble}
            onChange={handleChange}
          >
            <option value="">{t("seleccionar_inmueble")}</option>
            {inmuebles.map((opt) => (
              <option key={opt} value={opt}>
                {t(opt)}
              </option>
            ))}
          </select>
        </div>
      )}
      {f.tipo === "SUCURSALES" && (
        <div className={styles.field}>
          <label htmlFor="sucursal">{t("sucursal")}</label>
          <select
            id="sucursal"
            name="sucursal"
            value={f.sucursal}
            onChange={handleChange}
          >
            <option value="">{t("seleccionar_sucursal")}</option>
            {sucursales.map((opt) => (
              <option key={opt} value={opt}>
                {t(opt)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Medio de pago */}
      <div className={styles.field}>
        <label htmlFor="medio">{t("medio_pago")}</label>
        <select
          id="medio"
          name="medio"
          value={f.medio}
          onChange={handleChange}
        >
          <option value="">{t("seleccionar_medio")}</option>
          {mediosIngreso.map((opt) => (
            <option key={opt} value={opt}>
              {t(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* Categoría */}
      <div className={styles.field}>
        <label htmlFor="categoria">{t("categoria")}</label>
        <select
          id="categoria"
          name="categoria"
          value={f.categoria}
          onChange={handleChange}
        >
          <option value="">{t("seleccionar_categoria")}</option>
          {categoriasIngreso.map((opt) => (
            <option key={opt} value={opt}>
              {t(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* Cantidad */}
      <div className={styles.field}>
        <label htmlFor="cantidad">{t("cantidad")}</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          min="1"
          value={f.cantidad}
          onChange={handleChange}
          required
        />
      </div>

      {/* Cliente */}
      <div className={styles.field}>
        <label htmlFor="cliente">{t("cliente")}</label>
        <input
          type="text"
          id="cliente"
          name="cliente"
          value={f.cliente}
          onChange={handleChange}
        />
      </div>

      {/* Número de documento */}
      <div className={styles.field}>
        <label htmlFor="numeroDoc">{t("numero_documento")}</label>
        <input
          type="text"
          id="numeroDoc"
          name="numeroDoc"
          value={f.numeroDoc}
          onChange={handleChange}
        />
      </div>

      {/* Descripción */}
      <div className={styles.field}>
        <label htmlFor="descripcion">{t("descripcion")}</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={f.descripcion}
          onChange={handleChange}
        />
      </div>

      {/* Total */}
      <div className={styles.field}>
        <label htmlFor="total">{t("total")}</label>
        <input
          type="number"
          id="total"
          name="total"
          step="0.01"
          min="0"
          value={f.total}
          onChange={handleChange}
          required
        />
      </div>

      {/* Botones */}
      <div className={styles.buttons}>
        <button type="submit" className={styles.botonArena}>
          {t("guardar_ingreso")}
        </button>
        <button type="button" className={styles.volver} onClick={onBack}>
          {t("volver")}
        </button>
      </div>
    </form>
  );
}