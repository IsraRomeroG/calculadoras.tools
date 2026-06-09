import type { MenuItem } from "@lib/types/menuItem";

export const MENU: MenuItem[] = [
  {
    id: "inicio",
    name: "Inicio",
    description:
      "Calculadoras para inversiones, ahorros, préstamos e intereses.",
    slug: "/",
  },
  {
    id: "blog",
    name: "Blog",
    description:
      "Blog con artículos sobre finanzas personales, salud, matemáticas y más.",
    slug: "/blog/",
  },
  {
    id: "contacto",
    name: "Contacto",
    description: "Contáctanos para cualquier pregunta o comentario.",
    slug: "/contacto/",
  },
];
