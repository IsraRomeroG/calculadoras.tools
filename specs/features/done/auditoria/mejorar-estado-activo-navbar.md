# Spec: mejorar estado activo y accesibilidad del navbar

## Contexto

`src/components/template/Navbar.astro` calcula si una ruta esta activa:

```ts
function isActiveRoute(currentPath: string, slug: string): boolean
```

Pero las clases aplicadas para estado activo e inactivo son iguales en la
practica. El componente tampoco expone `aria-current` en el enlace activo.

## Problema

La navegacion principal no comunica claramente la seccion activa.

Impacto:

- El usuario no tiene una pista visual clara de donde esta.
- Tecnologias asistivas no reciben `aria-current="page"`.
- La funcion `isActiveRoute` existe, pero no produce un comportamiento util.

## Objetivo

Actualizar el navbar para que el enlace activo tenga estilo visual distinto y
atributo `aria-current`.

## Alcance

- Editar `src/components/template/Navbar.astro`.
- Mantener el comportamiento mobile actual del menu.
- Mantener los items definidos en `src/lib/constants/menu.ts`.
- Agregar validacion si la tarea de pruebas automatizadas ya existe.

## Fuera de alcance

- Redisenar completamente el header.
- Cambiar estructura del menu.
- Agregar submenus.
- Cambiar URLs de navegacion.

## Cambios tecnicos esperados

1. Calcular `const isActive = isActiveRoute(currentPath, menuItem.slug)` dentro
   del render del item.

2. Aplicar clases diferenciadas:

   - Activo: texto claro, fondo o borde visible.
   - Inactivo: estado normal con hover.

3. Agregar:

   ```astro
   aria-current={isActive ? "page" : undefined}
   ```

4. Mantener `aria-expanded` del boton mobile.

5. Opcional: cerrar el menu mobile al hacer click en un enlace si mejora la UX.

## Criterios de aceptacion

- En `/`, el item `Inicio` tiene estado activo.
- En `/blog`, el item `Blog` tiene estado activo.
- En `/blog/salud`, el item `Blog` sigue activo.
- En `/contacto`, el item `Contacto` tiene estado activo.
- Solo un item principal debe tener `aria-current="page"` en cada ruta normal.
- El menu mobile sigue abriendo y cerrando correctamente.
- `npm.cmd run test:unit:run` pasa sin errores.
- `npm.cmd run build` pasa sin errores.

## Pruebas manuales sugeridas

- Abrir `/`, `/blog`, `/blog/salud` y `/contacto`.
- Confirmar estado visual activo.
- Inspeccionar el DOM y confirmar `aria-current="page"` en el enlace correcto.
- Probar el menu mobile y confirmar que `aria-expanded` cambia entre `true` y
  `false`.

