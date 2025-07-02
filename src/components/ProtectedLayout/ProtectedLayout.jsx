// src/components/ProtectedLayout/ProtectedLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "../Menu/MenuBar";
import styles from "./ProtectedLayout.module.css";

export default function ProtectedLayout() {
  return (
    <div className={styles.layout}>
      {/* Sólo aquí renderizamos el menú */}
      <MenuBar />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}