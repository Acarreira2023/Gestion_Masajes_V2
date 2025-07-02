// src/utils/formatters.js

import { toDate, formatDate } from "./date";

// Instancias únicas de Intl.NumberFormat
const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const numberFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Formatea un valor numérico a moneda ARS.
 * Si no es un número válido, devuelve "--".
 * @param {number|string} valor
 * @returns {string}
 */
export function formatCurrency(valor) {
  const num = Number(valor);
  return Number.isFinite(num) ? currencyFormatter.format(num) : "--";
}

/**
 * Formatea un número con separadores de miles y hasta 2 decimales.
 * @param {number|string} valor
 * @returns {string}
 */
export function formatNumber(valor) {
  const num = Number(valor);
  return Number.isFinite(num) ? numberFormatter.format(num) : "--";
}

/**
 * Formatea una fecha a "DD/MM/YYYY".
 * Si la fecha no es válida, devuelve "--".
 * @param {Date|string|number} input
 * @returns {string}
 */
export function formatShortDate(input) {
  return formatDate(input);
}

/**
 * Formatea una fecha y hora a "DD/MM/YYYY HH:mm".
 * Si la fecha no es válida, devuelve "--".
 * @param {Date|string|number} input
 * @returns {string}
 */
export function formatDateTime(input) {
  const date = toDate(input);
  if (!date) return "--";
  const day = formatDate(date);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${hh}:${mm}`;
}

/**
 * Formatea un porcentaje con dos decimales y símbolo "%".
 * @param {number|string} valor
 * @returns {string}
 */
export function formatPercent(valor) {
  const num = Number(valor);
  return Number.isFinite(num)
    ? `${numberFormatter.format(num)}%`
    : "--";
}
