// src/pages/CerrarSesion/CerrarSesion.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CerrarSesion.module.css";
import MenuBar from "../../components/Menu/MenuBar";
import { logout } from "../../services/firebaseAuth";
import { toast } from "react-hot-toast";
import { useIdioma } from "../../context/IdiomaContext";

export default function CerrarSesion() {
  const navigate = useNavigate();
  const { t } = useIdioma();

  useEffect(() => {
    toast
      .promise(
        logout(),
        {
          loading: t("cerrando_sesion"),
          success: t("sesion_cerrada"),
          error: t("error_cerrar_sesion"),
        }
      )
      .then(() => navigate("/login"))
      .catch(() => navigate("/"));
  }, [navigate, t]);

  return (
    <div className={styles.container}>
      <MenuBar />
      <div className={styles.content}>
        <p>{t("cerrando_sesion")}</p>
      </div>
    </div>
  );
}