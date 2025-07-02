// src/utils/i18n.js

// Mapeo de loaders dinámicos de cada JSON de idioma
const localeLoaders = {
  es: () => import("../locales/es.json"),
  en: () => import("../locales/en.json"),
  pt: () => import("../locales/pt.json"),
};

const cache = {};

/**
 * Carga y cachea el diccionario para un locale dado.
 * @param {string} locale — "es", "en", "pt", etc.
 * @returns {Promise<Record<string,string>>}
 */
export async function loadLocale(locale) {
  if (cache[locale]) {
    return cache[locale];
  }

  const loader = localeLoaders[locale];
  if (!loader) {
    throw new Error(`Locale '${locale}' no está configurado.`);
  }

  const module = await loader();
  // module.default es el objeto JSON importado
  cache[locale] = module.default;
  return cache[locale];
}
