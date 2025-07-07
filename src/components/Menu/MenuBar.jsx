/* src/components/Menu/MenuBar.jsx
 * Descripción: Componente de barra de menú.
 * Muestra enlaces de navegación y botón de cierre de sesión.
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useIdioma } from "../../context/IdiomaContext";
import styles from "./MenuBar.module.css";

export default function MenuBar() {
  const { logout } = useAuth();
  const { t } = useIdioma();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.list}>
        <li>
          <NavLink to="/graficos1"    className={({isActive})=> isActive?styles.active:""}>
            {t("Resumen Finanzas")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/datos"       className={({isActive})=> isActive?styles.active:""}>
            {t("datos")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/ingresar"    className={({isActive})=> isActive?styles.active:""}>{/* usar exact si hace falta */}
            {t("ingresar")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/configuracion" className={({isActive})=> isActive?styles.active:""}>
            {t("configuracion")}
          </NavLink>
        </li>

        <li className={styles.logout}>
          <button onClick={handleLogout}>
            {t("cerrar_sesion")}
          </button>
        </li>
      </ul>
    </nav>
  );
}