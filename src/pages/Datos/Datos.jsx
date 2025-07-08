// src/pages/Datos/Datos.jsx

import React, { useState, useEffect } from "react";
import { useIdioma } from "../../context/IdiomaContext";
import { db } from "../../services/firebaseService";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import styles from "./Datos.module.css";

export default function Datos() {
  const { t } = useIdioma();

  // filtros
  const [mode, setMode]           = useState("single");
  const [fecha, setFecha]         = useState("");
  const [desde, setDesde]         = useState("");
  const [hasta, setHasta]         = useState("");
  const [mes, setMes]             = useState("");
  const [anio, setAnio]           = useState("");
  const [filterParams, setFilterParams] = useState({});

  // tablas
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos]   = useState([]);
  const [selIn, setSelIn]       = useState(new Set());
  const [selEg, setSelEg]       = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // años para mensual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // recarga datos
  useEffect(() => {
    async function loadTables() {
      setLoading(true);
      setError(null);

      const endOf = date => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d;
      };

      function buildQuery(colName) {
        let q = collection(db, colName);
        const { mode, fecha, desde, hasta, mes, anio } = filterParams;

        if (mode === "single" && fecha) {
          const d0 = new Date(fecha);
          q = query(
            q,
            where("fecha", ">=", d0),
            where("fecha", "<", endOf(d0)),
            orderBy("fecha", "desc")
          );
        } else if (mode === "range" && desde && hasta) {
          const d0 = new Date(desde), d1 = endOf(hasta);
          q = query(
            q,
            where("fecha", ">=", d0),
            where("fecha", "<", d1),
            orderBy("fecha", "desc")
          );
        } else if (mode === "mensual" && mes && anio) {
          const mm = mes.padStart(2, "0");
          const start = new Date(`${anio}-${mm}-01`);
          const end   = endOf(new Date(anio, +mes, 0));
          q = query(
            q,
            where("fecha", ">=", start),
            where("fecha", "<", end),
            orderBy("fecha", "desc")
          );
        } else {
          q = query(q, orderBy("fecha", "desc"));
        }
        return q;
      }

      try {
        const [snapIn, snapEg] = await Promise.all([
          getDocs(buildQuery("ingresos")),
          getDocs(buildQuery("egresos"))
        ]);

        const formatDoc = d => {
          const data = d.data();
          const ts   = data.fecha;
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
            categoria: data.categoria ?? data["categoría"] ?? "",
            tipo:      data.tipo ?? "",
            proveedor: data.proveedor ?? data.provider ?? "",
            total:     data.total ?? data.valor ?? 0
          };
        };

        setIngresos(snapIn.docs.map(formatDoc));
        setEgresos(snapEg.docs.map(formatDoc));
        setSelIn(new Set());
        setSelEg(new Set());
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTables();
  }, [filterParams]);

  // aplicar/limpiar filtro
  const applyFilter = () =>
    setFilterParams({ mode, fecha, desde, hasta, mes, anio });

  const clearFilter = () => {
    setMode("single");
    setFecha(""); setDesde(""); setHasta("");
    setMes("");  setAnio("");
    setFilterParams({});
  };

  // selección y borrado
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

  const handleDeleteSelected = async (items, selSet, borrarFn, clearSel) => {
    for (let id of selSet) await borrarFn(id);
    clearSel(new Set());
  };

  const borrarIngreso = async id => {
    await deleteDoc(doc(db, "ingresos", id));
    setIngresos(prev => prev.filter(i => i.id !== id));
    setSelIn(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const borrarEgreso = async id => {
    await deleteDoc(doc(db, "egresos", id));
    setEgresos(prev => prev.filter(e => e.id !== id));
    setSelEg(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  if (loading)
    return <p className={styles.status}>{t("cargando_resumen")}…</p>;
  if (error)
    return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("datos")}</h2>

      {/* FILTRO */}
      <div className={styles.filterBox}>
        <div className={styles.filterGroup}>
          <label>{t("modo_de_filtro")}</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="single">{t("una_sola_fecha")}</option>
            <option value="range">{t("rango_de_fechas")}</option>
            <option value="mensual">{t("mensual")}</option>
          </select>
        </div>

        {mode === "single" && (
          <div className={styles.filterGroup}>
            <label>{t("una_sola_fecha")}</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
            />
          </div>
        )}

        {mode === "range" && (
          <div className={styles.fieldPair}>
            <div className={styles.filterGroup}>
              <label>{t("desde")}</label>
              <input
                type="date"
                value={desde}
                onChange={e => setDesde(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>{t("hasta")}</label>
              <input
                type="date"
                value={hasta}
                onChange={e => setHasta(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode === "mensual" && (
          <div className={styles.fieldPair}>
            <div className={styles.filterGroup}>
              <label>{t("mes")}</label>
              <select value={mes} onChange={e => setMes(e.target.value)}>
                <option value="">—</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={String(m).padStart(2,"0")}>
                    {String(m).padStart(2,"0")}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>{t("anio")}</label>
              <select value={anio} onChange={e => setAnio(e.target.value)}>
                <option value="">—</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button onClick={applyFilter} className={styles.filterButton}>
            {t("aplicar_filtro")}
          </button>
          <button onClick={clearFilter} className={styles.filterButton}>
            {t("borrar_filtro")}
          </button>
        </div>
      </div>

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
                  <th>{t("categoria")}</th>
                  <th>{t("tipo")}</th>
                  <th>{t("proveedor")}</th>
                  <th>{t("Total")}</th>
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
                    <td>{row.categoria}</td>
                    <td>{row.tipo}</td>
                    <td>{row.proveedor}</td>
                    <td>${row.total}</td>
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
                  <th>{t("categoria")}</th>
                  <th>{t("tipo")}</th>
                  <th>{t("proveedor")}</th>
                  <th>{t("Total")}</th>
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
                    <td>{row.categoria}</td>
                    <td>{row.tipo}</td>
                    <td>{row.proveedor}</td>
                    <td>${row.total}</td>
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