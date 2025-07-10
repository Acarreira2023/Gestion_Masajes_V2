// src/components/Menu/MenuBar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useIdioma } from "../../context/IdiomaContext";
import styles from "./MenuBar.module.css";

// bootstrap offcanvas JS+CSS must be loaded once in your index.html or here:
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function MenuBar() {
  const { logout } = useAuth();
  const { t }    = useIdioma();
  const nav     = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  // our list of links
  const links = [
    { to: "/graficos1", text: t("Resumen Finanzas") },
    { to: "/ingreso",   text: t("ingreso") },
    { to: "/egreso",    text: t("egreso") },
    { to: "/ingresar",  text: t("ingresar") },
    { to: "/configuracion", text: t("configuracion") }
  ];

  return (
    <>
      <nav className={styles.menu}>
        <div className="container-fluid d-flex align-items-center">
          {/* toggler for offcanvas */}
          <button
            className="btn btn-light me-2 d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
            aria-label={t("Abrir menú")}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* desktop list */}
          <ul className={`${styles.list} d-none d-md-flex`}>
            {links.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? styles.active : ""
                  }
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
            <li className={styles.logout}>
              <button onClick={handleLogout}>
                {t("cerrar_sesion")}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* offcanvas for mobile */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            {t("Menú")}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label={t("Cerrar")}
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className={styles.list}>
            {links.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? styles.active : ""
                  }
                  data-bs-dismiss="offcanvas"
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
            <li className={styles.logout}>
              <button onClick={handleLogout}>
                {t("cerrar_sesion")}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}