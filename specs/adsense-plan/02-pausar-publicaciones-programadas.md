# Spec 02 - Pausar publicaciones programadas

## Objetivo

Detener temporalmente la expansión editorial mientras se corrige el inventario
actual. La pausa debe impedir que nuevas URLs se publiquen automáticamente antes
de completar la revisión de calidad, fuentes, autoría y canibalización.

## Alcance

Contenido bajo:

`src/content/blog/**`

Lógica de publicación:

- `src/lib/blog-publication.ts`
- `astro.config.mjs`
- `src/content.config.ts`

## Inventario inicial

Con fecha local 23 de junio de 2026, el repositorio contiene estos archivos con
`pubDate` posterior a esa fecha:

| Archivo                                                               | Fecha      |
| --------------------------------------------------------------------- | ---------- |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-150.md`             | 2027-06-20 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-155.md`             | 2027-06-21 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-160.md`             | 2027-06-22 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-165.md`             | 2027-06-23 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-170.md`             | 2027-06-24 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-175.md`             | 2027-06-25 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-180.md`             | 2027-06-26 |
| `src/content/blog/salud/cuanto-debo-pesar-si-mido-185.md`             | 2027-06-27 |
| `src/content/blog/salud/tabla-peso-saludable-150-195.md`              | 2027-06-28 |
| `src/content/blog/salud/imc-18-20-22-25-27-30-35-40.md`               | 2027-06-29 |
| `src/content/blog/salud/que-es-tdee-calorias-diarias.md`              | 2027-06-30 |
| `src/content/blog/salud/cuantas-calorias-necesito-al-dia.md`          | 2027-07-01 |
| `src/content/blog/salud/como-elegir-nivel-de-actividad-tdee.md`       | 2027-07-02 |
| `src/content/blog/salud/calorias-de-mantenimiento.md`                 | 2027-07-03 |
| `src/content/blog/salud/tmb-vs-tdee-diferencias.md`                   | 2027-07-04 |
| `src/content/blog/salud/cuantas-calorias-para-bajar-de-peso.md`       | 2027-07-05 |
| `src/content/blog/salud/cuantas-calorias-para-subir-de-peso.md`       | 2027-07-06 |
| `src/content/blog/salud/por-que-mi-peso-no-cambia-si-como-mi-tdee.md` | 2027-07-07 |
| `src/content/blog/salud/formula-mifflin-st-jeor.md`                   | 2027-07-08 |
| `src/content/blog/salud/tdee-y-macros-como-se-relacionan.md`          | 2027-07-09 |

Antes de ejecutar cambios, volver a contar los posts futuros desde el
frontmatter local y pausar todos los que sigan teniendo `pubDate` posterior a
la fecha editorial de ejecución.

## Decisión editorial

La pausa debe ser explícita. No basta con mover fechas a futuro sin registrar
por qué el contenido quedó detenido.

Opción recomendada:

- Agregar `draft: true` a cada artículo programado.
- Mantener `pubDate` original como referencia editorial.
- Añadir, si se incorpora al schema, un campo interno como `reviewStatus` en una
  fase posterior. No bloquear esta spec por ese campo.

No cambiar fechas a valores ficticios solo para retrasar publicación.

## Cambios requeridos

### 1. Confirmar regla de publicación

Revisar `src/lib/blog-publication.ts` y confirmar que un artículo con:

```yaml
draft: true
```

queda fuera de:

- Listados del blog.
- Páginas de categoría.
- Páginas de artículo.
- Sitemap.

Reglas existentes que deben preservarse:

- `src/content.config.ts` ya admite `draft` con valor por defecto `false`.
- `src/lib/blog-publication.ts` ya excluye `draft: true` y fechas futuras con
  `isBlogPostPublishable`.
- Las rutas de blog usan `getPublishedBlogPosts()`, por lo que índice,
  categorías, paginaciones y páginas de artículo quedan cubiertos por la regla.
- `astro.config.mjs` filtra el sitemap leyendo frontmatter manualmente. Validar
  que excluya slugs no publicables exactos y no solo rutas de categorías con
  algún post publicado.

Si alguna de estas reglas cambia o falta al momento de ejecutar, implementarla
antes de marcar borradores.

### 2. Marcar programados como borrador

Agregar a cada frontmatter de los artículos programados:

```yaml
draft: true
```

Conservar:

```yaml
pubDate: YYYY-MM-DD
```

Esto permite auditar el calendario original sin publicar.

La acción debe aplicarse al inventario local completo de posts futuros, no solo
a la tabla de esta spec si el conteo cambia.

### 3. Crear checklist de revisión por artículo

Cada artículo pausado debe clasificarse antes de volver a publicarse:

| Estado       | Uso                                                               |
| ------------ | ----------------------------------------------------------------- |
| `consolidar` | La pieza se fusionará con una guía o tabla principal              |
| `reescribir` | Tiene intención válida, pero necesita fuentes, ejemplos o límites |
| `mantener`   | Puede publicarse tras completar la spec 04 y 05                   |
| `retirar`    | No aporta valor independiente                                     |

La clasificación puede vivir en una spec de seguimiento o en una tabla dentro
de esta carpeta. No tiene que formar parte del frontmatter público.

### 4. Congelar nuevas specs de contenido masivo

No ejecutar specs editoriales que generen series por cifra, estatura, monto,
porcentaje, país o unidad hasta completar la spec 03.

Quedan permitidas:

- Correcciones de fuentes.
- Mejoras de contenido existente.
- Páginas de confianza de la spec 04.
- Ajustes técnicos de sitemap, canonical, anuncios y privacidad.

### 5. Revisar TDEE

Los artículos TDEE programados pueden ser útiles, pero no deben publicarse como
lote automático. Antes de reactivarlos:

- Confirmar que no duplican artículos IMC existentes.
- Añadir fuentes primarias o técnicas.
- Añadir límites de estimación.
- Enlazar con calculadoras reales: TDEE, déficit calórico, macros e IMC.
- Publicar por orden editorial, no por calendario automático.

## Pruebas requeridas

Agregar o actualizar pruebas para asegurar:

- Los posts con `draft: true` no salen de `getPublishedBlogPosts`.
- Los posts futuros no salen antes de su fecha.
- El filtro de sitemap de `astro.config.mjs` excluye drafts y futuros por slug
  exacto.
- Las rutas de blog generadas por `getStaticPaths()` no incluyen artículos
  pausados ni futuros.

Mantener la cobertura existente de `src/lib/blog-publication.test.ts` para
borradores y fechas futuras. Agregar cobertura separada para sitemap si se
modifica `astro.config.mjs`.

## Criterios de aceptación

- Todos los artículos programados están pausados con `draft: true` o mecanismo
  equivalente verificable.
- No aparecen artículos futuros en listados, rutas generadas ni sitemap.
- Existe una tabla de decisión editorial para cada artículo pausado.
- No se publican nuevas series antes de completar la consolidación.
- El inventario local se contó al momento de ejecución y todos los posts con
  `pubDate` futura quedaron pausados.

## Riesgos y mitigaciones

Riesgo: perder URLs que ya estaban planeadas y podrían aportar valor.

Mitigación: la pausa no elimina contenido; lo coloca detrás de revisión.

Riesgo: dejar enlaces internos hacia rutas pausadas.

Mitigación: buscar enlaces internos a cada slug programado antes de desplegar y
eliminarlos si la URL no será pública.

Antes de desplegar, verificar que no existan enlaces desde contenido publicado
hacia slugs que queden pausados.

Riesgo: confundir `draft` con rechazo editorial permanente.

Mitigación: documentar clasificación y fecha de próxima revisión.
