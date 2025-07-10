// src/pages/Datos/Egreso/Egreso.jsx

import React, { useState, useEffect } from "react";
import { useIdioma } from "../../../context/IdiomaContext";
import { db } from "../../../services/firebaseService";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp
} from "firebase/firestore";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import styles from "../Egreso/Egreso.module.css"; // reutiliza estilos de filtro/tabla

export default function Egreso() {
  const { t } = useIdioma();

  // estados de filtro
  const [mode, setMode]               = useState("single");
  const [fecha, setFecha]             = useState("");
  const [desde, setDesde]             = useState("");
  const [hasta, setHasta]             = useState("");
  const [mes, setMes]                 = useState("");
  const [anio, setAnio]               = useState("");
  const [filterParams, setFilterParams] = useState({});

  // datos y selección
  const [egresos, setEgresos] = useState([]);
  const [selEg, setSelEg]     = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // edición inline
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({
    categoria: "",
    tipo: "",
    proveedor: "",
    total: ""
  });

  // años para filtro mensual
  const currentYear = new Date().getFullYear();
  const years       = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // recarga datos al cambiar filtros
  useEffect(() => {
    async function loadEgresos() {
      setLoading(true);
      setError(null);

      // helper: convierte string "YYYY-MM-DD" a Timestamp.fromDate
      const makeRange = (startDateStr, endDateStr) => {
        const s = new Date(startDateStr);
        s.setHours(0, 0, 0, 0);
        const e = new Date(endDateStr);
        e.setHours(23, 59, 59, 999);
        return [Timestamp.fromDate(s), Timestamp.fromDate(e)];
      };

      // construye la query según modo
      function buildQuery() {
        const col = collection(db, "egresos");
        let q   = col;
        const p = filterParams;

        if (p.mode === "single" && p.fecha) {
          const [startTs, endTs] = makeRange(p.fecha, p.fecha);
          q = query(
            col,
            where("fecha", ">=", startTs),
            where("fecha", "<=", endTs),
            orderBy("fecha", "desc")
          );

        } else if (p.mode === "range" && p.desde && p.hasta) {
          const [startTs, endTs] = makeRange(p.desde, p.hasta);
          q = query(
            col,
            where("fecha", ">=", startTs),
            where("fecha", "<=", endTs),
            orderBy("fecha", "desc")
          );

        } else if (p.mode === "mensual" && p.mes && p.anio) {
          // primer y último día del mes
          const mm    = p.mes.padStart(2, "0");
          const first = `${p.anio}-${mm}-01`;
          const last  = new Date(p.anio, +p.mes, 0)
            .toISOString()
            .slice(0, 10);
          const [startTs, endTs] = makeRange(first, last);
          q = query(
            col,
            where("fecha", ">=", startTs),
            where("fecha", "<=", endTs),
            orderBy("fecha", "desc")
          );

        } else {
          // sin filtros
          q = query(col, orderBy("fecha", "desc"));
        }

        return q;
      }

      try {
        const snap = await getDocs(buildQuery());
        const list = snap.docs.map(d => {
          const data = d.data();
          const ts   = data.fecha;
          const dt   = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
          return {
            id:        d.id,
            fecha:     dt.toLocaleDateString(),
            categoria: data.categoria  || "",
            tipo:      data.tipo       || "",
            proveedor: data.proveedor  || "",
            total:     data.total      || 0
          };
        });
        setEgresos(list);
        setSelEg(new Set());
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEgresos();
  }, [filterParams]);

  // aplicar / limpiar filtro
  const applyFilter = () =>
    setFilterParams({ mode, fecha, desde, hasta, mes, anio });
  const clearFilter = () => {
    setMode("single");
    setFecha(""); setDesde(""); setHasta("");
    setMes("");   setAnio("");
    setFilterParams({});
  };

  // selección y borrado
  const toggleSelect = id => {
    setSelEg(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const handleSelectAll = () =>
    setSelEg(prev =>
      prev.size === egresos.length
        ? new Set()
        : new Set(egresos.map(e => e.id))
    );
  const handleDeleteSelected = async () => {
    for (let id of selEg) await deleteDoc(doc(db, "egresos", id));
    setEgresos(prev => prev.filter(e => !selEg.has(e.id)));
    setSelEg(new Set());
  };
  const deleteOne = async id => {
    await deleteDoc(doc(db, "egresos", id));
    setEgresos(prev => prev.filter(e => e.id !== id));
    setSelEg(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  // edición inline
  const startEdit = row => {
    setEditingId(row.id);
    setEditData({
      categoria: row.categoria,
      tipo:      row.tipo,
      proveedor: row.proveedor,
      total:     row.total.toString()
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ categoria: "", tipo: "", proveedor: "", total: "" });
  };
  const saveEdit = async id => {
    const ref = doc(db, "egresos", id);
    await updateDoc(ref, {
      categoria: editData.categoria,
      tipo:      editData.tipo,
      proveedor: editData.proveedor,
      total:     Number(editData.total)
    });
    // refresca en UI
    setEgresos(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              categoria: editData.categoria,
              tipo:      editData.tipo,
              proveedor: editData.proveedor,
              total:     Number(editData.total)
            }
          : e
      )
    );
    cancelEdit();
  };

  if (loading) return <p className={styles.status}>{t("cargando_resumen")}…</p>;
  if (error)   return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("egresos")}</h2>

      {/* FILTRO horizontal */}
      <div className={styles.filterBox}>
        <label className={styles.filterLabel}>{t("modo_de_filtro")}:</label>
        <select
          className={styles.filterSelect}
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="single">{t("una_sola_fecha")}</option>
          <option value="range">{t("rango_de_fechas")}</option>
          <option value="mensual">{t("mensual")}</option>
        </select>

        <span className={styles.filterTitle}>
          {mode === "single" && t("una_sola_fecha")}
          {mode === "range"  && t("rango_de_fechas")}
          {mode === "mensual"&& t("mensual")}
        </span>

        <div className={styles.filterInputs}>
          {mode === "single" && (
            <input
              type="date"
              className={styles.filterInput}
              value={fecha}
              onChange={e => setFecha(e.target.value)}
            />
          )}
          {mode === "range" && (
            <>
              <input
                type="date"
                className={styles.filterInput}
                value={desde}
                onChange={e => setDesde(e.target.value)}
              />
              <input
                type="date"
                className={styles.filterInput}
                value={hasta}
                onChange={e => setHasta(e.target.value)}
              />
            </>
          )}
          {mode === "mensual" && (
            <>
              <select
                className={styles.filterInput}
                value={mes}
                onChange={e => setMes(e.target.value)}
              >
                <option value="">—</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={String(m).padStart(2, "0")}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                className={styles.filterInput}
                value={anio}
                onChange={e => setAnio(e.target.value)}
              >
                <option value="">—</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <button className={styles.applyBtn} onClick={applyFilter}>
          {t("aplicar_filtro")}
        </button>
        <button className={styles.clearBtn} onClick={clearFilter}>
          {t("borrar_filtro")}
        </button>
      </div>

      {/* ACCIONES globales */}
      <div className={styles.actions}>
        <button onClick={handleSelectAll}>{t("seleccionar_todos")}</button>
        <button
          disabled={!selEg.size}
          onClick={handleDeleteSelected}
        >
          {t("borrar_seleccionados")}
        </button>
      </div>

      {/* TABLA */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selEg.size === egresos.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>{t("fecha")}</th>
            <th>{t("categoria")}</th>
            <th>{t("tipo")}</th>
            <th>{t("proveedor")}</th>
            <th>{t("total")}</th>
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
                  onChange={() => toggleSelect(row.id)}
                />
              </td>
              <td>{row.fecha}</td>
              <td>
                {editingId === row.id ? (
                  <input
                    className={styles.editInput}
                    value={editData.categoria}
                    onChange={e =>
                      setEditData(prev => ({ ...prev, categoria: e.target.value }))
                    }
                  />
                ) : (
                  row.categoria
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    className={styles.editInput}
                    value={editData.tipo}
                    onChange={e =>
                      setEditData(prev => ({ ...prev, tipo: e.target.value }))
                    }
                  />
                ) : (
                  row.tipo
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    className={styles.editInput}
                    value={editData.proveedor}
                    onChange={e =>
                      setEditData(prev => ({ ...prev, proveedor: e.target.value }))
                    }
                  />
                ) : (
                  row.proveedor
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    className={styles.editInput}
                    value={editData.total}
                    onChange={e =>
                      setEditData(prev => ({ ...prev, total: e.target.value }))
                    }
                  />
                ) : (
                  `$${row.total}`
                )}
              </td>
              <td className={styles.rowActions}>
                {editingId === row.id ? (
                  <>
                    <button onClick={() => saveEdit(row.id)}>
                      <FaSave />
                    </button>
                    <button onClick={cancelEdit}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(row)} className={styles.editBtn}>
                      <FaEdit />
                    </button>
                    <button onClick={() => deleteOne(row.id)} className={styles.deleteBtn}>
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}