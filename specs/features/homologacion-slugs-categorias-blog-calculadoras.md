# Spec: homologacion de slugs de categorias entre blog y calculadoras

## Contexto

Las calculadoras ya usan metadata explicita para separar el slug de URL del
label visible. Esa metadata vive hoy en
`src/lib/constants/calculator-categories.ts`:

```ts
"legal-impuestos": {
  slug: "legal-impuestos",
  label: "Legal e impuestos",
  description: "...",
}
```

El blog todavia obtiene el slug de categoria desde el texto del frontmatter con
`getCategorySlug(category)` en `src/lib/blog.ts`. Eso produce slugs automaticos:

- `Legal e impuestos` -> `legal-e-impuestos`
- `Fecha y tiempo` -> `fecha-y-tiempo`

Despues del cambio de rutas del blog, los articulos viven bajo:

```txt
/blog/<category-slug>/<slug-del-articulo>
```

Por eso hoy el articulo de IVA queda bajo:

```txt
/blog/legal-e-impuestos/como-calcular-iva
```

pero la categoria equivalente de calculadoras usa:

```txt
/legal-impuestos/calculadora-de-iva
```

La diferencia `legal-e-impuestos` vs `legal-impuestos` vuelve a dejar el sitio
con dos taxonomias publicas para la misma categoria.

## Objetivo

Homologar los slugs de categorias entre blog y calculadoras usando una sola
fuente compartida de metadata.

El label visible y el slug canonico deben ser valores distintos:

| Label visible | Slug canonico |
| --- | --- |
| `Legal e impuestos` | `legal-impuestos` |
| `Fecha y tiempo` | `fecha-tiempo` |

Las URLs canonicas del blog deben usar el slug compartido:

```txt
/blog/legal-impuestos
/blog/legal-impuestos/como-calcular-iva
/blog/fecha-tiempo
/blog/fecha-tiempo/<slug-del-articulo>
```

La UI debe seguir mostrando el label:

```txt
Legal e impuestos
Fecha y tiempo
```

La misma regla debe aplicar para categorias futuras de multiples palabras: el
slug no debe derivarse automaticamente del label visible.

## Estado actual relevante

### Calculadoras

- `src/lib/constants/calculator-categories.ts` define `CALCULATOR_CATEGORIES`.
- Cada calculadora en `src/lib/constants/calculators.ts` usa `categorySlug`.
- `src/lib/calculator-directory.ts` lee metadata por slug.
- Las paginas de categoria de calculadoras ya usan el slug canonico en la URL.

### Blog

- `src/content.config.ts` define `category: z.string()` en el frontmatter.
- Los articulos declaran el label visible, por ejemplo:

```yaml
category: "Legal e impuestos"
```

- `src/lib/blog.ts` calcula el slug con `getCategorySlug(post.data.category)`.
- `getBlogPostUrl(post)` genera `/blog/<slug-calculado>/<slug-articulo>`.
- `getBlogCategories(posts)` agrupa por el slug calculado desde el label.
- La carpeta de contenido de IVA ya vive en `src/content/blog/legal-impuestos`,
  pero la URL actual no usa esa carpeta como fuente del slug.

## Opciones analizadas

### Opcion 1: agregar excepciones al slugger del blog

Agregar un mapa de casos especiales:

```ts
{
  "Legal e impuestos": "legal-impuestos",
  "Fecha y tiempo": "fecha-tiempo",
}
```

Ventajas:

- Cambio pequeno.
- Corrige rapidamente los dos casos mencionados.

Desventajas:

- Mantiene dos fuentes de verdad: calculadoras y blog.
- Las excepciones quedan escondidas dentro de un helper generico.
- No resuelve bien categorias futuras.

Esta opcion no es recomendada.

### Opcion 2: usar la carpeta del articulo como slug de categoria

Tomar el primer segmento de `post.id`, por ejemplo:

```txt
legal-impuestos/como-calcular-iva
```

para generar:

```txt
/blog/legal-impuestos/como-calcular-iva
```

Ventajas:

- Aprovecha que las carpetas actuales ya parecen alineadas con calculadoras.
- Reduce el uso del slugger automatico.

Desventajas:

