import React, { useState } from "react";
import styles from "./IngresoForm.module.css";
import { guardarIngreso } from "../../services//firebaseService";
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
    fecha: "", tipo: "", inmueble: "", sucursal: "",
    medio: "", categoria: "", cantidad: 1,
    numeroDoc: "", descripcion: "", total: 0
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

    const res = await guardarIngreso(data);
    if (res.success) {
      alert(t("ingreso_guardado_correctamente"));
      setF({ fecha:"", tipo:"", inmueble:"", sucursal:"",
             medio:"", categoria:"", cantidad:1,
             numeroDoc:"", descripcion:"", total:0 });
      onBack();
    } else {
      alert(t("error_guardar_ingreso"));
    }
  };

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <h2>{t("formulario_ingreso")}</h2>
      {/* ...mismos campos que antes, con label+input/select */}
      <button type="submit" className={styles.botonArena}>
        {t("guardar_ingreso")}
      </button>
    </form>
  );
}