# Spec 06 - Hubs, enlaces internos y arquitectura editorial

## Objetivo

Hacer que el sitio funcione como una biblioteca mantenida editorialmente, no
como una colección de URLs aisladas. Las categorías deben explicar alcance,
diferencias entre herramientas y próximos pasos reales.

## Alcance

Páginas y helpers:

- `src/pages/index.astro`
- `src/pages/[category].astro`
- `src/pages/blog.astro`
- `src/pages/blog/[category].astro`
- `src/pages/blog/[category]/[slug].astro`
- `src/lib/calculator-directory.ts`
- `src/lib/constants/categories.ts`
- `src/lib/constants/calculators.ts`
- `src/lib/blog.ts`
- `src/components/blog/BlogPostCard.astro`
- `src/components/shared/Card.astro`

## Estado actual observado

Categorías de calculadoras detectadas por inventario local:

| Categoría | Calculadoras |
| --- | ---: |
| `cocina` | 2 |
| `construccion` | 1 |
| `conversores` | 3 |
| `fecha-tiempo` | 7 |
| `finanzas` | 12 |
| `geometria` | 2 |
| `inmuebles` | 1 |
| `legal-impuestos` | 1 |
| `mascotas` | 2 |
| `matematicas` | 11 |
| `probabilidad-estadistica` | 3 |
| `programacion` | 1 |
| `restaurantes` | 2 |
| `salud` | 16 |
| `vehiculos` | 2 |

Categorías con una sola calculadora:

- `construccion`
- `inmuebles`
- `legal-impuestos`
- `programacion`

Estas son candidatas a hub reforzado o redirect hacia la herramienta principal,
según valor editorial disponible.

## Cambios requeridos

### 1. Navegación principal

Añadir acceso a categorías principales desde la navegación o desde un bloque
visible de inicio:

- Salud.
- Finanzas.
- Matemáticas.
- Fecha y tiempo.
- Conversores.
- Inmuebles o impuestos solo si el hub se fortalece.

La navegación debe ayudar a encontrar herramientas, no añadir enlaces por SEO.

### 2. Categorías de calculadoras como hubs

`src/pages/[category].astro` debe evolucionar de cuadrícula simple a hub útil.

Cada categoría debe incluir:

- Descripción de alcance.
- Cuándo usar cada herramienta.
- Diferencias entre herramientas similares.
- Guías relacionadas si existen.
- Enlaces hacia calculadoras principales.
- Sin anuncios hasta que el hub tenga contenido editorial suficiente.

Para categorías de una sola calculadora:

| Categoría | Decisión sugerida |
| --- | --- |
| `construccion` | Convertir en hub si se añadirá pintura, concreto, materiales; si no, evaluar redirect a `/construccion/metros-cuadrados-de-pintura` |
| `inmuebles` | Convertir en hub hipotecario, porque ya hay muchos artículos de hipoteca |
| `legal-impuestos` | Convertir en hub fiscal mínimo con IVA y fuentes por país |
| `programacion` | Redirigir a la herramienta si no habrá cluster editorial pronto |

Si se redirige una categoría pública, aplicar regla de rutas canónicas:

- No conservar página Astro legacy.
- Agregar 301 en `public/.htaccess`.
- Verificar sitemap y enlaces internos.

### 3. Hubs editoriales de blog

`src/pages/blog/[category].astro` debe dejar de ser solo listado si se busca que
posicione como hub.

Agregar por categoría:

- Introducción editorial.
- Temas cubiertos.
- Herramientas relacionadas.
- Guías destacadas.
- Criterio de selección o actualización.

No monetizar estas páginas mientras funcionen principalmente como navegación.

### 4. Artículos relacionados

Al final de cada artículo debe aparecer un bloque de relacionados que responda
a un siguiente paso real.

Modelo de datos recomendado:

```ts
relatedArticles: z
  .array(
    z.object({
      slug: z.string(),
      categorySlug: z.enum(CATEGORY_SLUGS),
      reason: z.string().optional(),
    }),
  )
  .default([])
```

Alternativa simple:

- Derivar relacionados por categoría y tags.
- Excluir el post actual.
- Priorizar `relatedCalculator`.

La opción manual es mejor para YMYL y consolidación, porque evita enlazar a
URLs retiradas o repetitivas.

### 5. Enlaces calculadora-artículo

Cada calculadora importante debe enlazar:

- Guía principal.
- Ejemplo práctico.
- Errores comunes.
- Comparación o límites.

Cada artículo debe enlazar:

- Una calculadora primaria.
- Una guía previa si necesita contexto.
- Un siguiente paso lógico.

No usar siempre el mismo anchor. El texto del enlace debe describir el valor de
la página destino.

### 6. Textos de tarjetas

Revisar tarjetas en inicio, categorías y blog:

- Deben explicar diferencias reales entre herramientas.
- No repetir “calcula X fácil y rápido” sin especificidad.
- Evitar claims absolutos.
- Mostrar unidades, contexto o caso de uso cuando ayude.

El origen probable es `src/lib/constants/calculators.ts` y los frontmatter de
blog.

### 7. Paginación

Evitar que las páginas de paginación compitan con hubs principales:

- Mantener canonicals propios si la arquitectura actual lo requiere.
- No añadir contenido extenso a páginas `pagina/{n}`.
- No enlazar paginaciones como destinos editoriales.
- No mostrar anuncios.

## Orden de implementación

1. Completar spec 03 para retirar URLs repetitivas.
2. Corregir enlaces internos rotos o redirigidos.
3. Crear modelo de relacionados.
4. Reforzar categorías principales.
5. Decidir categorías de una sola herramienta.
6. Actualizar tarjetas y navegación.
7. Revisar sitemap y canonical.

## Criterios de aceptación

- Ninguna calculadora importante queda huérfana.
- Cada categoría explica su alcance y no es únicamente una cuadrícula.
- Las categorías de una sola herramienta tienen decisión documentada: hub fuerte
  o redirect.
- Los enlaces relacionados responden a un siguiente paso real.
- No hay enlaces internos hacia URLs retiradas por la spec 03.
- Las páginas de paginación no tienen anuncios ni compiten con hubs.
- Los textos de tarjetas describen diferencias concretas.

## Pruebas requeridas

- Prueba de enlaces internos sin rutas retiradas.
- Prueba de que cada calculadora publicada tiene al menos un enlace entrante
  desde inicio, categoría o artículo relacionado.
- Prueba o script de auditoría para detectar categorías con una sola
  calculadora.
- Validación de sitemap tras redirects de categorías, si se aplican.

## Riesgos y mitigaciones

Riesgo: crear hubs con texto decorativo.

Mitigación: cada hub debe explicar decisiones o diferencias entre herramientas.

Riesgo: añadir enlaces relacionados irrelevantes.

Mitigación: exigir una razón editorial o relación directa de tarea.

Riesgo: redirigir categorías demasiado pronto.

Mitigación: revisar enlaces internos, tráfico y potencial editorial antes del
301.