- El contrato de URL queda escondido en la estructura de archivos.
- No provee label visible, descripcion ni aliases.
- Puede divergir de calculadoras si alguien mueve contenido de carpeta.
- No crea una taxonomia compartida real.

Esta opcion puede ayudar como validacion, pero no debe ser la fuente principal.

### Opcion 3: crear metadata compartida de categorias

Convertir `src/lib/constants/calculator-categories.ts` en una fuente general,
por ejemplo:

```txt
src/lib/constants/categories.ts
```

La constante compartida debe contener slug, label y metadata por contexto:

```ts
export const CATEGORIES = {
  "legal-impuestos": {
    slug: "legal-impuestos",
    label: "Legal e impuestos",
    calculatorDescription:
      "Herramientas para agregar o desglosar impuestos...",
    legacySlugs: ["legal-e-impuestos"],
  },
  "fecha-tiempo": {
    slug: "fecha-tiempo",
    label: "Fecha y tiempo",
    calculatorDescription:
      "Herramientas para calcular edades, intervalos...",
    legacySlugs: ["fecha-y-tiempo"],
  },
} as const;
```

Ventajas:

- Unifica la taxonomia de calculadoras y blog.
- Separa de forma explicita UI y URL.
- Permite redirects desde slugs anteriores.
- Permite validar categorias desconocidas o mal escritas.
- Escala para categorias futuras con slugs no derivados del label.

Desventajas:

- Requiere migrar imports y helpers.
- Requiere decidir como el blog referencia categorias: por label legacy o por
  slug canonico.

Esta es la opcion recomendada.

## Decision recomendada

Implementar la opcion 3 con una migracion en dos capas:

1. Crear `src/lib/constants/categories.ts` como fuente compartida.
2. Migrar el blog para que use `categorySlug` como identificador canonico.

El frontmatter ideal para articulos nuevos debe quedar asi:

```yaml
categorySlug: "legal-impuestos"
```

El label visible se obtiene desde `CATEGORIES[categorySlug].label`.

Durante la migracion se puede soportar temporalmente el campo legacy
`category: "Legal e impuestos"` para no romper contenido a medio mover, pero
la salida canonica debe depender siempre del slug compartido.

## Modelo propuesto

Crear `src/lib/constants/categories.ts`:

```ts
export interface CategoryMetadata {
  slug: string;
  label: string;
  calculatorDescription?: string;
  blogDescription?: string;
  legacySlugs?: string[];
}

export const CATEGORIES = {
  finanzas: {
    slug: "finanzas",
    label: "Finanzas",
    calculatorDescription: "...",
  },
  inmuebles: {
    slug: "inmuebles",
    label: "Inmuebles",
    calculatorDescription: "...",
  },
  "legal-impuestos": {
    slug: "legal-impuestos",
    label: "Legal e impuestos",
    calculatorDescription: "...",
    legacySlugs: ["legal-e-impuestos"],
  },
  matematicas: {
    slug: "matematicas",
    label: "Matematicas",
    calculatorDescription: "...",
  },
  salud: {
    slug: "salud",
    label: "Salud",
    calculatorDescription: "...",
  },
  "fecha-tiempo": {
    slug: "fecha-tiempo",
    label: "Fecha y tiempo",
    calculatorDescription: "...",
    legacySlugs: ["fecha-y-tiempo"],
  },
} as const satisfies Record<string, CategoryMetadata>;

export type CategorySlug = keyof typeof CATEGORIES;
export const CATEGORY_SLUGS = Object.keys(CATEGORIES) as CategorySlug[];
```

Helpers sugeridos:

```ts
export const getCategory = (slug: CategorySlug) => CATEGORIES[slug];

export const getCategoryByLabel = (label: string) =>
  CATEGORY_SLUGS.map((slug) => CATEGORIES[slug]).find(
    (category) => category.label === label,
  );

export const getCategoryBySlugOrLegacySlug = (slug: string) =>
  CATEGORY_SLUGS.map((key) => CATEGORIES[key]).find(
    (category) =>
      category.slug === slug || category.legacySlugs?.includes(slug),
  );
```

## Cambios tecnicos esperados

### Constantes compartidas

