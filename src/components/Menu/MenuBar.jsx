/* src/components/Menu/MenuBar.jsx
 * Descripción: Componente de barra de menú.
 * Muestra enlaces de navegación y botón de cierre de sesión.
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./MenuBar.module.css";

export default function MenuBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.list}>
        <li>
          <NavLink to="/ingresar"    className={({isActive})=> isActive?styles.active:""}>{/* usar exact si hace falta */}
            Ingresar
          </NavLink>
        </li>
        <li>
          <NavLink to="/datos"       className={({isActive})=> isActive?styles.active:""}>
            Datos
          </NavLink>
        </li>
        <li>
          <NavLink to="/ingresos"    className={({isActive})=> isActive?styles.active:""}>
            Ingresos
          </NavLink>
        </li>
        <li>
          <NavLink to="/graficos"    className={({isActive})=> isActive?styles.active:""}>
            Gráficos
          </NavLink>
        </li>
        <li>
          <NavLink to="/configuracion" className={({isActive})=> isActive?styles.active:""}>
            Configuración
          </NavLink>
        </li>

        <li className={styles.logout}>
          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}