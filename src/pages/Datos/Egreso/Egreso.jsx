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
import { endOfMonth } from "date-fns";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import styles from "../Ingreso/Ingreso.module.css";

export default function Egreso() {
  const { t } = useIdioma();

  // --- Estados de filtro ---
  const [mode, setMode]     = useState("single");
  const [fecha, setFecha]   = useState("");
  const [desde, setDesde]   = useState("");
  const [hasta, setHasta]   = useState("");
  const [mes, setMes]       = useState("");
  const [anio, setAnio]     = useState("");
  const [filterParams, setFilterParams] = useState({});

  // --- Datos y UI ---
  const [egresos, setEgresos]       = useState([]);
  const [selEg, setSelEg]           = useState(new Set());
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // --- Inline edit ---
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({
    categoria: "",
    tipo: "",
    proveedor: "",
    total: ""
  });

  // Años para filtro mensual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Convierte "YYYY-MM-DD" a Date local a medianoche
  const parseLocalDate = str => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
  };

  // Construye la query con un día extra al final
  const buildQuery = () => {
    let q = collection(db, "egresos");
    const p = filterParams;

    if (p.mode === "single" && p.fecha) {
      const start = parseLocalDate(p.fecha);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      q = query(
        q,
        where("fecha", ">=", Timestamp.fromDate(start)),
        where("fecha", "<",  Timestamp.fromDate(end)),
        orderBy("fecha", "desc")
      );
    }
    else if (p.mode === "range" && p.desde && p.hasta) {
      const start = parseLocalDate(p.desde);
      const end   = parseLocalDate(p.hasta);
      end.setDate(end.getDate() + 1);
      q = query(
        q,
        where("fecha", ">=", Timestamp.fromDate(start)),
        where("fecha", "<",  Timestamp.fromDate(end)),
        orderBy("fecha", "desc")
      );
    }
    else if (p.mode === "mensual" && p.mes && p.anio) {
      const first = new Date(p.anio, Number(p.mes) - 1, 1, 0, 0, 0);
      let last = endOfMonth(first);
      last.setHours(0, 0, 0, 0);
      last.setDate(last.getDate() + 1);
      q = query(
        q,
        where("fecha", ">=", Timestamp.fromDate(first)),
        where("fecha", "<",  Timestamp.fromDate(last)),
        orderBy("fecha", "desc")
      );
    }
    else {
      q = query(q, orderBy("fecha", "desc"));
    }

    return q;
  };

  // Carga datos al cambiar filtros
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(buildQuery());
        const list = snap.docs.map(d => {
          const data = d.data();
          const raw  = data.fecha;
          const dt   = raw.toDate
            ? raw.toDate()
            : raw.seconds
              ? new Date(raw.seconds * 1000)
              : new Date(raw);
          return {
            id:        d.id,
            fecha:     dt.toLocaleDateString(),
            categoria: data.categoria || "",
            tipo:      data.tipo      || "",
            proveedor: data.proveedor || "",
            total:     data.total     || 0
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
    load();
  }, [filterParams]);

  // Aplica o limpia filtros
  const applyFilter = () =>
    setFilterParams({ mode, fecha, desde, hasta, mes, anio });
  const clearFilter = () => {
    setMode("single");
    setFecha(""); setDesde(""); setHasta("");
    setMes(""); setAnio("");
    setFilterParams({});
  };

  // Selección y borrado
  const toggleSelect   = id => {
    setSelEg(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const selectAll     = () =>
    setSelEg(prev =>
      prev.size === egresos.length
        ? new Set()
        : new Set(egresos.map(e => e.id))
    );
  const deleteSelected = async () => {
    for (let id of selEg) {
      await deleteDoc(doc(db, "egresos", id));
    }
    setEgresos(prev => prev.filter(e => !selEg.has(e.id)));
    setSelEg(new Set());
  };
  const deleteOne = async id => {
    await deleteDoc(doc(db, "egresos", id));
    setEgresos(prev => prev.filter(e => e.id !== id));
    setSelEg(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  // Inline edit
  const startEdit  = row => {
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
  const saveEdit   = async id => {
    const ref = doc(db, "egresos", id);
    await updateDoc(ref, {
      categoria: editData.categoria,
      tipo:      editData.tipo,
      proveedor: editData.proveedor,
      total:     Number(editData.total)
    });
    setEgresos(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, ...editData, total: Number(editData.total) }
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
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2,"0")}>
                    {String(i+1).padStart(2,"0")}
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

      {/* ACCIONES */}
      <div className={styles.actions}>
        <button onClick={selectAll}>{t("seleccionar_todos")}</button>
        <button disabled={!selEg.size} onClick={deleteSelected}>
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
                onChange={selectAll}
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
                      setEditData(d => ({ ...d, categoria: e.target.value }))
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
                      setEditData(d => ({ ...d, tipo: e.target.value }))
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
                      setEditData(d => ({ ...d, proveedor: e.target.value }))
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
                      setEditData(d => ({ ...d, total: e.target.value }))
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
                    <button
                      onClick={() => startEdit(row)}
                      className={styles.editBtn}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteOne(row.id)}
                      className={styles.deleteBtn}
                    >
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