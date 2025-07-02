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
    fecha:"", tipo:"", inmueble:"", sucursal:"",
    medioPago:"", categoria:"", cantidad:1,
    numeroDoc:"", descripcion:"", proveedor:"",
    total:0
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let data = { ...f };
    if (data.tipo !== "INMUEBLE")   data.inmueble = "";
    if (data.tipo !== "SUCURSALES") data.sucursal  = "";

    const res = await guardarEgreso(data);
    if (res.success) {
      alert(t("egreso_guardado_correctamente"));
      setF({ fecha:"", tipo:"", inmueble:"", sucursal:"",
             medioPago:"", categoria:"", cantidad:1,
             numeroDoc:"", descripcion:"", proveedor:"",
             total:0 });
      onBack();
    } else {
      alert(t("error_guardar_egreso"));
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h2>{t("formulario_egreso")}</h2>
      {/* ...campos idénticos en estructura al ingreso */}
      <button type="submit" className={styles.botonArena}>
        {t("guardar_egreso")}
      </button>
    </form>
  );
}