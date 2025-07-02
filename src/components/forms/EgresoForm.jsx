// src/components/forms/EgresoForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIdioma } from "../../context/IdiomaContext";
import { useEgresosData } from "../../hooks/useEgresosData";
import { useListadosLocal } from "../../hooks/useListadosLocal";
import { formatDateTime } from "../../utils/date";
import "./EgresoForm.css";

export default function EgresoForm() {
  const { t } = useIdioma();
  const navigate = useNavigate();
  const { createEgreso } = useEgresosData();

  // Listados locales
  const [tipos]       = useListadosLocal("tiposEgreso");
  const [inmuebles]   = useListadosLocal("inmuebles");
  const [sucursales]  = useListadosLocal("sucursales");
  const [medios]      = useListadosLocal("mediosEgreso");
  const [categorias]  = useListadosLocal("categoriasEgreso");

  // Estado del formulario
  const [form, setForm] = useState({
    tipo:        tipos[0]          || "",
    inmueble:    inmuebles[0]      || "",
    sucursal:    sucursales[0]     || "",
    medio:       medios[0]         || "",
    categoria:   categorias[0]     || "",
    descripcion: "",
    cantidad:    "",
    total:       "",
    fecha:       formatDateTime(new Date()),
    numero_documentacion: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle generic field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Submit a new egreso
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        cantidad: Number(form.cantidad) || 0,
        total:    Number(form.total)    || 0,
        fecha:    new Date(form.fecha).toISOString(),
      };
      await createEgreso(payload);
      navigate("/egresos");
    } catch (err) {
      console.error("Error al crear egreso:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="egreso-form" onSubmit={handleSubmit}>
      <h2>{t("formulario_egreso")}</h2>

      <label>
        {t("tipo")}
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          {tipos.map((v) => (
            <option key={v} value={v}>{t(v.toLowerCase())}</option>
          ))}
        </select>
      </label>

      <label>
        {t("inmueble")}
        <select name="inmueble" value={form.inmueble} onChange={handleChange}>
          {inmuebles.map((v) => (
            <option key={v} value={v}>{t(v.toLowerCase())}</option>
          ))}
        </select>
      </label>

      <label>
        {t("sucursal")}
        <select name="sucursal" value={form.sucursal} onChange={handleChange}>
          {sucursales.map((v) => (
            <option key={v} value={v}>{t(v.toLowerCase())}</option>
          ))}
        </select>
      </label>

      <label>
        {t("medio")}
        <select name="medio" value={form.medio} onChange={handleChange}>
          {medios.map((v) => (
            <option key={v} value={v}>{t(v.toLowerCase())}</option>
          ))}
        </select>
      </label>

      <label>
        {t("categoria")}
        <select name="categoria" value={form.categoria} onChange={handleChange}>
          {categorias.map((v) => (
            <option key={v} value={v}>{t(v.toLowerCase())}</option>
          ))}
        </select>
      </label>

      <label>
        {t("descripcion")}
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </label>

      <label>
        {t("cantidad")}
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
        />
      </label>

      <label>
        {t("total")}
        <input
          type="number"
          name="total"
          value={form.total}
          onChange={handleChange}
        />
      </label>

      <label>
        {t("fecha")}
        <input
          type="datetime-local"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />
      </label>

      <label>
        {t("numero_documentacion")}
        <input
          type="text"
          name="numero_documentacion"
          value={form.numero_documentacion}
          onChange={handleChange}
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? t("aceptar") + "..." : t("aceptar")}
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          {t("cancelar")}
        </button>
      </div>
    </form>
  );
}
