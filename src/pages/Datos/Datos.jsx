// src/pages/Datos/Datos.jsx
import React, { useState, useEffect } from "react";
import { useIdioma } from "../../context/IdiomaContext";
import { db } from "../../services/firebaseService";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import styles from "./Datos.module.css";

export default function Datos() {
  const { t } = useIdioma();
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos]   = useState([]);
  const [selIn, setSelIn]       = useState(new Set());
  const [selEg, setSelEg]       = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Carga ingresos y egresos en paralelo
        const [snapIn, snapEg] = await Promise.all([
          getDocs(query(collection(db, "ingresos"), orderBy("fecha", "desc"))),
          getDocs(query(collection(db, "egresos"),  orderBy("fecha", "desc")))
        ]);

        // Función para formatear cada documento
        const formatea = (d) => {
          const data = d.data();
          // Convertir distintos formatos de fecha a JS Date
          const ts = data.fecha;
          const date = ts?.toDate
            ? ts.toDate()
            : ts instanceof Date
            ? ts
            : ts?.seconds
            ? new Date(ts.seconds * 1000)
            : new Date(ts);
          return {
            id:        d.id,
            fecha:     date.toLocaleDateString(),
            total:     data.total ?? data.valor ?? 0,
            categoria: data.categoria ?? data["categoría"] ?? "",
            tipo:      data.tipo ?? ""
          };
        };

        setIngresos(snapIn.docs.map(formatea));
        setEgresos(snapEg.docs.map(formatea));
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Borrado individual
  const borrarIngreso = async (id) => {
    await deleteDoc(doc(db, "ingresos", id));
    setIngresos(prev => prev.filter(i => i.id !== id));
    setSelIn(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };
  const borrarEgreso = async (id) => {
    await deleteDoc(doc(db, "egresos", id));
    setEgresos(prev => prev.filter(e => e.id !== id));
    setSelEg(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  // Selección múltiple
  const toggleSelect = (setFn, set, id) => {
    const s = new Set(set);
    s.has(id) ? s.delete(id) : s.add(id);
    setFn(s);
  };
  const handleSelectAll = (items, setFn) => {
    if (!items.length) return;
    setFn(prev =>
      prev.size === items.length
        ? new Set()
        : new Set(items.map(i => i.id))
    );
  };
  const handleDeleteSelected = async (items, selSet, borrarFn, setSel) => {
    for (let id of selSet) {
      await borrarFn(id);
    }
    setSel(new Set());
  };

  if (loading) return <p className={styles.status}>{t("cargando_resumen")}…</p>;
  if (error)   return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>{t("datos")}</h2>

      {/* INGRESOS */}
      <section className={styles.tableSection}>
        <h3>{t("ingresos")}</h3>
        {ingresos.length === 0 ? (
          <p>No se encontraron ingresos.</p>
        ) : (
          <>
            <div className={styles.actions}>
              <button onClick={() => handleSelectAll(ingresos, setSelIn)}>
                {t("seleccionar_todos")}
              </button>
              <button
                disabled={!selIn.size}
                onClick={() =>
                  handleDeleteSelected(ingresos, selIn, borrarIngreso, setSelIn)
                }
              >
                {t("borrar_seleccionados")}
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selIn.size === ingresos.length}
                      onChange={() => handleSelectAll(ingresos, setSelIn)}
                    />
                  </th>
                  <th>{t("fecha")}</th>
                  <th>Total</th>
                  <th>Categoría</th>
                  <th>{t("tipo")}</th>
                  <th>{t("acciones")}</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map(row => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selIn.has(row.id)}
                        onChange={() => toggleSelect(setSelIn, selIn, row.id)}
                      />
                    </td>
                    <td>{row.fecha}</td>
                    <td>${row.total}</td>
                    <td>{row.categoria}</td>
                    <td>{row.tipo}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => borrarIngreso(row.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* EGRESOS */}
      <section className={styles.tableSection}>
        <h3>{t("egresos")}</h3>
        {egresos.length === 0 ? (
          <p>No se encontraron egresos.</p>
        ) : (
          <>
            <div className={styles.actions}>
              <button onClick={() => handleSelectAll(egresos, setSelEg)}>
                {t("seleccionar_todos")}
              </button>
              <button
                disabled={!selEg.size}
                onClick={() =>
                  handleDeleteSelected(egresos, selEg, borrarEgreso, setSelEg)
                }
              >
                {t("borrar_seleccionados")}
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selEg.size === egresos.length}
                      onChange={() => handleSelectAll(egresos, setSelEg)}
                    />
                  </th>
                  <th>{t("fecha")}</th>
                  <th>Total</th>
                  <th>Categoría</th>
                  <th>{t("tipo")}</th>
                  <th>{t("acciones")}</th>
                </tr>
              </thead>
              <tbody>
                {egresos.map(row => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selEg.has(row.id)}
                        onChange={() => toggleSelect(setSelEg, selEg, row.id)}
                      />
                    </td>
                    <td>{row.fecha}</td>
                    <td>${row.total}</td>
                    <td>{row.categoria}</td>
                    <td>{row.tipo}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => borrarEgreso(row.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
}