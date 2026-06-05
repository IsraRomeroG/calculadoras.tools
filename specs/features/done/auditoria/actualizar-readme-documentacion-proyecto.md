# Spec: actualizar README y documentacion activa

## Contexto

El proyecto ha evolucionado desde las primeras specs. La auditoria encontro que
el README ya no describe con precision el estado actual.

Ejemplos:

- Lista solo 3 calculadoras publicadas.
- Menciona rutas antiguas del blog como `src/pages/blog/[...slug].astro`.
- Menciona `src/pages/blog/categoria/[category].astro`.
- Describe metadatos de blog con `category`, pero la coleccion actual usa
  `categorySlug`.

## Problema

La documentacion activa puede inducir a errores al agregar contenido,
calculadoras o rutas nuevas.

Impacto:

- Nuevas contribuciones pueden copiar rutas antiguas.
- El mantenimiento del blog puede usar frontmatter incorrecto.
- La estructura real de `src/pages/blog` queda desalineada con el README.
- Las validaciones y scripts disponibles quedan poco claros.

## Objetivo

Actualizar el README.

## Cambios esperados en README

1. Actualizar lista de calculadoras.

   Opcion recomendada: no enumerar manualmente todas las calculadoras, sino
   explicar que la fuente de verdad es:

   ```text
   src/lib/constants/calculators.ts
   ```

2. Actualizar rutas del blog:

   ```text
   src/pages/blog.astro
   src/pages/blog/[category].astro
   src/pages/blog/[category]/[slug].astro
   src/pages/blog/[category]/pagina/[page].astro
   src/pages/blog/pagina/[page].astro
   ```

3. Actualizar metadatos de contenido:

   ```text
   categorySlug
   ```

   en lugar de `category`.

4. Aclarar que las categorias compartidas viven en:

   ```text
   src/lib/constants/categories.ts
   ```

5. Aclarar que las calculadoras publicadas se muestran automaticamente desde
   `CALCULATORS`.

6. Aclarar validaciones disponibles:

   ```powershell
   npm.cmd run test:unit:run
   npm.cmd run coverage
   ```

## Fuera de alcance

- Reescribir las specs dentro de `specs/`.
- Cambiar estructura del proyecto.
- Cambiar scripts de npm.

## Criterios de aceptacion

- README no menciona rutas inexistentes del blog.
- README no dice que el frontmatter usa `category` cuando usa `categorySlug`.
- README no lista solo 3 calculadoras como si fueran todas las disponibles.
- README apunta a las fuentes de verdad correctas:
  - `src/lib/constants/calculators.ts`
  - `src/lib/constants/categories.ts`
  - `src/content.config.ts`