- Crear `src/lib/constants/categories.ts`.
- Mover la metadata actual de `CALCULATOR_CATEGORIES` a `CATEGORIES`.
- Renombrar `description` a `calculatorDescription` o mantener un campo
  compatible si se prefiere reducir el diff.
- Actualizar imports que hoy usan
  `@lib/constants/calculator-categories`.
- Si se necesita compatibilidad temporal, dejar
  `src/lib/constants/calculator-categories.ts` como re-export:

```ts
export {
  CATEGORIES as CALCULATOR_CATEGORIES,
  type CategorySlug as CalculatorCategorySlug,
} from "./categories";
```

La implementacion final ideal debe usar `@lib/constants/categories` en codigo
nuevo.

### Calculadoras

- Actualizar `src/lib/calculator-directory.ts` para leer desde `CATEGORIES`.
- Mantener `CalculatorCategorySlug` como alias o tipo derivado de
  `CategorySlug`.
- Validar que cada calculadora use un `categorySlug` existente.
- Validar que las categorias usadas por calculadoras tengan
  `calculatorDescription`.
- Conservar las URLs actuales de calculadoras:
  - `/legal-impuestos/calculadora-de-iva`
  - `/fecha-tiempo/calculadora-de-edad`

### Blog

Preferencia de modelo:

- Migrar `src/content.config.ts` de `category: z.string()` a
  `categorySlug: z.enum(CATEGORY_SLUGS)`.
- Actualizar los articulos publicados para usar `categorySlug`.
- Mostrar `CATEGORIES[post.data.categorySlug].label` en UI.
- Generar URLs con `post.data.categorySlug`.

Si se elige compatibilidad temporal:

- Aceptar `categorySlug` y `category` durante una fase corta.
- Resolver `category` legacy con `getCategoryByLabel(category)`.
- Lanzar error claro si el label no existe en `CATEGORIES`.
- Documentar `category` como deprecated.

Helpers de `src/lib/blog.ts` a ajustar:

- `getBlogPostCategorySlug(post)` debe devolver el slug compartido.
- `getCategoryUrl(categorySlug)` debe recibir slug canonico o metadata.
- `getCategoryPageUrl(categorySlug, page)` debe usar slug canonico.
- `getBlogCategories(posts)` debe agrupar por `categorySlug` y mostrar label
  desde metadata.
- `getBlogPostsByCategorySlug(posts, categorySlug)` debe filtrar por
  `categorySlug`.
- `getBlogRouteConflicts(posts)` debe validar contra slugs canonicos,
  `legacySlugs` y slugs reservados.

### Rutas y redirects del blog

Las rutas canonicas nuevas deben ser:

```txt
/blog/legal-impuestos
/blog/legal-impuestos/como-calcular-iva
/blog/legal-impuestos/pagina/<page>
/blog/fecha-tiempo
/blog/fecha-tiempo/<slug-del-articulo>
```

Se deben mantener redirects desde slugs anteriores:

```txt
/blog/legal-e-impuestos -> /blog/legal-impuestos
/blog/legal-e-impuestos/como-calcular-iva -> /blog/legal-impuestos/como-calcular-iva
/blog/legal-e-impuestos/pagina/2 -> /blog/legal-impuestos/pagina/2
/blog/categoria/legal-e-impuestos -> /blog/legal-impuestos
/blog/categoria/legal-e-impuestos/pagina/2 -> /blog/legal-impuestos/pagina/2
```

Y los redirects legacy de articulos de un segmento deben apuntar al nuevo slug:

```txt
/blog/como-calcular-iva -> /blog/legal-impuestos/como-calcular-iva
```

Para `Fecha y tiempo`, cuando existan articulos publicados de esa categoria,
se deben considerar redirects equivalentes desde `fecha-y-tiempo` hacia
`fecha-tiempo`.

### Sitemap

El filtro de sitemap debe excluir:

- URLs bajo `/blog/categoria/...`.
- URLs de articulos legacy de un segmento.
- URLs con slugs legacy de categoria, por ejemplo `/blog/legal-e-impuestos/...`.

El sitemap debe incluir solo las URLs canonicas con el slug compartido:

