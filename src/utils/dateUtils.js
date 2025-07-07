// src/utils/dateUtils.js

import {
  parseISO,
  isValid,
  format,
  formatDistanceToNow,
  isSameDay,
  isSameMonth,
  subYears,
  addDays as dfAddDays,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays
} from "date-fns";
import { es, enUS, ptBR } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

/** Mapa de locales para date-fns */
export const localesMap = {
  es,
  en: enUS,
  pt: ptBR
};

/**
 * Convierte un input (Date | ISO | string | number | Timestamp) en Date válido o devuelve null.
 */
export function toDate(input) {
  if (!input) return null;

  // 1) Firestore Timestamp
  if (input instanceof Timestamp) {
    const d = input.toDate();
    return isValid(d) ? d : null;
  }

  // 2) Date nativo
  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }

  // 3) ISO string
  if (typeof input === "string") {
    const d = parseISO(input);
    return isValid(d) ? d : null;
  }

  // 4) número (timestamp ms)
  const d = new Date(input);
  return isValid(d) ? d : null;
}

/**
 * Formatea "DD/MM/YYYY". Devuelve "--" si inválida.
 */
export function formatDate(input) {
  const d = toDate(input);
  return d ? format(d, "dd/MM/yyyy") : "--";
}

/**
 * Formatea "DD/MM/YYYY HH:mm". Devuelve "--" si inválida.
 */
export function formatDateTime(input) {
  const d = toDate(input);
  return d ? format(d, "dd/MM/yyyy HH:mm") : "--";
}

/**
 * Suma (o resta si days < 0) días a una fecha. Retorna Date o null.
 */
export function addDays(input, days) {
  const d = toDate(input);
  return d ? dfAddDays(d, days) : null;
}

/**
 * Obtiene lunes y domingo de la semana de la fecha dada. { start: Monday, end: Sunday } o null.
 */
export function getWeekRange(input) {
  const d = toDate(input);
  if (!d) return null;
  const start = startOfWeek(d, { weekStartsOn: 1 });
  const end = endOfWeek(d, { weekStartsOn: 1 });
  return { start, end };
}

/**
 * Diferencia entera de días entre dos fechas (a − b). Null si inválidas.
 */
export function diffDays(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  return da && db ? differenceInCalendarDays(da, db) : null;
}

/**
 * Convierte string ISO a Date. Null si inválido.
 */
export function parsearFechaISO(isoStr) {
  try {
    const d = parseISO(isoStr);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

/**
 * Formato corto "dd/MM/yyyy" con locale. Devuelve "--" si inválida.
 */
export function formatFechaCorta(input, idioma = "es") {
  const d = toDate(input);
  return d
    ? format(d, "dd/MM/yyyy", { locale: localesMap[idioma] })
    : "--";
}

/**
 * Formato largo (e.g. "sábado, 28 de junio de 2025") con locale. Devuelve "--" si inválida.
 */
export function formatFechaLarga(input, idioma = "es") {
  const d = toDate(input);
  return d ? format(d, "PPPP", { locale: localesMap[idioma] }) : "--";
}

/**
 * Compara si dos fechas son el mismo día (ignora hora).
 */
export function esMismoDia(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  return da && db && isSameDay(da, db);
}

/**
 * Compara si dos fechas están en el mismo mes y año.
 */
export function esMismoMes(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  return da && db && isSameMonth(da, db);
}

/**
 * Resta un año exacto a la fecha.
 */
export function unAnioAntes(input) {
  const d = toDate(input);
  return d ? subYears(d, 1) : null;
}

/**
 * Texto tipo "hace 3 días", "en 2 meses", etc., con locale. Devuelve "--" si inválida.
 */
export function desdeAhora(input, idioma = "es") {
  const d = toDate(input);
  return d
    ? formatDistanceToNow(d, {
        addSuffix: true,
        locale: localesMap[idioma]
      })
    : "--";
}