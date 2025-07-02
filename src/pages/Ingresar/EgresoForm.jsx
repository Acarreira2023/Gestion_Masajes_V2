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
      alert(t("egreso_guardado_correctamente"));
      setF({
        fecha: "",
        tipo: "",
        inmueble: "",
        sucursal: "",
        medioPago: "",
        categoria: "",
        cantidad: 1,
        numeroDoc: "",
        descripcion: "",
        total: 0
      });
      onBack();
    } else {
      alert(t("error_guardar_egreso"));
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h2>{t("formulario_egreso")}</h2>

      {/* Aquí repites la misma estructura de campos que en IngresoForm,
          usando tiposEgreso, mediosEgreso, categoriasEgreso, etc. */}
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
      {/* …y así con tipo, inmueble/sucursal condicionado, medioPago,
          categoria, cantidad, numeroDoc, descripcion y total */}
      
      <div className={styles.buttons}>
        <button type="button" onClick={onBack}>
          {t("volver")}
        </button>
        <button type="submit" className={styles.botonArena}>
          {t("guardar_egreso")}
        </button>
      </div>
    </form>
  );
}