```txt
https://calculadoras.tools/blog/legal-impuestos/
https://calculadoras.tools/blog/legal-impuestos/como-calcular-iva/
```

### Documentacion editorial

Actualizar `specs/publicacion-articulos-blog.md`:

- La categoria del articulo debe referenciar el slug compartido.
- El label visible sale de `CATEGORIES`.
- Para una categoria nueva, primero se agrega metadata en
  `src/lib/constants/categories.ts`.
- La carpeta de contenido debe alinearse con el slug canonico.
- El ejemplo `Legal e impuestos` debe usar `/blog/legal-impuestos`.

Actualizar tambien la spec previa
`specs/features/rutas-categorias-blog-sin-prefijo.md` o dejar una nota de que
sus ejemplos de `legal-e-impuestos` quedan superados por esta migracion.

## Validaciones

Agregar o ampliar pruebas para cubrir:

1. Cada clave de `CATEGORIES` coincide con `metadata.slug`.
2. No hay labels duplicados.
3. No hay slugs duplicados entre `slug` y `legacySlugs`.
4. Ningun slug canonico o legacy usa palabras reservadas del blog:
   `pagina`, `categoria`.
5. `getCategoryByLabel("Legal e impuestos")` resuelve `legal-impuestos`.
6. `getCategoryByLabel("Fecha y tiempo")` resuelve `fecha-tiempo`.
7. `getCategoryUrl("legal-impuestos")` devuelve `/blog/legal-impuestos`.
8. `getBlogPostUrl(postDeIva)` devuelve
   `/blog/legal-impuestos/como-calcular-iva`.
9. `getCategoryUrl("fecha-tiempo")` devuelve `/blog/fecha-tiempo`.
10. Las calculadoras existentes siguen apuntando a categorias registradas.
11. Las categorias usadas por calculadoras tienen descripcion para calculadora.
12. Las rutas legacy de blog redirigen a la URL canonica nueva.

## Criterios de aceptacion

- Existe una fuente compartida de categorias en
  `src/lib/constants/categories.ts`.
- Calculadoras y blog usan esa fuente compartida para label y slug.
- La UI muestra `Legal e impuestos`.
- La URL canonica del blog usa `/blog/legal-impuestos`.
- El articulo de IVA se genera en
  `/blog/legal-impuestos/como-calcular-iva`.
- `/blog/legal-e-impuestos/como-calcular-iva` redirige a
  `/blog/legal-impuestos/como-calcular-iva`.
- `/blog/categoria/legal-e-impuestos` redirige a
  `/blog/legal-impuestos`.
- `/blog/como-calcular-iva` redirige a
  `/blog/legal-impuestos/como-calcular-iva`.
- Cuando exista contenido de `Fecha y tiempo`, la URL canonica del blog usa
  `/blog/fecha-tiempo`, no `/blog/fecha-y-tiempo`.
- El sitemap incluye `/blog/legal-impuestos/` y no incluye
  `/blog/legal-e-impuestos/`.
- `npm.cmd run test:unit:run` termina sin errores.
- `npm.cmd run build` termina sin errores.

## Fuera de alcance

- Cambiar slugs de articulos individuales.
- Cambiar URLs de calculadoras individuales.
- Cambiar diseno visual de paginas de categoria.
- Crear categorias nuevas sin contenido ni calculadoras asociadas.
- Reescribir todos los enlaces internos historicos del contenido si ya cuentan
  con redirect, aunque conviene hacerlo como limpieza SEO posterior.

## Plan de implementacion sugerido

1. Crear `src/lib/constants/categories.ts` con metadata compartida y aliases
   legacy.
2. Actualizar calculadoras para importar desde `categories.ts`.
3. Migrar schema y contenido del blog a `categorySlug`.
4. Ajustar helpers de `src/lib/blog.ts` para usar metadata compartida.
5. Ampliar redirects legacy en `src/pages/blog/[...legacy].astro`.
6. Actualizar filtro de sitemap para excluir slugs legacy de categoria.
7. Actualizar tests unitarios de blog y directorio de calculadoras.
8. Actualizar documentacion editorial.
9. Ejecutar `npm.cmd run test:unit:run`.
10. Ejecutar `npm.cmd run build`.

