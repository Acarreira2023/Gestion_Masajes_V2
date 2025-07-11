// src/pages/Ingresar/EgresoForm.jsx
import React, { useState } from "react";
import styles from "./EgresoForm.module.css";
import { guardarEgreso } from "../../services/firebaseService";
import {
  tiposEgreso,
  sucursales,
  inmuebles,
  mediosEgreso,
  categoriasEgreso
} from "../../utils/listados";
import { useIdioma } from "../../context/IdiomaContext";

export default function EgresoForm({ onBack }) {
  const { t } = useIdioma();
  const [f, setF] = useState({
    fecha: "",
    tipo: "",
    inmueble: "",
    sucursal: "",
    medioPago: "",
    categoria: "",
    cantidad: 1,
    numeroDoc: "",
    descripcion: "",
    proveedor: "",
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

    const res = await guardarEgreso(data);
    if (res.success) {
      // aquí podrías usar toast.success en lugar de alert
      alert(t("egreso_guardado_correctamente"));
      onBack();
    } else {
      alert(t("error_guardar_egreso"));
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h2>{t("formulario_egreso")}</h2>

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
          {tiposEgreso.map((opt) => (
            <option key={opt} value={opt}>
              {t(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* Inmueble / Sucursal */}
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
        <label htmlFor="medioPago">{t("medio_pago")}</label>
        <select
          id="medioPago"
          name="medioPago"
          value={f.medioPago}
          onChange={handleChange}
        >
          <option value="">{t("seleccionar_medio")}</option>
          {mediosEgreso.map((opt) => (
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
          {categoriasEgreso.map((opt) => (
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

      {/* Proveedor */}
      <div className={styles.field}>
        <label htmlFor="proveedor">{t("proveedor")}</label>
        <input
          type="text"
          id="proveedor"
          name="proveedor"
          value={f.proveedor}
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

      {/* Botones: primero Guardar, luego Volver */}
      <div className={styles.buttons}>
        <button type="submit" className={styles.botonArena}>
          {t("guardar_egreso")}
        </button>
        <button type="button" onClick={onBack} className={styles.volver}>
          {t("volver")}
        </button>
      </div>
    </form>
  );
}