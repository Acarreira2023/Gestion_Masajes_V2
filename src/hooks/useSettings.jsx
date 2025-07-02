import { useState, useEffect, useCallback } from "react";

// Deben coincidir con las clases de index.css
export const THEMES = [
  "zen",
  "oceano",
  "lavanda",
  "selva",
  "piedra",
  "crema"
];

const STORAGE_KEY = "app_settings";

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return {
    theme: "zen",
    availableThemes: THEMES
  };
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  // Al cambiar theme, actualizo <body> y persisto
  useEffect(() => {
    THEMES.forEach((t) =>
      document.body.classList.remove(`tema-${t}`)
    );
    document.body.classList.add(`tema-${settings.theme}`);
    saveSettings(settings);
  }, [settings]);

  // Escucha localStorage en otras pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSettings(loadSettings());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback(
    (theme) => {
      if (!THEMES.includes(theme)) return;
      setSettings((s) => ({ ...s, theme }));
    },
    []
  );

  return { settings, setTheme };
}