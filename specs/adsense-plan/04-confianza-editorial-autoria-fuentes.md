# Spec 04 - Confianza editorial, autoría y fuentes

## Objetivo

Hacer visible quién crea el contenido, cómo se revisa, qué fuentes se usan y
cómo se corrigen errores. La implementación debe reflejar procesos reales, sin
inventar credenciales ni revisores.

## Alcance

Nuevas páginas:

- `/acerca-de`
- `/metodologia`
- `/politica-editorial`
- `/correcciones`
- Aviso general de salud.
- Aviso general financiero y fiscal.

Archivos probables:

- `src/pages/acerca-de.astro`
- `src/pages/metodologia.astro`
- `src/pages/politica-editorial.astro`
- `src/pages/correcciones.astro`
- `src/pages/avisos/salud.astro` o ruta equivalente.
- `src/pages/avisos/financiero-fiscal.astro` o ruta equivalente.
- `src/content.config.ts`
- `src/pages/blog/[category]/[slug].astro`
- `src/layouts/BaseLayout.astro`
- `src/components/template/Footer.astro`

## Decisiones de contenido

### Acerca de

Debe explicar, con datos reales:

- Quién opera `calculadoras.tools`.
- Propósito del proyecto.
- Qué experiencia real tiene la persona o equipo responsable.
- Cómo contactar al responsable.
- Cómo se financia el sitio.
- Qué límites tiene el contenido.

No debe mencionar credenciales médicas, financieras, fiscales o legales si no
existen.

### Metodología

Debe explicar:

- Cómo se seleccionan calculadoras.
- Cómo se verifican fórmulas.
- Cómo se eligen unidades, presets y ejemplos.
- Cómo se revisan fuentes.
- Cómo se decide si una URL merece existir.
- Cómo se prueban resultados cuando hay calculadora.
- Cómo se maneja contenido sensible.

Debe enlazar a calculadoras representativas y aclarar que los resultados son
estimaciones cuando corresponda.

### Política editorial

Debe explicar:

- Criterios de selección de temas.
- Uso de fuentes primarias y secundarias.
- Uso de IA, si aplica.
- Revisión humana.
- Actualizaciones.
- Correcciones.
- Separación entre contenido editorial y publicidad.
- Prohibición de inventar autores, revisores o experiencia.

### Correcciones

Debe incluir:

- Cómo reportar un error.
- Qué datos conviene enviar.
- Cómo se evalúa una corrección.
- Cuándo se actualiza una fecha.
- Cómo se registra una corrección importante.

Puede usar el contacto existente como canal si no hay otro sistema.

### Aviso de salud

Debe aclarar:

- El contenido no sustituye atención médica.
- Las calculadoras son educativas y estimativas.
- Hay casos que requieren profesional: embarazo, menores, enfermedad, síntomas,
  medicación, trastornos alimentarios, condiciones crónicas.
- Las fuentes respaldan información general, no diagnóstico individual.

### Aviso financiero y fiscal

Debe aclarar:

- El contenido es educativo y de estimación.
- No sustituye asesoría financiera, fiscal, legal o hipotecaria.
- Tasas, impuestos, comisiones y condiciones cambian por país, institución y
  fecha.
- El usuario debe confirmar datos con fuentes oficiales o profesionales.

## Modelo de contenido

`src/content.config.ts` debe extender la colección `blog`.

Campos recomendados:

```ts
author: z.object({
  name: z.string(),
  url: z.string().optional(),
}).optional(),
reviewer: z
  .object({
    name: z.string(),
    url: z.string().optional(),
    role: z.string().optional(),
  })
  .optional(),
reviewedDate: z.coerce.date().optional(),
sources: z
  .array(
    z.object({
      label: z.string(),
      url: z.string().url(),
      publisher: z.string().optional(),
      accessedDate: z.coerce.date().optional(),
    }),
  )
  .default([]),
methodologyNote: z.string().optional(),
```

Reglas:

