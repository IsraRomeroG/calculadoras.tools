# Spec 04 - Confianza editorial, autoría y fuentes

## Objetivo

Hacer visible quién crea el contenido, cómo se revisa, qué fuentes se usan y
cómo se corrigen errores. La implementación debe reflejar procesos reales, sin
inventar credenciales ni revisores.

Esta spec crea la base institucional y técnica para mostrar confianza editorial.
No completa por sí sola la revisión YMYL de cada URL sensible; esa revisión
pieza por pieza pertenece a la spec 05.

## Alcance

Nuevas páginas:

- `/acerca-de`
- `/metodologia`
- `/politica-editorial`
- `/correcciones`
- `/avisos/salud`
- `/avisos/financiero-fiscal`

Archivos probables:

- `src/pages/acerca-de.astro`
- `src/pages/metodologia.astro`
- `src/pages/politica-editorial.astro`
- `src/pages/correcciones.astro`
- `src/pages/avisos/salud.astro`
- `src/pages/avisos/financiero-fiscal.astro`
- `src/content.config.ts`
- `src/lib/editorial.ts` o helper equivalente para la entidad editorial base.
- Componentes de artículo para metadatos editoriales y fuentes, si ayudan a
  mantener la plantilla legible.
- `src/pages/blog/[category]/[slug].astro`
- `src/layouts/BaseLayout.astro`
- `src/components/template/Footer.astro`

## Fuera de alcance de este paso

- Revisar todas las calculadoras sensibles, añadir fuentes por calculadora,
  insertar avisos en cada URL YMYL o definir fechas de revisión por herramienta.
  Eso pertenece a la spec 05.
- Migrar exhaustivamente todos los artículos YMYL a `sources`. Este paso debe
  dejar el modelo y la plantilla listos; la cobertura completa se valida en la
  spec 05.
- Crear modelo de artículos relacionados, reforzar hubs o rehacer enlaces
  calculadora-artículo. Eso pertenece a la spec 06.
- Cambiar privacidad, consentimiento, proveedor publicitario o `ads.txt`. Eso
  pertenece a la spec 07.
- Hacer la auditoría final de sitemap, Search Console, publicidad y rastreo.
  Eso pertenece a la spec 08.

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

### Entidad editorial base

Definir una entidad editorial real y reutilizable, por ejemplo
`EDITORIAL_ENTITY`, con:

- Nombre público.
- URL interna, preferiblemente `/acerca-de`.
- Descripción corta del responsable editorial, sin credenciales inventadas.

Esta entidad se usa como fallback visible cuando un artículo no tenga autor
individual público. El fallback debe aparecer en la página y en el schema; no
debe existir solo en JSON-LD.

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
reviewNote: z.string().optional(),
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
- `reviewedDate` no debe existir sin `reviewer` o `reviewNote`; validar esta
  relación con `z.superRefine` o una prueba equivalente.
- `reviewNote` puede documentar una revisión editorial verificable sin atribuir
  una revisión profesional a una persona concreta. Si no identifica una persona,
  no debe generar `reviewedBy` en datos estructurados.
- `updatedDate` solo se usa cuando hubo cambio editorial sustancial.
- `updatedDate` no debe ser anterior a `pubDate`.
- `sources` debe contener fuentes que respalden afirmaciones, no enlaces
  decorativos.
- Si no hay autor individual público, se puede usar una entidad editorial real,
  pero debe estar explicada en `/acerca-de`.
- Esta spec no obliga a que todos los posts existentes tengan `sources` de
  inmediato. Sí debe dejar el campo, el render y las validaciones listos para
  que la spec 05 detecte y complete los YMYL pendientes.

## Presentación en artículos

Actualizar `src/pages/blog/[category]/[slug].astro` para mostrar:

- Autor o responsable editorial, usando la entidad editorial base como fallback.
- Fecha de publicación.
- Fecha de actualización, solo si existe `updatedDate`.
- Revisor y fecha, solo si existe revisión real atribuible a esa persona.
- Nota de revisión, si existe `reviewNote`.
- Nota metodológica si existe.
- Fuentes en una sección consistente.

Ubicación recomendada:

- Metadatos principales en el header bajo el título.
- Nota metodológica en el aside o antes del contenido, si es corta.
- Fuentes al final del artículo, generadas desde frontmatter para consistencia.

No duplicar fuentes si el Markdown ya contiene una sección manual. En este paso:

