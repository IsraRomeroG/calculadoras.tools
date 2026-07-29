import type { Locale } from "@lib/i18n/config";
import type { MenuItem, MenuItemDefinition } from "@lib/types/menuItem";

export const MENU: MenuItemDefinition[] = [
  {
    id: "home",
    order: 10,
    labels: {
      es: "Inicio",
      en: "Home",
    },
    descriptions: {
      es: "Calculadoras para inversiones, ahorros, prestamos e intereses.",
      en: "Calculators and practical tools for everyday numbers.",
    },
    paths: {
      es: "/",
      en: "/en",
    },
  },
  {
    id: "blog",
    order: 20,
    labels: {
      es: "Blog",
      en: "Blog",
    },
    descriptions: {
      es: "Blog con articulos sobre finanzas personales, salud, matematicas y mas.",
      en: "English guides for calculators and everyday formulas.",
    },
    paths: {
      es: "/blog",
      en: "/en/blog",
    },
  },
  {
    id: "contact",
    order: 30,
    labels: {
      es: "Contacto",
      en: "Contact",
    },
    descriptions: {
      es: "Contactanos para cualquier pregunta o comentario.",
      en: "Send suggestions, report errors, or propose a new calculator.",
    },
    paths: {
      es: "/contacto",
      en: "/en/contact",
    },
  },
];

export const getMenuItems = (locale: Locale): MenuItem[] =>
  MENU.filter((item) => item.paths[locale])
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      name: item.labels[locale],
      slug: item.paths[locale] as string,
      ...(item.descriptions[locale]
        ? { description: item.descriptions[locale] }
        : {}),
    }));