- `reviewer` solo se usa cuando hubo revisión real por esa persona.
- `reviewedDate` no debe existir sin `reviewer` o nota de revisión verificable.
- `updatedDate` solo se usa cuando hubo cambio editorial sustancial.
- `sources` debe contener fuentes que respalden afirmaciones, no enlaces
  decorativos.
- Si no hay autor individual público, se puede usar una entidad editorial real,
  pero debe estar explicada en `/acerca-de`.

## Presentación en artículos

Actualizar `src/pages/blog/[category]/[slug].astro` para mostrar:

- Autor o responsable editorial.
- Fecha de publicación.
- Fecha de actualización, solo si existe `updatedDate`.
- Revisor y fecha, solo si existe revisión real.
- Nota metodológica si existe.
- Fuentes en una sección consistente.

Ubicación recomendada:

- Metadatos principales en el header bajo el título.
- Nota metodológica en el aside o antes del contenido, si es corta.
- Fuentes al final del artículo, generadas desde frontmatter para consistencia.

No duplicar fuentes si el Markdown ya contiene una sección manual. Migrar por
lotes:

1. Permitir transición temporal.
2. Migrar artículos YMYL primero.
3. Retirar secciones manuales cuando `sources` cubra la pieza.

## Schema

Actualizar `Article` JSON-LD:

- `author` debe usar persona o entidad real.
- `publisher` puede seguir siendo `Calculadoras.Tools`.
- `dateModified` debe usar `updatedDate` cuando exista; si no, `pubDate`.
- Incluir `reviewedBy` solo si existe revisión real y el tipo elegido es
  compatible.
- `mainEntityOfPage` debe conservar canonical actual.

Evitar schema con datos no visibles. La información estructurada debe coincidir
con lo que el usuario ve.

## Footer y navegación

Actualizar `src/components/template/Footer.astro` para enlazar:

- Privacidad.
- Contacto.
- Acerca de.
- Metodología.
- Política editorial.
- Correcciones.
- Preferencias de publicidad cuando aplique.

Mantener el footer discreto y legible; no convertirlo en bloque promocional.

## Migración por prioridad

### Lote 1: páginas de confianza

Publicar las páginas institucionales y enlazarlas en el footer.

### Lote 2: schema y plantilla

Agregar campos al schema y mostrar metadatos sin romper posts existentes.

### Lote 3: YMYL publicado

Migrar primero:

- Salud.
- Finanzas.
- Inmuebles.
- Legal e impuestos.

### Lote 4: resto de artículos

Migrar matemáticas y otros contenidos con fuentes cuando corresponda.

## Criterios de aceptación

- Existen y responden 200 las páginas `/acerca-de`, `/metodologia`,
  `/politica-editorial` y `/correcciones`.
- Las páginas de aviso existen y están enlazadas desde contenidos sensibles.
- El footer enlaza todas las páginas de confianza.
- Todos los artículos muestran responsable editorial.
- Todos los artículos YMYL tienen fuentes externas fiables.
- Las fechas visibles coinciden con el frontmatter y el schema.
- El schema no declara autor, revisor ni actualización que no aparezcan en la
  página.
- No se inventaron credenciales, autores ni procesos.

## Pruebas requeridas

- Validar schema de frontmatter con casos:
  - Post con autor y fuentes.
  - Post sin revisor.
  - Post con revisor y `reviewedDate`.
  - Post con `updatedDate`.
- Prueba de render de artículo para metadatos visibles.
- Prueba o búsqueda estática para confirmar que footer enlaza páginas nuevas.
- Validación manual de JSON-LD en una muestra de artículos.

## Riesgos y mitigaciones

Riesgo: usar autores genéricos sin transparencia.

Mitigación: explicar la entidad editorial y enlazarla.

Riesgo: mostrar revisión inexistente.

Mitigación: `reviewer` opcional y prohibido sin revisión real.

Riesgo: migración larga de fuentes.

Mitigación: priorizar YMYL y permitir transición temporal controlada.