1. Permitir transición temporal para posts que aún tienen fuentes manuales.
2. Renderizar `sources` cuando exista frontmatter estructurado.
3. Evitar que un post ya migrado conserve una sección manual equivalente.
4. Dejar la migración prioritaria de artículos YMYL para la spec 05.

## Schema

Actualizar `Article` o `BlogPosting` JSON-LD:

- `author` debe usar persona o entidad real y coincidir con lo visible.
- `publisher` puede seguir siendo `Calculadoras.Tools`.
- `dateModified` debe usar `updatedDate` cuando exista; si no, `pubDate`.
- `mainEntityOfPage` debe conservar canonical actual.
- No incluir `reviewedBy` directamente en `Article` por defecto. Si se decide
  modelar una revisión estructurada, usar un tipo compatible y visible, por
  ejemplo un `@graph` con `WebPage.reviewedBy`, y solo cuando exista revisión
  real.

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

Las páginas de aviso deben quedar enlazadas al menos desde una página
institucional relacionada, como `/metodologia` o `/politica-editorial`, para no
quedar huérfanas antes de la migración de contenidos sensibles en la spec 05.

El enlace de preferencias de publicidad puede conservarse si ya existe, pero su
comportamiento y textos de privacidad pertenecen a la spec 07.

Mantener el footer discreto y legible; no convertirlo en bloque promocional.

## Migración por prioridad

### Lote 1: páginas de confianza

Publicar las páginas institucionales y enlazarlas en el footer.

### Lote 2: schema y plantilla

Agregar campos al schema y mostrar metadatos sin romper posts existentes.

### Lote 3: transición de fuentes

Preparar la transición sin exigir cobertura completa:

- Soportar posts con `sources` estructurado.
- Mantener temporalmente secciones manuales de fuentes en posts no migrados.
- Añadir una prueba o búsqueda estática para evitar duplicidad cuando un post ya
  tenga `sources`.

### Lote 4: pendientes para la spec 05

Documentar que la migración completa de fuentes, límites y avisos en salud,
finanzas, inmuebles, impuestos y otros temas sensibles continúa en la spec 05.

## Criterios de aceptación

- Existen y responden 200 las páginas `/acerca-de`, `/metodologia`,
  `/politica-editorial` y `/correcciones`.
- Existen y responden 200 las páginas `/avisos/salud` y
  `/avisos/financiero-fiscal`.
- Las páginas de aviso no quedan huérfanas dentro del sitio.
- Las páginas de aviso quedan disponibles para enlazarse desde contenidos
  sensibles en la spec 05.
- El footer enlaza las páginas institucionales de confianza.
- Todos los artículos muestran responsable editorial.
- Las fechas visibles coinciden con el frontmatter y el schema.
- El schema no declara autor, revisor ni actualización que no aparezcan en la
  página.
- El schema no declara `reviewedBy` salvo que se haya elegido un tipo compatible
  y exista revisión real visible.
- No se inventaron credenciales, autores ni procesos.

## Pruebas requeridas

- Validar schema de frontmatter con casos:
  - Post con autor y fuentes.
  - Post sin autor individual, usando la entidad editorial base.
  - Post sin revisor.
  - Post con revisor y `reviewedDate`.
  - Post con `reviewNote` y `reviewedDate`.
  - Post inválido con `reviewedDate` sin `reviewer` ni `reviewNote`.
  - Post con `updatedDate`.
- Prueba de render de artículo para metadatos visibles.
- Prueba o búsqueda estática para confirmar que footer enlaza páginas
  institucionales nuevas.
- Prueba o búsqueda estática para confirmar que los avisos tienen al menos un
  enlace interno.
- Prueba o búsqueda estática para confirmar que las nuevas páginas de confianza
  y avisos no incluyen `AdSlot`.
- Validación manual de JSON-LD en una muestra de artículos.

## Riesgos y mitigaciones

Riesgo: usar autores genéricos sin transparencia.

Mitigación: explicar la entidad editorial y enlazarla.

Riesgo: mostrar revisión inexistente.

Mitigación: `reviewer` opcional y prohibido sin revisión real; `reviewedDate`
debe requerir `reviewer` o `reviewNote`.

Riesgo: declarar schema de revisión con una propiedad incompatible o no visible.

Mitigación: no usar `reviewedBy` en `Article` por defecto; si se necesita, usar
un tipo compatible y validar manualmente JSON-LD.

Riesgo: convertir esta spec en una migración YMYL completa.

Mitigación: limitar este paso a infraestructura, páginas de confianza y
plantilla; la cobertura YMYL se ejecuta y valida en la spec 05.
