import type { MenuItem } from '@lib/types/menuItem';

export const MENU: MenuItem[] = [
  {
    id: 'inicio',
    name: 'Inicio',
    description:
      'Calculadoras para inversiones, ahorros, préstamos e intereses.',
    slug: '/',
  },
  {
    id: 'blog',
    name: 'Blog',
    description:
      'Blog con artículos sobre finanzas personales, salud, matemáticas y más.',
    slug: '/blog',
  },
  {
    id: 'matematicas',
    name: 'Matemáticas',
    description: 'Calculadoras de porcentajes, fracciones, áreas y más.',
    slug: '/matematicas',
  },
];